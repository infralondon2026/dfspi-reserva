// @vitest-environment jsdom
import { describe, expect, it, vi } from "vitest";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createSupabaseAdapter } from "./store.supabase";

type Result = { data: unknown; error: { message: string } | null };

/** Chainable, awaitable stand-in for the supabase-js query builder. */
function queryBuilder(result: Result) {
  const builder: Record<string, unknown> = {};
  const chain = () => builder;
  for (const method of [
    "select",
    "eq",
    "order",
    "update",
    "upsert",
    "maybeSingle",
    "single",
  ]) {
    builder[method] = vi.fn(chain);
  }
  builder.then = (resolve: (value: Result) => unknown) =>
    Promise.resolve(result).then(resolve);
  // maybeSingle/single must terminate the chain with the result itself
  builder.maybeSingle = vi.fn(() => Promise.resolve(result));
  builder.single = vi.fn(() => Promise.resolve(result));
  return builder;
}

function mockClient(overrides: {
  tables?: Record<string, Result>;
  rpc?: Result;
  invoke?: ReturnType<typeof vi.fn>;
  auth?: Partial<SupabaseClient["auth"]>;
}) {
  const rpc = vi.fn(async () => overrides.rpc ?? { data: null, error: null });
  const invoke =
    overrides.invoke ??
    vi.fn(async () => ({ data: { ok: true }, error: null }));
  const from = vi.fn((table: string) =>
    queryBuilder(overrides.tables?.[table] ?? { data: [], error: null }),
  );
  const client = {
    from,
    rpc,
    functions: { invoke },
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(async () => ({ error: null })),
      getUser: vi.fn(async () => ({ data: { user: null } })),
      ...overrides.auth,
    },
  };
  return { client: client as unknown as SupabaseClient, rpc, invoke, from };
}

const productRow = {
  id: "prod-1",
  sku: "chivas-12",
  brand: "Chivas Regal",
  name: "Chivas Regal 12 Years",
  subtitle_es: "Whisky · 1 L",
  subtitle_pt: "Whisky · 1 L",
  description_es: "desc es",
  description_pt: "desc pt",
  image_url: "https://example.com/chivas.png",
  price_usd: "39.00",
  original_price_usd: "46.00",
  featured: true,
  category: { slug: "bebidas" },
  variants: [
    { id: "var-inactive", active: false, inventory: { available: 3 } },
    { id: "var-1", active: true, inventory: { available: 18 } },
  ],
};

describe("supabase adapter", () => {
  it("maps products/variants/inventory rows into the frontend Product shape", async () => {
    const { client } = mockClient({
      tables: { products: { data: [productRow], error: null } },
    });
    const products = await createSupabaseAdapter(client).listProducts();
    expect(products).toHaveLength(1);
    expect(products[0]).toMatchObject({
      id: "var-1",
      slug: "chivas-12",
      brand: "Chivas Regal",
      category: "bebidas",
      price: 39,
      originalPrice: 46,
      stock: 18,
      subtitle: { es: "Whisky · 1 L", pt: "Whisky · 1 L" },
    });
    expect(products[0].description.en).toContain("smooth Scotch whisky");
  });

  it("skips products without an active variant", async () => {
    const row = {
      ...productRow,
      variants: [{ id: "v", active: false, inventory: null }],
    };
    const { client } = mockClient({
      tables: { products: { data: [row], error: null } },
    });
    expect(await createSupabaseAdapter(client).listProducts()).toHaveLength(0);
  });

  it("creates reservations through the create_reservation RPC and sends the email", async () => {
    const { client, rpc, invoke } = mockClient({
      rpc: {
        data: {
          reservationCode: "IGZ-AB12-CD34",
          status: "confirmada",
          expiresAt: "2026-07-21T02:59:59.000Z",
          total: "78.00",
        },
        error: null,
      },
    });
    const adapter = createSupabaseAdapter(client);
    const reservation = await adapter.createReservation(
      { name: "Ada Lovelace", email: "ada@example.com", phone: "12345678" },
      "2026-07-20",
      [{ productId: "var-1", quantity: 2 }],
      "es",
    );
    expect(rpc).toHaveBeenCalledWith("create_reservation", {
      customer: {
        name: "Ada Lovelace",
        email: "ada@example.com",
        phone: "12345678",
      },
      pickup_date: "2026-07-20",
      items: [{ variant_id: "var-1", quantity: 2 }],
      locale: "es",
    });
    expect(reservation.code).toBe("IGZ-AB12-CD34");
    expect(reservation.total).toBe(78);
    expect(invoke).toHaveBeenCalledWith(
      "send-reservation-email",
      expect.objectContaining({
        body: {
          reservation: expect.objectContaining({
            code: "IGZ-AB12-CD34",
            email: "ada@example.com",
          }),
        },
      }),
    );
  });

  it("propagates RPC failures as errors without sending email", async () => {
    const { client, invoke } = mockClient({
      rpc: { data: null, error: { message: "insufficient_stock" } },
    });
    await expect(
      createSupabaseAdapter(client).createReservation(
        { name: "X", email: "x@example.com", phone: "1234567" },
        "2026-07-20",
        [{ productId: "var-1", quantity: 99 }],
        "es",
      ),
    ).rejects.toThrow("insufficient_stock");
    expect(invoke).not.toHaveBeenCalled();
  });

  it("still returns the reservation when the email invocation fails", async () => {
    const invoke = vi.fn(async () => {
      throw new Error("edge function down");
    });
    const { client } = mockClient({
      invoke,
      rpc: {
        data: {
          reservationCode: "IGZ-EE11-FF22",
          status: "confirmada",
          expiresAt: "x",
          total: 10,
        },
        error: null,
      },
    });
    const reservation = await createSupabaseAdapter(client).createReservation(
      { name: "X", email: "x@example.com", phone: "1234567" },
      "2026-07-20",
      [{ productId: "var-1", quantity: 1 }],
      "pt",
    );
    expect(reservation.code).toBe("IGZ-EE11-FF22");
  });

  it("looks reservations up by code+email via get_reservation and maps items", async () => {
    const { client, rpc } = mockClient({
      rpc: {
        data: {
          id: "res-1",
          code: "IGZ-AB12-CD34",
          customer_name: "Ada",
          customer_email: "ada@example.com",
          customer_phone: "123",
          pickup_date: "2026-07-20",
          expires_at: "2026-07-21T02:59:59.000Z",
          created_at: "2026-07-16T10:00:00.000Z",
          status: "confirmada",
          locale: "es",
          total_usd: "39.00",
          items: [{ variant_id: "var-1", quantity: 1 }],
        },
        error: null,
      },
    });
    const found = await createSupabaseAdapter(client).findReservation(
      "igz-ab12-cd34 ",
      " ADA@example.com",
    );
    expect(rpc).toHaveBeenCalledWith("get_reservation", {
      lookup_code: "igz-ab12-cd34",
      lookup_email: "ada@example.com",
    });
    expect(found).toMatchObject({
      code: "IGZ-AB12-CD34",
      total: 39,
      items: [{ productId: "var-1", quantity: 1 }],
    });
  });

  it("returns null when the reservation is not found", async () => {
    const { client } = mockClient({ rpc: { data: null, error: null } });
    expect(
      await createSupabaseAdapter(client).findReservation(
        "IGZ-XXXX-XXXX",
        "a@b.com",
      ),
    ).toBeNull();
  });

  it("rejects sign-in for users without an active admin_users row", async () => {
    const { client } = mockClient({
      tables: { admin_users: { data: null, error: null } },
      auth: {
        signInWithPassword: vi.fn(async () => ({
          data: { user: { id: "user-1", email: "user@example.com" } },
          error: null,
        })) as never,
        getUser: vi.fn(async () => ({
          data: { user: { id: "user-1", email: "user@example.com" } },
        })) as never,
      },
    });
    await expect(
      createSupabaseAdapter(client).signIn("user@example.com", "secret"),
    ).rejects.toThrow("not_admin");
  });

  it("signs an admin in and returns their role", async () => {
    const { client } = mockClient({
      tables: {
        admin_users: {
          data: { role: "operations", active: true },
          error: null,
        },
      },
      auth: {
        signInWithPassword: vi.fn(async () => ({
          data: { user: { id: "admin-1", email: "ops@dfspi.com" } },
          error: null,
        })) as never,
        getUser: vi.fn(async () => ({
          data: { user: { id: "admin-1", email: "ops@dfspi.com" } },
        })) as never,
      },
    });
    const session = await createSupabaseAdapter(client).signIn(
      "ops@dfspi.com",
      "secret",
    );
    expect(session).toEqual({ email: "ops@dfspi.com", role: "operations" });
  });

  it("subscribes to the newsletter via the subscribers table", async () => {
    const { client, from } = mockClient({
      tables: { newsletter_subscribers: { data: null, error: null } },
    });
    await createSupabaseAdapter(client).subscribeNewsletter(
      "  Foo@Example.com ",
      "es",
    );
    expect(from).toHaveBeenCalledWith("newsletter_subscribers");
  });

  it("rejects newsletter signup when the table write fails", async () => {
    const { client } = mockClient({
      tables: {
        newsletter_subscribers: { data: null, error: { message: "db down" } },
      },
    });
    await expect(
      createSupabaseAdapter(client).subscribeNewsletter(
        "foo@example.com",
        "pt",
      ),
    ).rejects.toThrow("db down");
  });

  it("updates reservation status through release_reservation_stock", async () => {
    const { client, rpc } = mockClient({
      tables: { reservations: { data: { id: "res-9" }, error: null } },
      rpc: { data: null, error: null },
    });
    await createSupabaseAdapter(client).setReservationStatus(
      "IGZ-AB12-CD34",
      "cancelada",
    );
    expect(rpc).toHaveBeenCalledWith("release_reservation_stock", {
      reservation_id: "res-9",
      new_status: "cancelada",
    });
  });
});
