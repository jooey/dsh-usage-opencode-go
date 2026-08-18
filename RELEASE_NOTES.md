# Release Notes

## v1.1.0

**极简 DSH 用量监控 · 统一格式**

- 读条格式统一为 `Rolling x% (倒计时) · Weekly x% (倒计时) · Monthly x% (倒计时)`——五插件家族（OpenCode Go / DeepSeek / MiniMax / Kimi / GLM）同一套格式，顺序 Rolling → Weekly → Monthly
- 新增每个窗口的重置倒计时（API 一直返回 `resetsAt`，此前未展示）
- 内容超宽时鼠标悬停跑马灯滚动，图标区域不遮挡，完整文本在悬停提示兜底
- 代码风格统一（2 空格缩进）、package 元数据补齐（author / repository / keywords）

**English**: unified chip format across the five-plugin family (`Rolling/Weekly/Monthly x% (countdown)`), reset countdowns now rendered, marquee scroll on overflow, consistent code style and package metadata.

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
