// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { track } from "./analytics";

describe("privacy-first analytics", () => {
  it("emits only the approved event properties", () => {
    let captured: CustomEvent | undefined;
    window.addEventListener(
      "dfspi:analytics",
      (event) => {
        captured = event as CustomEvent;
      },
      { once: true },
    );

    track("catalog_search", { locale: "es", queryLength: 12 });

    expect(captured?.detail).toMatchObject({
      event: "catalog_search",
      properties: { locale: "es", queryLength: 12 },
    });
    expect(JSON.stringify(captured?.detail)).not.toContain("email");
  });
});
