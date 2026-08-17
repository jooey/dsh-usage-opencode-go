# Release Notes

## v1.0.2

**变更**：`/usage` 命令改名为 `/usage-opencode-go`，避免与其他 provider 的
`/usage` 命令冲突。


## v1.0.1

**修复**：右下角用量 readout 只在当前 provider 为 `opencode-go` 时显示；切换到其他 provider（如 deepseek-official）时自动隐藏。

## v1.0.0

DSH 插件首发：在对话里查看你的 OpenCode Go (Zen Go) 订阅用量。

**功能**

- `/usage-opencode-go` 命令：完整用量报告（Rolling / Weekly / Monthly + 重置时间）
- 输入框右下角常驻读条：OpenCode Go 图标 + 三组百分比，每分钟自动刷新
- 读条可点击，打开注册/邀请链接
- 密钥只在 DSH 主机端解析，不进浏览器

**安装**

```bash
cd ~/.dsh/profiles
npm install dsh-usage-opencode-go --save --registry=https://registry.npmjs.org
```

然后在 `cordis.patch.yml` 里 insert `opencode-usage` 条目（见 README）。

**注册 OpenCode Go**：https://opencode.ai/go?ref=8G7C93YWQ7
