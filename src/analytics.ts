type AnalyticsValue = string | number | boolean | undefined;

const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT?.trim();

/**
 * Privacy-first event adapter. It never stores cookies or sends names, emails,
 * phone numbers, free-text searches, or chatbot messages. When no approved
 * endpoint is configured it remains a safe no-op in production.
 */
export function track(
  event: string,
  properties: Record<string, AnalyticsValue> = {},
) {
  const safeProperties = Object.fromEntries(
    Object.entries(properties).filter(([, value]) => value !== undefined),
  );
  const detail = {
    event,
    properties: safeProperties,
    path: window.location.pathname,
    occurredAt: new Date().toISOString(),
  };

  window.dispatchEvent(new CustomEvent("dfspi:analytics", { detail }));

  if (!endpoint) return;
  const body = JSON.stringify(detail);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      endpoint,
      new Blob([body], { type: "application/json" }),
    );
    return;
  }
  void fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    credentials: "omit",
    keepalive: true,
  }).catch(() => undefined);
}
