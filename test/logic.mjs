// Standalone smoke test for the dsh-usage-opencode-go plugin core logic
// (imports lib/logic.js, which is dependency-free).
// Runs WITHOUT DSH: provides a fake ctx.credentials backed by a key from the
// real credentials file, calls fetchUsage + formatUsages, and prints the result.
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const here = dirname(fileURLToPath(import.meta.url)); // .../dsh-usage-opencode-go/test
const pluginDir = dirname(here); // .../dsh-usage-opencode-go
const { fetchUsage, formatUsages } = await import(pathToFileURL(join(pluginDir, "lib", "logic.js")).href);

// Read the real key without printing it. On Windows use USERPROFILE, on
// POSIX fall back to HOME (USERPROFILE is undefined on non-Windows).
const home = process.env.USERPROFILE || process.env.HOME || process.env.HOMEPATH;
if (!home) {
	console.error("Cannot determine the home directory; set USERPROFILE or HOME.");
	process.exit(1);
}
const credentialsPath = join(home, ".dsh", ".credentials.yaml");
let key = undefined;
try {
	const text = readFileSync(credentialsPath, "utf8");
	for (const line of text.split(/\r?\n/)) {
		const m = /^OPENCODE_GO_API_KEY\s*:\s*(.+)$/.exec(line.trim());
		if (m) key = m[1].trim();
	}
} catch {
	/* ignore */
}
if (!key) {
	console.error("FAILED: OPENCODE_GO_API_KEY is not configured in " + credentialsPath);
	process.exit(1);
}

const ctx = {
	credentials: {
		async resolve(ref) {
			return ref === "OPENCODE_GO_API_KEY" && key ? { value: key, source: "file" } : undefined;
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
console.log("--- formatted (/usage output) ---");
console.log(formatUsages(result.usage));
