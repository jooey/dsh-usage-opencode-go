# Release Notes

## v1.1.1

**修复：窄窗口下输入框读条覆盖左侧 Full access 下拉框**

- 读条宽度不再使用固定 `max-width` 上限，改为**实测适配**：测量输入框工具行的真实剩余空间（行内宽 − 行间隔 − 左侧工具组 − 右侧模型选择/上下文计量/发送按钮），把读条精确限制在剩余宽度内
- 空间足够时完整显示；空间紧张时平滑截断；剩余不足 80px 时收起为仅图标——任何窗口宽度下都不再向左溢出
- 通过 `ResizeObserver` 监听行与右侧组：窗口缩放、模型切换、发送按钮出现/消失时自动重算（`useLayoutEffect` 首测在绘制前完成，无闪烁）
- OpenCode Go 版本的悬停跑马灯滚动行为保持不变，仅叠加同样的宽度适配逻辑

**English**: chip width is now measured to fit the composer row's actual leftover space instead of a fixed max-width cap — full text when it fits, smooth truncation when tight, icon-only below 80px, so it never overlaps the left "Full access" dropdown at any width; refit is driven by ResizeObserver on the row and the trailing group.

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
