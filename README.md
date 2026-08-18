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

然后在 `~/.dsh/profiles/web/cordis.patch.yml` 追加：

```yaml
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
```

重启 / 刷新 web GUI 生效。

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

Then append to `~/.dsh/profiles/web/cordis.patch.yml`:

```yaml
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
```

Restart / refresh the web GUI to activate.

MIT License · Welcome a ⭐ Star!
