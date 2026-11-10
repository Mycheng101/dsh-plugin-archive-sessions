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

## 已知限制

- 已打开但空闲的会话被删除后，Host 内存里的 Session 对象会保留到重启（DSH 没有释放接口）；磁盘日志不会重建，侧栏行会立即消失。
- 只能删除归档会话；未归档会话请在侧栏的「…」菜单里先归档。
- 删除不可撤销。
- 会话路径布局与归档集合读取依赖 DSH 0.2.x 的存储实现，大版本升级后需要适配。

## 安装

把示例中的 `web` 换成实际启动的 profile 名（桌面版通常是 `desktop`），也可以直接在 Web 的「插件」页面安装。

### 从 npm 安装

```bash
dsh plugin --profile web add @mycheng/dsh-plugin-archive-sessions
```

### 从 GitHub 安装

```bash
dsh plugin --profile web add github:Mycheng101/dsh-plugin-archive-sessions
```

### 本地开发

本地开发时通过插件管理器以目录链接方式安装：

```text
plugin_manager install_bundle  target: <本目录绝对路径>
```

安装或更新后需要刷新页面（或重启应用）让浏览器端 bundle 重新加载。

## 相关文档

- 删除是怎么做的：[docs/deletion.md](https://github.com/Mycheng101/dsh-plugin-archive-sessions/blob/main/docs/deletion.md)
- 仓库结构与发布流程：[AGENTS.md](https://github.com/Mycheng101/dsh-plugin-archive-sessions/blob/main/AGENTS.md)

## 许可

本项目采用 [Apache License 2.0](LICENSE) 许可，SPDX 标识为 `Apache-2.0`。

你可以自由使用、修改和分发本项目，包括商业用途；分发时请保留版权与许可声明，并遵守许可证中的专利与商标条款。

Licensed under the [Apache License 2.0](LICENSE).
