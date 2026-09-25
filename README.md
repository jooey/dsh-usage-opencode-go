<p align="center">
  <img src="https://img.shields.io/npm/v/dsh-usage-opencode-go" alt="npm version" />
  <img src="https://img.shields.io/npm/dw/dsh-usage-opencode-go" alt="npm downloads" />
  <img src="https://img.shields.io/npm/l/dsh-usage-opencode-go" alt="license" />
</p>

<h1 align="center">dsh-usage-opencode-go</h1>

<p align="center">
  <strong>极简 DSH 用量监控 · Minimal DSH usage monitor</strong>
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-usage-opencode-go">npm</a>
  · <a href="https://github.com/jooey/dsh-usage-opencode-go">GitHub</a>
  · <a href="#install-install">Install</a>
</p>

---

**中文** · [English](#english)

把 OpenCode Go（Zen Go）订阅配额放进 DSH 对话界面：输入 `/usage-opencode-go` 查看完整报告；选中 OpenCode Go 模型时，输入框右下角常驻读条，每分钟自动刷新。切到其他模型自动隐藏。

- **右下角读条**：`Rolling x% (倒计时) · Weekly x% (倒计时) · Monthly x% (倒计时)`，内容超宽时鼠标悬停跑马灯滚动
- **`/usage-opencode-go` 命令**：三个窗口的百分比 + 重置时间
- **密钥安全**：只在 DSH 主机端解析，绝不进浏览器
- **邀请注册**：[OpenCode Go](https://opencode.ai/go?ref=8G7C93YWQ7) 新用户有注册福利

## 系列插件 / Family

同一套极简监控，覆盖五家服务商，格式统一（`Rolling x% (倒计时) · Weekly …`）：

| 插件 | 服务商 | 监控内容 |
|---|---|---|
| `dsh-usage-opencode-go` | OpenCode Go | Rolling / Weekly / Monthly 配额 |
| `dsh-usage-deepseek` | DeepSeek | 账户余额 + 波峰/波谷 |
| `dsh-usage-minimax-cn` | MiniMax Coding Plan | coding / video 分服务配额 |
| `dsh-usage-kimi-cn` | Kimi Coding Plan | Rolling / Weekly 配额 |
| `dsh-usage-glm-cn` | Z.ai GLM Coding Plan | Rolling / Weekly / MCP 配额 |

## 先决条件 / Prerequisites

- 已安装 **DSH**（Node.js >= 20）：`npm install -g @deepseek-ai/dsh`
- **OpenCode Go API Key**，写入 `~/.dsh/.credentials.yaml`：

```yaml
OPENCODE_GO_API_KEY: <你的 key>
```

（或 `export OPENCODE_GO_API_KEY=<key>`）

## Install 安装

```bash
cd ~/.dsh/profiles
npm install dsh-usage-opencode-go --save --registry=https://registry.npmjs.org
```

> ⚠️ **从旧版本（< 1.1.4）升级请注意**：旧版的 peerDependencies 会让 npm 自动把旧版 `@deepseek-ai/*` 核心包装进 profile 的 node_modules 根部，遮蔽宿主新版导致启动崩溃（`registerFileReceiptResolver` 报错）。1.1.4 起已修复（全部标记为 optional peer）。如已中招：删掉 profile 下 `node_modules/@deepseek-ai` 和 `package-lock.json`，再用 pnpm 重装；或改用下方 `dsh plugin --profile web add dsh-usage-opencode-go` 一键安装（推荐）。

然后在 `~/.dsh/profiles/web/cordis.patch.yml` 追加：

```yaml
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
```

重启 / 刷新 web GUI 生效。

### DSH Desktop App 桌面版

桌面版使用独立的 `desktop` profile（不是 `web`）：

```bash
cd ~/.dsh/profiles/desktop
pnpm add dsh-usage-opencode-go --registry=https://registry.npmjs.org
```

然后往 `~/.dsh/profiles/desktop/cordis.patch.yml` 追加：

```yaml
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
```

保存后 host 侧自动热加载生效；界面上的读条 / 命令补全若未立刻出现，刷新一下页面即可，**无需重启 App**。

> 桌面版的客户端同样是 web 平台，`dsh.client.platform: "web"` 的插件两种宿主通用，无需单独构建。profile 目录自带 `pnpm-workspace.yaml`（`nodeLinker: hoisted`、`autoInstallPeers: false`），在 profile 目录内用 pnpm 安装不会误装 peer 依赖遮蔽宿主。

<details>
<summary>其他安装方式（git / 一键脚本 / 手动）</summary>

```bash
# git 安装
dsh plugin --profile web add github:jooey/dsh-usage-opencode-go

# 一键脚本
./install.sh        # Linux / macOS
.\install.ps1       # Windows
```

</details>

## Usage 使用

- 对话里输入 **`/usage-opencode-go`** → 完整配额报告
- 选中 **OpenCode Go** 模型 → 右下角读条出现

```text
右下角读条：

Rolling 4.0% (1h 19m) · Weekly 53.0% (5d 14h) · Monthly 26.0% (24d 18h)
```

## Troubleshooting

- `OPENCODE_GO_API_KEY is not configured` —— 检查 `~/.dsh/.credentials.yaml`
- 读条不显示 —— 确认当前选中的是 OpenCode Go 模型，再硬刷新（`Ctrl+Shift+R`）

---

## English

Put your OpenCode Go (Zen Go) subscription quota right inside the DSH conversation UI: type `/usage-opencode-go` for a full report, and while an OpenCode Go model is selected, a live chip sits in the bottom-right of the composer — auto-refreshed every minute. Hides itself automatically on other models.

- **Composer chip**: `Rolling x% (countdown) · Weekly x% (countdown) · Monthly x% (countdown)`; marquee-scrolls on hover when content overflows
- **`/usage-opencode-go` command**: per-window percentages + reset times
- **Key safety**: resolved host-side only, never inlined into the browser
- **Invitation**: [OpenCode Go](https://opencode.ai/go?ref=8G7C93YWQ7) — sign-up bonus for new users

## Prerequisites

- **DSH** installed (Node.js >= 20): `npm install -g @deepseek-ai/dsh`
- An **OpenCode Go API key** in `~/.dsh/.credentials.yaml`:

```yaml
OPENCODE_GO_API_KEY: <your key>
```

## Install

```bash
cd ~/.dsh/profiles
npm install dsh-usage-opencode-go --save --registry=https://registry.npmjs.org
```

> ⚠️ **Upgrading from < 1.1.4?** Older versions declared peer dependencies that made npm auto-install outdated `@deepseek-ai/*` core packages into the profile's node_modules root, shadowing the newer host packages and crashing startup (`registerFileReceiptResolver` error). Fixed since 1.1.4 (all marked optional peers). If affected: delete `node_modules/@deepseek-ai` and `package-lock.json` in the profile, reinstall with pnpm — or use `dsh plugin --profile web add dsh-usage-opencode-go` below instead (recommended).

Then append to `~/.dsh/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
```

Restart / refresh the web GUI to activate.

### DSH Desktop App

The desktop app uses its own `desktop` profile (not `web`):

```bash
cd ~/.dsh/profiles/desktop
pnpm add dsh-usage-opencode-go --registry=https://registry.npmjs.org
```

Then append to `~/.dsh/profiles/desktop/cordis.patch.yml`:

```yaml
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
```

The host side hot-reloads as soon as the file is saved; if the chip / command completion doesn't show up immediately, just refresh the page — **no app restart needed**.

> The desktop app's client is also the web platform, so plugins declaring `dsh.client.platform: "web"` work on both hosts with no separate build. The profile directory ships its own `pnpm-workspace.yaml` (`nodeLinker: hoisted`, `autoInstallPeers: false`), so installing with pnpm inside it won't pull in peer dependencies that could shadow the host.

MIT License · Welcome a ⭐ Star!
