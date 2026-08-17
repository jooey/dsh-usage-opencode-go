<p align="center">
  <img src="https://img.shields.io/npm/v/dsh-usage-opencode-go" alt="npm version" />
  <img src="https://img.shields.io/npm/dw/dsh-usage-opencode-go" alt="npm downloads" />
  <img src="https://img.shields.io/npm/l/dsh-usage-opencode-go" alt="license" />
</p>

<h1 align="center">dsh-usage-opencode-go</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-usage-opencode-go">npm package</a>
  ·
  <a href="https://github.com/jooey/dsh-usage-opencode-go">GitHub repo</a>
  ·
  <a href="#install">Install</a>
  ·
  <a href="#usage">Usage</a>
</p>

<p align="center">
  <img src="https://img.shields.io/github/stars/jooey/dsh-usage-opencode-go" alt="GitHub stars" />
  <img src="https://img.shields.io/github/license/jooey/dsh-usage-opencode-go" alt="GitHub license" />
</p>

<p align="center">
  <strong>🚀 Quick start（一条命令装到 DSH）</strong>
</p>

```bash
dsh plugin --profile web add dsh-usage-opencode-go
```

> 完整步骤（含 DSH 安装、patch 注册、GitHub git 安装）见下方 <a href="#install">Install</a>。

> 还没有 OpenCode Go 账号？<br/>
> **👉 [点这里注册 / 领取 OpenCode Go](https://opencode.ai/go?ref=8G7C93YWQ7)** 👈

一个用于 **DSH（DeepSeek Harness）** 的插件：把你的 **OpenCode Go (Zen Go)** 订阅用量直接显示在对话里。

- 输入 `/usage` —— 打印完整用量报告（rolling / weekly / monthly）。
- 输入框右下角常驻一个小读条 —— OpenCode Go 图标 + `Rolling · Weekly · Monthly` 百分比，每分钟自动刷新，点击即打开注册邀请链接。**仅当当前会话模型 provider 为 `opencode-go` 时显示；切到其他 provider 自动隐藏。**

数据实时来自官方额度接口 `GET https://opencode.ai/zen/go/v1/usage`。密钥通过 harness 凭据层（`~/.dsh/.credentials.yaml` 或环境变量里的 `OPENCODE_GO_API_KEY`）**只在主机端解析**，绝不会进浏览器、不会被打包进前端代码。

## 截图 / 效果

```text
OpenCode Go (zen/go) usage

Rolling (3d): 15.0% used (status: up) · resets 2026-08-17T05:51:16Z
Weekly: 6.0% used (status: up) · resets 2026-08-24T00:00:00Z
Monthly: 3.0% used (status: up) · resets 2026-09-12T03:39:59Z

Get OpenCode Go: https://opencode.ai/go?ref=8G7C93YWQ7
```

输入框底部工具行（模型选择器左侧）:

```text
[ ⬛ OpenCode Go 图标 ] Rolling 15.0% · Weekly 6.0% · Monthly 3.0%
```

## 第 0 步：安装 DSH

还没有 DSH？先全局安装启动器（Node.js >= 20）：

```bash
npm install -g @deepseek-ai/dsh
dsh --version
```

首次使用会自动初始化 `web` profile 到 `~/.dsh/profiles/web`（Windows：`%USERPROFILE%\.dsh\profiles\web`）。

> 更多 DSH 的说明见官方 README：<https://www.npmjs.com/package/@deepseek-ai/dsh>

## 先决条件

- 已安装 **DSH** 并使用 `web` profile（见上一步）。
- 拥有 **OpenCode Go** 的 API Key。
  - 没有账号？先注册 👉 https://opencode.ai/go?ref=8G7C93YWQ7
  - 拿到 key 后写入 `~/.dsh/.credentials.yaml`：

    ```yaml
    OPENCODE_GO_API_KEY: <你的 key>
    ```

    （也可以直接 `export OPENCODE_GO_API_KEY=<key>`）

## Install

### 方式 A：npm 安装（推荐）

```bash
cd ~/.dsh/profiles
npm install dsh-usage-opencode-go --save --registry=https://registry.npmjs.org
```

然后在 `~/.dsh/profiles/web/cordis.patch.yml` 中追加：

```yaml
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
```

### 方式 B：直接给 DSH 传 GitHub 链接（git 安装）

也可以直接把 GitHub 仓库地址交给 DSH 的 pnpm 安装（无需先 clone）：

```bash
dsh plugin --profile web add github:<用户名>/dsh-usage-opencode-go

# 或完整 URL 形式（任选其一）
dsh plugin --profile web add https://github.com/<用户名>/dsh-usage-opencode-go.git
```

> 注意：仓库必须是**公开**的；安装器会直接以仓库根目录的
> `package.json`（名字必须为 `dsh-usage-opencode-go`）建链安装。
> 本仓库是纯 JS 包、无构建步骤，所以 git 安装可以直接用。

安装后同样要在 `~/.dsh/profiles/web/cordis.patch.yml` 里追加：

```yaml
- insert:
    - id: opencode-usage
      name: 'dsh-usage-opencode-go'
```

### 方式 C：PowerShell 一键脚本

仓库自带 `install.ps1`：

```powershell
.\install.ps1
```

它会自动拷贝文件并写入 profile patch。

### 方式 D：源码手动安装

```powershell
# 1. 拷贝包到 profile 的 node_modules fallback
Copy-Item -Recurse -Force .\dsh-usage-opencode-go "$env:USERPROFILE\.dsh\profiles\node_modules\dsh-usage-opencode-go"

# 2. 在 $env:USERPROFILE\.dsh\profiles\web\cordis.patch.yml 里追加
#    - insert:
#        - id: opencode-usage
#          name: 'dsh-usage-opencode-go'
```

以下通用步骤（方式 A–D 都要做）：改完 patch 后，**重启 / 刷新** web GUI（该 profile 默认关闭 HMR）。

## Usage

安装后**重启 / 刷新** web GUI（该 profile 默认关闭 HMR）：

- 对话里输入 **`/usage`** → 完整用量报告 + 邀请链接。
- 看输入框**右下角** → 常驻 readout，点击打开邀请链接。

### 验证配置（不启动服务）

```powershell
dsh --profile web --dump-config
# 找到：- id: opencode-usage /  name: dsh-usage-opencode-go
```

## 工作原理

| 端 | 文件 | 作用 |
|---|---|---|
| 主机 | `lib/index.js` | Cordis 插件：`/usage` 命令 + `opencodeUsage` Typert 远程服务 |
| 主机 | `lib/typert.host.js` | Typert 主机 face 清单（`opencodeUsage/snapshot`） |
| 主机 | `lib/logic.js` | 无依赖纯逻辑（fetch / 格式化） |
| 浏览器 | `lib/client.js` | 挂载远程服务，注册 `conversation.input.right` slot readout |
| 浏览器 | `lib/typert.remote-client.js` | Typert 客户端 face 清单 |
| 类型 | `lib/index.d.ts` | 主机 face 类型声明 |

## Troubleshooting

- `OPENCODE_GO_API_KEY is not configured` —— 检查 `~/.dsh/.credentials.yaml` 是否已写入 `OPENCODE_GO_API_KEY`。
- `OpenCode usage API returned HTTP 4xx` —— key 被额度接口拒绝；必须是 OpenCode Zen Go 的 key。
- 右下角 readout 不显示 —— 硬刷新浏览器（`Ctrl+Shift+R`）；若控制台报 `Failed to load plugins`，确认包已正确安装、patch 里的 `name` 是 `dsh-usage-opencode-go`。

## 开发成本（透明记录）

本插件由 **DeepSeek-V4-Pro** 协助开发。截至 v1.0.0 发布，整个开发会话的
DSH 统计为：

| 指标 | 数值 |
|---|---|
| Turns | 25 |
| Steps | 346 |
| LLM 耗时 | 46m7s |
| Tool call | 42m55s |
| TTFT avg | 4.1s |
| 解码速度 | 80 tok/s |
| Cache hit | 100% |
| Input | 48.8M tok |
| Output | 108K tok |

> 以上为该 DSH 会话的累计统计（采用 DeepSeek-V4-Pro 模型），仅作开发透明度
> 记录，不代表插件运行时的任何 token 消耗——插件本身只是调用 OpenCode Go
> 的额度接口，不产生 LLM token。

## 为开发者

```bash
# 跑通核心逻辑（读取真实 key）
node test/logic.mjs

# 打包前预览 tarball
npm pack --dry-run

# 发布
npm publish --registry=https://registry.npmjs.org --access public
```

MIT License · 欢迎 ⭐ Star！

---

**注册 OpenCode Go**：https://opencode.ai/go?ref=8G7C93YWQ7
