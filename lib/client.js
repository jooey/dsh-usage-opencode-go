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
/** Provider id that owns this readout; other providers render nothing. */
const OPENCODE_GO_PROVIDER = "opencode-go";

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

/** Format an ISO reset timestamp into a short "Xd Yh Ym" countdown string. */
function formatRemainsShort(isoString) {
  if (typeof isoString !== "string") return null;
  const ts = Date.parse(isoString);
  if (!Number.isFinite(ts)) return null;
  const diffMs = ts - Date.now();
  if (diffMs <= 0) return null;
  const totalSec = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const minutes = Math.floor((totalSec % 3600) / 60);
  const parts = [];
  if (days > 0) parts.push(days + "d");
  if (hours > 0 || days > 0) parts.push(hours + "h");
  parts.push(minutes + "m");
  return parts.join(" ");
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

/** Outer gate: never mount the hook-using chip unless a model directory store is available. */
function UsageChip(props) {
  if (!props.directory) return null;
  return React.createElement(OpenCodeGoUsageChip, props);
}

/** One-time injected keyframes for the overflow marquee effect. */
const MARQUEE_STYLE_ID = "opencode-usage-marquee-style";

/** Upper bound for the chip at wide row widths (the original fixed cap). */
const CHIP_MAX_WIDTH = 320;
/** Below this measured width the text is useless — keep the icon only. */
const CHIP_TEXT_MIN_WIDTH = 80;

/**
 * Fit the chip to the space the composer row actually leaves over.
 *
 * The shell renders this chip as a direct item of the `.trailing` group, which
 * is `flex:none` (it hugs its content and never shrinks), while the left
 * `.tools` group (attach / "Full access" / plan) does shrink. A fixed
 * `max-width` therefore either overlaps the left group when the page narrows
 * or needlessly truncates the text when it doesn't. Instead, measure the real
 * layout — the row's inner width minus the left tools and the trailing group's
 * other items — and cap the chip at exactly the remainder.
 */
function fitChipWidth(chip, onCap) {
  const slotWrapper = chip.closest("[data-slot]");
  const trailing = slotWrapper ? slotWrapper.parentElement : null;
  const row = trailing ? trailing.parentElement : null;
  if (!trailing || !row) return null;
  const tools = row.firstElementChild !== trailing ? row.firstElementChild : null;

  const fit = () => {
    if (!chip.isConnected) return;
    const cs = getComputedStyle(row);
    const inner = row.clientWidth - (parseFloat(cs.paddingLeft) || 0) - (parseFloat(cs.paddingRight) || 0);
    const gap = parseFloat(cs.gap) || 0;
    const toolsWidth = tools ? tools.scrollWidth : 0;
    const othersWidth = trailing.scrollWidth - chip.offsetWidth;
    const target = inner - gap - toolsWidth - othersWidth;
    onCap(Math.max(0, Math.min(CHIP_MAX_WIDTH, target)));
  };

  fit();
  const observer = new ResizeObserver(fit);
  observer.observe(row);
  observer.observe(trailing);
  return () => observer.disconnect();
}

/** Marquee: on hover, when the content overflows, slide it left and loop. */
function ensureMarqueeStyle() {
  if (typeof document === "undefined" || document.getElementById(MARQUEE_STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = MARQUEE_STYLE_ID;
  style.textContent = [
    "@keyframes opencodeUsageMarquee {",
    "  0%, 10% { transform: translateX(0); }",
    "  90%, 100% { transform: translateX(var(--marquee-shift, -100%)); }",
    "}",
    ".opencode-usage-marquee:hover .opencode-usage-marquee-track {",
    "  animation: opencodeUsageMarquee 9s linear infinite;",
    "}"
  ].join("\n");
  document.head.appendChild(style);
}

/**
 * Composer bottom-right readout. Mounts only while the session's selected
 * provider is `opencode-go`; any other provider renders null so the readout
 * disappears. While visible it shows rolling / weekly / monthly percentages
 * with reset countdowns, refreshed every 60 seconds. When the content is
 * wider than the chip, hovering scrolls it marquee-style so the tail stays
 * readable; the full text is always in the title tooltip.
 */
function OpenCodeGoUsageChip(props) {
  const directory = props.directory;
  const snapshot = props.snapshot;

  const state = React.useSyncExternalStore(
    (fn) => directory.subscribe(fn),
    () => directory.getSnapshot()
  );
  const isOpenCodeGo = !!(state && state.current && state.current.provider === OPENCODE_GO_PROVIDER);

  const [data, setData] = React.useState(null);
  const [failed, setFailed] = React.useState(false);
  const chipRef = React.useRef(null);
  const [chipCap, setChipCap] = React.useState(CHIP_MAX_WIDTH);

  // Fit the chip to the space the composer row actually leaves over, and
  // re-fit whenever the row or the trailing group relayouts.
  React.useLayoutEffect(() => {
    if (!isOpenCodeGo) return;
    const chip = chipRef.current;
    if (!chip) return;
    return fitChipWidth(chip, setChipCap);
  }, [isOpenCodeGo]);

  // Measure overflow once data lands (and periodically, since percentages
  // change every 60s): sets --marquee-shift to the exact overflow distance.
  React.useEffect(() => {
    const el = chipRef.current;
    if (!el) return;
    const measure = () => {
      // The track takes its natural (max-content) width and is animated inside
      // the stationary clip wrapper (the span that follows the icon).
      // Overflow = track wider than the clip wrapper.
      const clip = el.querySelector(".opencode-usage-marquee-clip");
      const track = el.querySelector(".opencode-usage-marquee-track");
      if (!clip || !track) return;
      const trackWidth = track.getBoundingClientRect().width;
      const over = trackWidth - clip.clientWidth > 2;
      el.style.setProperty("--marquee-shift", over ? `-${trackWidth - clip.clientWidth + 8}px` : "0px");
    };
    measure();
    const timer = setInterval(measure, 5000);
    return () => clearInterval(timer);
  }, [data]);

  React.useEffect(() => {
    if (!isOpenCodeGo) return;
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
  }, [snapshot, isOpenCodeGo]);

  ensureMarqueeStyle();

  if (!isOpenCodeGo) return null;

  const entry = (windowKey, label) => {
    if (data && data[windowKey]) {
      const win = data[windowKey];
      const tail = win.resetsAt ? formatRemainsShort(win.resetsAt) : null;
      return React.createElement("span", {
        key: windowKey,
        style: { whiteSpace: "nowrap" }
      }, label, " ", formatPercent(win.percent), tail ? " (" + tail + ")" : "");
    }
    return React.createElement("span", {
      key: windowKey,
      style: { whiteSpace: "nowrap", opacity: 0.6 }
    }, label, " ", failed ? "n/a" : "…");
  };

  return React.createElement(
    "a",
    {
      ref: chipRef,
      href: REFERRAL_URL,
      target: "_blank",
      rel: "noreferrer noopener",
      title: failed ? "OpenCode Go usage unavailable" : "OpenCode Go (zen/go) usage · get OpenCode Go",
      className: "opencode-usage-marquee",
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
        minWidth: "0",
        maxWidth: chipCap + "px"
      }
    },
    React.createElement(OpenCodeGoIcon, {
      style: { flex: "none", color: "var(--dsw-alias-label-tertiary)" }
    }),
    React.createElement(
      "span",
      {
        key: "clip",
        className: "opencode-usage-marquee-clip",
        style: {
          // The stationary clip box: sits AFTER the icon in the flex row, so
          // the scrolling track can never travel under the icon — the marquee
          // is physically confined to this wrapper's box.
          display: chipCap < CHIP_TEXT_MIN_WIDTH ? "none" : "inline-flex",
          alignItems: "center",
          overflow: "hidden",
          flex: "0 1 auto",
          minWidth: "0"
        }
      },
      React.createElement(
        "span",
        {
          key: "track",
          className: "opencode-usage-marquee-track",
          style: {
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            whiteSpace: "nowrap",
            // Natural width, never shrinks: the track may exceed the clip
            // wrapper and gets clipped here. The marquee animation translates
            // THIS element while the clip box stays put.
            flex: "0 0 auto",
            width: "max-content"
          }
        },
        entry("rolling", "Rolling"),
        React.createElement("span", { key: "sep1", style: { opacity: 0.4 } }, "·"),
        entry("weekly", "Weekly"),
        React.createElement("span", { key: "sep2", style: { opacity: 0.4 } }, "·"),
        entry("monthly", "Monthly")
      )
    )
  );
}

/**
 * Client body: mount the remote capability, then register the composer readout
 * through a scoped injection that exposes the session's model directory so the
 * chip can subscribe to the currently selected provider and hide itself for
 * non-OpenCode-Go models.
 */
async function apply(ctx) {
  await ctx.remote.$mount(TYPERT_REMOTE);
  // ctx.get() reads the mounted namespace service without requiring a declared
  // inject edge, which would deadlock a self-mounting plugin.
  const opencodeUsage = ctx.get("remote.opencodeUsage");

  ctx.slots.inject("conversation.input.right", () => ctx.slots.register({
    name: "conversation.input.right",
    id: "opencode-usage",
    order: 0,
    inject: (sessionId) => {
      let directory = null;
      try {
        directory = ctx.modelDirectories.directoryFor(sessionId).store;
      } catch {
        directory = null;
      }
      return {
        directory,
        snapshot: () => opencodeUsage.snapshot()
      };
    }
  }, UsageChip));
}

const inject = ["slots", "remote", "modelDirectories"];

exports.apply = apply;
exports.inject = inject;
return module.exports;
}
});
