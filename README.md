<p align="center">
  <img src="https://img.shields.io/npm/v/dsh-usage-opencode-go" alt="npm version" />
  <img src="https://img.shields.io/npm/dw/dsh-usage-opencode-go" alt="npm downloads" />
  <img src="https://img.shields.io/npm/l/dsh-usage-opencode-go" alt="license" />
</p>

<h1 align="center">dsh-usage-opencode-go</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/dsh-usage-opencode-go">npm package</a>
  ·
  <a href="#install">Install</a>
  ·
  <a href="#usage">Usage</a>
</p>

> 还没有 OpenCode Go 账号？<br/>
> **👉 [点这里注册 / 领取 OpenCode Go](https://opencode.ai/go?ref=8G7C93YWQ7)** 👈

一个用于 **DSH（DeepSeek Harness）** 的插件：把你的 **OpenCode Go (Zen Go)** 订阅用量直接显示在对话里。

- 输入 `/usage` —— 打印完整用量报告（rolling / weekly / monthly）。
- 输入框右下角常驻一个小读条 —— OpenCode Go 图标 + `Rolling · Weekly · Monthly` 百分比，每分钟自动刷新，点击即打开注册邀请链接。

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

## 先决条件

- 已安装 **DSH** 且使用 `web` profile。
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

### 方式 B：手动安装（PowerShell）

仓库自带 `install.ps1`：

```powershell
.\install.ps1
```

它会自动拷贝文件并写入 profile patch。

### 方式 C：源码手动安装

```powershell
# 1. 拷贝包到 profile 的 node_modules fallback
Copy-Item -Recurse -Force .\dsh-usage-opencode-go "$env:USERPROFILE\.dsh\profiles\node_modules\dsh-usage-opencode-go"

# 2. 在 $env:USERPROFILE\.dsh\profiles\web\cordis.patch.yml 里追加
#    - insert:
#        - id: opencode-usage
#          name: 'dsh-usage-opencode-go'
```

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
