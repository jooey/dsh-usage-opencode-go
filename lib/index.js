/**
 * dsh-usage-opencode-go
 *
 * Human-facing `/usage-opencode-go` command for the OpenCode Go (Zen Go) subscription, plus a
 * browser composer readout (bottom-right tool row) fed by a Typert remote service.
 *
 * The OPENCODE_GO_API_KEY credential is resolved through the harness credentials
 * seam on the HOST (kept server-side; never inlined into the browser), the official
 * quota API `GET https://opencode.ai/zen/go/v1/usage` is queried, and the rolling /
 * weekly / monthly usage percentages are rendered inline.
 */

import { TypertRemoteService } from "@deepseek-ai/dsh-typert-protocol";
import { API_KEY_REF, REFERRAL_URL, fetchUsage, formatPercent, formatUsages, fetchUsageSnapshot } from "./logic.js";

const name = "dsh-usage-opencode-go";
const inject = ["commands", "credentials"];

/**
 * Host-side remote service exposing the latest usage snapshot to the browser.
 *
 * Mounted as a Typert remote service; the `./typert` manifest registers the
 * `opencodeUsage/snapshot` endpoint, and the client mounts it via `ctx.remote`.
 */
class OpencodeUsageGateway extends TypertRemoteService {
  static inject = ["credentials"];

  constructor(ctx) {
    super(ctx, "opencodeUsage");
  }

  /** Latest normalized usage snapshot; throws on credential/network/API failure. */
  async snapshot() {
    return fetchUsageSnapshot(this.ctx.credentials);
  }
}

/** Register the `/usage-opencode-go` command and mount the browser remote gateway. */
async function apply(ctx) {
  await ctx.plugin(OpencodeUsageGateway);
  ctx.commands.register({
    name: "usage-opencode-go",
    description: "Show OpenCode Go (zen/go) subscription usage",
    handler: async () => {
      try {
        const result = await fetchUsage(ctx);
        if (!result.ok) return { kind: "error", text: `OpenCode Go usage: ${result.error}` };
        return { kind: "success", text: `OpenCode Go (zen/go) usage\n\n${formatUsages(result.usage)}\n\nGet OpenCode Go: ${REFERRAL_URL}` };
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error);
        return { kind: "error", text: `OpenCode Go usage failed: ${detail}` };
      }
    }
  });
}

// fetchUsage / formatUsages / fetchUsageSnapshot are re-exported for
// standalone smoke tests; the loader only consumes the Cordis plugin contract
// ({ name, inject, apply }).
export { apply, inject, name, fetchUsage, formatPercent, formatUsages, fetchUsageSnapshot, OpencodeUsageGateway, API_KEY_REF };
