/* Client-face Typert remote manifest for dsh-usage-opencode-go (hand-written).
   The schema is a minimal strict codec: the host already zod-validated its
   result, so the client only enforces the strict codec contract shape. */
const opencodeUsageSnapshotResult$schema = {
parse(value) {
if (!value || typeof value !== "object" || Array.isArray(value)) {
throw new TypeError("expected an opencode usage snapshot object");
}
const window = (entry) => {
if (entry === null || entry === undefined) return null;
if (typeof entry !== "object") return null;
return {
percent: typeof entry.percent === "number" ? entry.percent : null,
resetsAt: typeof entry.resetsAt === "string" ? entry.resetsAt : null
};
};
return {
rolling: window(value.rolling),
weekly: window(value.weekly),
monthly: window(value.monthly)
};
}
};

export const TYPERT_REMOTE = {
package: "dsh-usage-opencode-go",
descriptors: [
{
id: "dsh-usage-opencode-go#opencodeUsage/snapshot",
service: "opencodeUsage",
namespace: "opencodeUsage",
method: "snapshot",
invocation: { kind: "direct" },
parameters: [],
result: {
mode: "strict",
typeSymbol: "dsh-usage-opencode-go/types#OpencodeUsageSnapshot",
schema: opencodeUsageSnapshotResult$schema
},
sourceLocation: { file: "lib/index.js", line: 1, column: 1 }
}
]
};

export default TYPERT_REMOTE;
