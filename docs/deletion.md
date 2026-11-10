# 删除是怎么做的

DSH 没有公开的删除 API（`sessionController` 只有 list/create/rename/fork/…，没有 delete），所以删除沿用 [`@estelle-ge/dsh-plugin-session-cleaner`](https://www.npmjs.com/package/@estelle-ge/dsh-plugin-session-cleaner)（MIT）已验证的 Host 侧算法。

## 流程

1. `POST /api/archive-sessions/delete`，先用 `connection.requestRejection()` 做 Host/Origin/Cookie 校验，非 `application/json`、超过 256 KiB、批量超过 200 个、id 形状非法都直接拒绝；
2. 逐个 id：确认仍在归档集合 → `sessionPersistence.stat()` 取 header 与后端 `root`，按磁盘列举定位 `<root>/<project>/<session-id>/`（含 `~XXXX` 转义与大小写折叠，定位后再次校验包含关系）；
3. 运行中的 Agent 先 `cancel()` 并轮询最多 8 秒（`DSH_ARCHIVE_SESSIONS_STOP_MS` 可调 500–60000），停不下来就拒绝该条且不删任何东西；
4. `workspace/session-activity` 瀑布仍报告活动时同样拒绝；
5. 先改簿记：每个归属工作区 `detachSession()`，再 `unarchiveSession()` + `unpinSession()`；
6. 删除会话日志目录，再删衍生数据 `$DSH_HOME/storages/session_projcache/sessions/<id>.json` 与 SQLite 搜索索引（不删会导致重启后标题"复活"）；
7. `ctx.emit('api-session/removed', id)` 通知所有已连接的浏览器移除该行；
8. 批量按顺序执行，单条失败不影响其余，响应返回逐条结果（`deleted` / `failed` / `results[]`）。

日志已经不存在的归档 id 会被视为"只剩簿记"：清掉归档/置顶记录并返回成功，不会误删任何路径。

## 相关代码

- `src/host/http.js`：路由、鉴权与批量协议
- `src/host/delete-session.js`：单个会话的删除与簿记清理
- `src/host/encoding.js`：会话日志目录编码
- `src/host/errors.js`：稳定错误码与 HTTP 状态

## 已知限制

- 已打开但空闲的会话被删除后，Host 内存里的 Session 对象会保留到重启（DSH 没有释放接口）；磁盘日志不会重建，侧栏行会立即消失。
- 只能删除归档会话；未归档会话请在侧栏的「…」菜单里先归档。
- 删除不可撤销。
- 会话路径布局与归档集合读取依赖 DSH 0.2.x 的存储实现，大版本升级后需要适配。
