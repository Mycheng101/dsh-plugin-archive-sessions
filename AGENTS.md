# 仓库说明 · AGENTS

本仓库是 DeepSeek Harness（DSH）Web 插件 `@mycheng/dsh-plugin-archive-sessions`：侧栏「归档会话」入口、按工作区分组的归档列表、搜索、取消归档，以及单个 / 批量永久删除。

## 结构

```text
index.js                     Host 入口（转出 src/host/plugin.js）
src/host/plugin.js           在 ctx.webServer 注册 /api/archive-sessions
src/host/http.js             鉴权、批量协议、错误码
src/host/delete-session.js   单个归档会话的删除与簿记清理
src/host/encoding.js         会话日志目录编码（对齐 dsh-session-persistence-jsonl）
src/host/errors.js           稳定错误码与 HTTP 状态
client.js                    浏览器端：sidebar.panellist + main 页面、搜索、批量选择、确认对话框
locale/                      插件市场元数据（中/英）
icon.svg                     插件图标
docs/                        实现细节文档（如 docs/deletion.md：删除机制）
.github/workflows/           发布流水线（tag 触发 npm 发布）
LICENSE                      Apache License 2.0
```

## 文档

- 删除机制与相关代码：`docs/deletion.md`
- 面向使用者的功能、安装与限制说明：`README.md`

## 发布

发布由 GitHub Actions 在推送 tag 时自动完成（workflow：`.github/workflows/publish.yml`，npm token 取自仓库 Secret `NPM_TOKEN`）。

1. 修改 `package.json` 的 `version`（例如 `1.0.2`）并提交；
2. 创建并推送同版本 tag：`git tag v1.0.2 && git push origin v1.0.2`；
3. workflow 会校验 tag 与 `package.json` 版本一致，然后执行 `npm publish --access public`。

注意：tag 名必须带 `v` 前缀，且与 `package.json` 版本严格一致，否则发布被拒绝。
