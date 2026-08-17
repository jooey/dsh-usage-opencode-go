window.__ModuleLoader__.load({
id: "dsh-usage-opencode-go",
factory: (require) => {
var module = { exports: {} };
var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });

let React = require("react");

/* Client-face Typert remote manifest (hand-written, no build step). */
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

/** Invitation/referral landing page (kept in sync with lib/logic.js). */
const REFERRAL_URL = "https://opencode.ai/go?ref=8G7C93YWQ7";

const TYPERT_REMOTE = {
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

/** Format one percent value for the compact composer readout. */
function formatPercent(value) {
const n = Number(value);
if (!Number.isFinite(n)) return "n/a";
return n.toFixed(1) + "%";
}

/** Small OpenCode Go glyph drawn inline so it follows the active theme. */
function OpenCodeGoIcon(props) {
return React.createElement("svg", Object.assign({
width: 14,
height: 14,
viewBox: "0 0 300 300",
"aria-hidden": true,
focusable: false,
fill: "none"
}, props), [
React.createElement("path", {
key: "inner",
d: "M180 240H60V120H180V240Z",
transform: "translate(30, 0)",
fill: "currentColor",
opacity: 0.42
}),
React.createElement("path", {
key: "outer",
d: "M180 60H60V240H180V60ZM240 300H0V0H240V300Z",
transform: "translate(30, 0)",
fill: "currentColor"
})
]);
}

/** Composer bottom-right readout: icon + rolling / weekly / monthly percentages. */
function UsageChip(props) {
const snapshot = props.snapshot;
const [data, setData] = React.useState(null);
const [failed, setFailed] = React.useState(false);

React.useEffect(() => {
let alive = true;
const load = async () => {
try {
const result = await snapshot();
if (!alive) return;
if (result && result.ok) {
setData(result.value);
setFailed(false);
} else {
setData(null);
setFailed(true);
}
} catch {
if (alive) {
setData(null);
setFailed(true);
}
}
};
load();
const timer = setInterval(load, 60000);
return () => {
alive = false;
clearInterval(timer);
};
}, [snapshot]);

const entry = (window, label) => {
if (data && data[window]) {
return React.createElement("span", {
key: window,
style: { whiteSpace: "nowrap" }
}, label, " ", formatPercent(data[window].percent));
}
return React.createElement("span", {
key: window,
style: { whiteSpace: "nowrap", opacity: 0.6 }
}, label, " ", failed ? "n/a" : "…");
};

return React.createElement(
"a",
{
href: REFERRAL_URL,
target: "_blank",
rel: "noreferrer noopener",
title: failed ? "OpenCode Go usage unavailable" : "OpenCode Go (zen/go) usage · get OpenCode Go",
style: {
display: "inline-flex",
alignItems: "center",
gap: "6px",
height: "100%",
fontSize: "12px",
fontWeight: 500,
lineHeight: 1,
color: "var(--dsw-alias-label-tertiary)",
textDecoration: "none",
cursor: "pointer",
whiteSpace: "nowrap",
maxWidth: "320px",
overflow: "hidden"
}
},
React.createElement(OpenCodeGoIcon, {
style: { flex: "none", color: "var(--dsw-alias-label-tertiary)" }
}),
entry("rolling", "Rolling"),
React.createElement("span", { key: "sep1", style: { opacity: 0.4 } }, "·"),
entry("weekly", "Weekly"),
React.createElement("span", { key: "sep2", style: { opacity: 0.4 } }, "·"),
entry("monthly", "Monthly")
);
}

/** Client body: mount the remote capability, then register the composer readout. */
async function apply(ctx) {
await ctx.remote.$mount(TYPERT_REMOTE);
// ctx.get() reads the mounted namespace service without requiring a declared
// inject edge, which would deadlock a self-mounting plugin.
const opencodeUsage = ctx.get("remote.opencodeUsage");
ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
name: "conversation.input.right",
id: "opencode-usage",
order: 0,
inject: () => ({
snapshot: () => opencodeUsage.snapshot()
})
}, UsageChip));
}

const inject = ["slots", "remote"];

exports.apply = apply;
exports.inject = inject;
return module.exports;
}
});
