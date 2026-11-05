# 归档会话 · Archived sessions

DeepSeek Harness Web 侧栏入口：点开后是**归档会话列表**，按工作区分组、组内按最近活动倒序排列，支持搜索、取消归档，以及单个 / 批量**永久删除**。

A DeepSeek Harness Web sidebar entry that opens an **archived-session browser**: grouped by workspace, newest activity first, with search, unarchive, and single or batch **permanent deletion**.

## 功能

- **侧栏入口**：面板图标列（`sidebar.panellist`，`order: 20`）新增一个「归档会话」图标；点击后主区域打开同 id 的 `main` 面板（`archive-sessions`），与内置「插件 / 自动化任务」页同级。
- **工作区分组**：归档集合来自工作区注册表的全局 `archivedSessionIds`；会话按 `workspace.sessionIds` 归组，组内按 `updatedAt`（= `max(createdAt, 最后一条用户消息时间)`）倒序；不属于任何工作区的会话进入「未分组」。
- **搜索**：按标题、路径、会话 ID、工作区标题与路径做不区分大小写的字面包含匹配；搜索只影响展示，不改变选中集合之外的数据。
- **取消归档**：行内「取消归档」调用工作区控制器的 `unarchiveSession`，成功后该行立即从这个列表消失。
- **单个 / 批量删除**：行内「删除」或勾选后「删除所选」→ 二次确认对话框（列出标题、说明不可撤销）→ 提交给 Host。
- **仅可删除已归档会话**：Host 在处理每个 id 时重新读取归档集合，不在集合中的 id 直接以 `session/not-archived` 拒绝；浏览器端列表本身也只展示归档会话。

## 删除是怎么做的

DSH 没有公开的删除 API（`sessionController` 只有 list/create/rename/fork/…，没有 delete），所以删除沿用 `@estelle-ge/dsh-plugin-session-cleaner`（MIT）已验证的 Host 侧算法：

1. `POST /api/archive-sessions/delete`，先用 `connection.requestRejection()` 做 Host/Origin/Cookie 校验，非 `application/json`、超过 256 KiB、批量超过 200 个、id 形状非法都直接拒绝；
2. 逐个 id：确认仍在归档集合 → `sessionPersistence.stat()` 取 header 与后端 `root`，按磁盘列举定位 `<root>/<project>/<session-id>/`（含 `~XXXX` 转义与大小写折叠，定位后再次校验包含关系）；
3. 运行中的 Agent 先 `cancel()` 并轮询最多 8 秒（`DSH_ARCHIVE_SESSIONS_STOP_MS` 可调 500–60000），停不下来就拒绝该条且不删任何东西；
4. `workspace/session-activity` 瀑布仍报告活动时同样拒绝；
5. 先改簿记：每个归属工作区 `detachSession()`，再 `unarchiveSession()` + `unpinSession()`；
6. 删除会话日志目录，再删衍生数据 `$DSH_HOME/storages/session_projcache/sessions/<id>.json` 与 SQLite 搜索索引（不删会导致重启后标题"复活"）；
7. `ctx.emit('api-session/removed', id)` 通知所有已连接的浏览器移除该行；
8. 批量按顺序执行，单条失败不影响其余，响应返回逐条结果（`deleted` / `failed` / `results[]`）。

日志已经不存在的归档 id 会被视为"只剩簿记"：清掉归档/置顶记录并返回成功，不会误删任何路径。

## 已知限制

- 已打开但空闲的会话被删除后，Host 内存里的 Session 对象会保留到重启（DSH 没有释放接口）；磁盘日志不会重建，侧栏行会立即消失。
- 只能删除归档会话；未归档会话请在侧栏的「…」菜单里先归档。
- 删除不可撤销。
- 会话路径布局与归档集合读取依赖 DSH 0.2.x 的存储实现，大版本升级后需要适配。

## 安装

本仓库通过插件管理器以本地目录安装（profile 内为链接）：

```text
plugin_manager install_bundle  target: <本目录绝对路径>
```

安装后需要刷新页面（或重启应用）让浏览器端 bundle 重新加载。

## 结构

```text
index.js              Host 入口（转出 src/host/plugin.js）
src/host/plugin.js    在 ctx.webServer 注册 /api/archive-sessions
src/host/http.js       鉴权、批量协议、错误码
src/host/delete-session.js  单个归档会话的删除与簿记清理
src/host/encoding.js   会话日志目录编码（对齐 dsh-session-persistence-jsonl）
src/host/errors.js     稳定错误码与 HTTP 状态
client.js              浏览器端：sidebar.panellist + main 页面、搜索、批量选择、确认对话框
locale/                插件市场元数据（中/英）
icon.svg               插件图标
LICENSE                Apache License 2.0
```

## 许可

本项目采用 [Apache License 2.0](LICENSE) 许可，SPDX 标识为 `Apache-2.0`。

你可以自由使用、修改和分发本项目，包括商业用途；分发时请保留版权与许可声明，并遵守许可证中的专利与商标条款。

Licensed under the [Apache License 2.0](LICENSE).
