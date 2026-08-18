// Standalone smoke test for the dsh-usage-opencode-go plugin core logic
// (imports lib/logic.js, which is dependency-free).
// Runs WITHOUT DSH: provides a fake ctx.credentials backed by a key from the
// real credentials file OR an `OPENCODE_GO_API_KEY` environment variable, calls
// fetchUsage + formatUsages, and prints the result.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url)); // .../dsh-opencode-usage/test
const pluginDir = dirname(here); // .../dsh-opencode-usage
const { fetchUsage, fetchUsageSnapshot, formatPercent, formatUsages, normalizeWindow } =
  await import(pathToFileURL(join(pluginDir, "lib", "logic.js")).href);

// Resolve the key with the same priority the plugin uses at runtime:
//   1. OPENCODE_GO_API_KEY env var (universal — works in any Node.js context)
//   2. ~/.dsh/.credentials.yaml (DSH convention)
const home = process.env.USERPROFILE || process.env.HOME || process.env.HOMEPATH;
if (!home) {
  console.error("Cannot determine the home directory; set USERPROFILE or HOME.");
  process.exit(1);
}

let key = process.env.OPENCODE_GO_API_KEY;
let keySource = key ? "env" : null;
if (!key) {
  const credentialsPath = join(home, ".dsh", ".credentials.yaml");
  try {
    const text = readFileSync(credentialsPath, "utf8");
    for (const line of text.split(/\r?\n/)) {
      const m = /^OPENCODE_GO_API_KEY\s*:\s*(.+)$/.exec(line.trim());
      if (m) { key = m[1].trim(); keySource = "credentials.yaml"; }
    }
  } catch {
    /* ignore */
  }
}
if (!key) {
  console.error("FAILED: OPENCODE_GO_API_KEY is not configured. Set it via one of:");
  console.error("  (1) export OPENCODE_GO_API_KEY=<key>");
  console.error("  (2) ~/.dsh/.credentials.yaml → OPENCODE_GO_API_KEY: <key>");
  process.exit(1);
}
console.log(`key resolved from: ${keySource}`);

const ctx = {
  credentials: {
    async resolve(ref) {
      return ref === "OPENCODE_GO_API_KEY" && key ? { value: key, source: keySource } : undefined;
    }
  }
};

const result = await fetchUsage(ctx);
if (!result.ok) {
  console.error("FAILED:", result.error);
  process.exit(1);
}
console.log("OK fetchUsage. usage keys:", Object.keys(result.usage).join(", "));
console.log("--- raw ---");
console.log(JSON.stringify(result.usage, null, 2));
console.log("--- formatted (/usage-opencode-go output) ---");
console.log(formatUsages(result.usage));
console.log("--- normalized snapshot ---");
const snapshot = await fetchUsageSnapshot(ctx.credentials);
console.log(JSON.stringify(snapshot, null, 2));
console.log("--- formatPercent ---");
console.log("formatPercent(7):", formatPercent(7));
console.log("formatPercent(0):", formatPercent(0));
console.log("formatPercent(null):", formatPercent(null));
console.log("--- normalizeWindow ---");
console.log("normalizeWindow(null):", normalizeWindow(null));
console.log("normalizeWindow({percent:50,resetsAt:'2026-01-01'}):", JSON.stringify(normalizeWindow({ percent: 50, resetsAt: "2026-01-01" })));
