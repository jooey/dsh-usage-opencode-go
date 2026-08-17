/**
 * Dependency-free core logic for dsh-usage-opencode-go.
 *
 * Everything here resolves only against Web/Node platform globals (fetch,
 * AbortSignal), so it can be imported from plain Node tooling and smoke tests
 * without the DSH packages.
 */

/** Official OpenCode Zen Go usage endpoint. */
export const USAGE_URL = "https://opencode.ai/zen/go/v1/usage";
/** Invitation/referral landing page. */
export const REFERRAL_URL = "https://opencode.ai/go?ref=8G7C93YWQ7";
/** Credential reference resolved through the harness credentials seam. */
export const API_KEY_REF = "OPENCODE_GO_API_KEY";
/** Hard network ceiling so an unresponsive endpoint cannot hang a turn. */
export const TIMEOUT_MS = 20000;

/** Human labels keyed by the API's usage window ids. */
export const WINDOW_TITLES = {
rolling: "Rolling (3d)",
weekly: "Weekly",
monthly: "Monthly"
};

/** Fetch and shape the usage payload without formatting it. */
export async function fetchUsage(ctx) {
const credential = await ctx.credentials.resolve(API_KEY_REF);
if (!credential || typeof credential.value !== "string" || credential.value.length === 0) {
return { ok: false, error: `${API_KEY_REF} is not configured. Store it in ~/.dsh/.credentials.yaml or set it as an environment variable.` };
}
const response = await fetch(USAGE_URL, {
headers: {
Authorization: `Bearer ${credential.value}`,
Accept: "application/json"
},
// AbortSignal.timeout is available on the Node version dsh runs on.
signal: AbortSignal.timeout(TIMEOUT_MS)
});
if (!response.ok) {
return { ok: false, error: `OpenCode usage API returned HTTP ${response.status}` };
}
let body;
try {
body = await response.json();
} catch (error) {
return { ok: false, error: `OpenCode usage API returned a non-JSON response: ${error instanceof Error ? error.message : String(error)}` };
}
return { ok: true, usage: body?.usage };
}

/** Render one usage window value as a percent string, tolerating absence. */
export function formatPercent(value) {
const n = Number(value);
if (!Number.isFinite(n)) return "n/a";
// The API already reports whole-number percents (e.g. 7 === 7%), so
// display the value directly with one decimal place.
return `${n.toFixed(1)}%`;
}

/** Render each usage window to one text line; unknown windows are dropped. */
export function formatUsages(usage) {
if (!usage || typeof usage !== "object") return "No usage data returned.";
const lines = [];
for (const [windowKey, window] of Object.entries(usage)) {
if (!window || typeof window !== "object") continue;
const label = WINDOW_TITLES[windowKey] ?? windowKey;
const status = window.status === "ok" ? "up" : String(window.status ?? "unknown");
const percent = formatPercent(window.percent);
const reset = typeof window.resetsAt === "string" ? ` · resets ${window.resetsAt}` : "";
lines.push(`${label}: ${percent} used (status: ${status})${reset}`);
}
return lines.length > 0 ? lines.join("\n") : "No usage windows returned.";
}

/** Normalize one API usage window for the wire; unknown/absent windows become null. */
export function normalizeWindow(window) {
if (!window || typeof window !== "object") return null;
return {
percent: Number.isFinite(Number(window.percent)) ? Number(window.percent) : null,
resetsAt: typeof window.resetsAt === "string" ? window.resetsAt : null
};
}

/** Fetch and normalize the usage snapshot, throwing a descriptive error on any failure. */
export async function fetchUsageSnapshot(credentials) {
const credential = await credentials.resolve(API_KEY_REF);
if (!credential || typeof credential.value !== "string" || credential.value.length === 0) {
throw new Error(`${API_KEY_REF} is not configured. Store it in ~/.dsh/.credentials.yaml or set it as an environment variable.`);
}
const response = await fetch(USAGE_URL, {
headers: {
Authorization: `Bearer ${credential.value}`,
Accept: "application/json"
},
signal: AbortSignal.timeout(TIMEOUT_MS)
});
if (!response.ok) {
throw new Error(`OpenCode usage API returned HTTP ${response.status}`);
}
let body;
try {
body = await response.json();
} catch (error) {
throw new Error(`OpenCode usage API returned a non-JSON response: ${error instanceof Error ? error.message : String(error)}`);
}
const usage = body && typeof body === "object" ? body.usage : undefined;
return {
rolling: normalizeWindow(usage?.rolling),
weekly: normalizeWindow(usage?.weekly),
monthly: normalizeWindow(usage?.monthly)
};
}
