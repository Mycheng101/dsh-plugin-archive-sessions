# 归档会话 · Archived sessions

DeepSeek Harness Web 侧栏入口：点开后是**归档会话列表**，按工作区分组、最近活动的排在前面，支持搜索、取消归档，以及单个 / 批量**永久删除**。

A DeepSeek Harness Web sidebar entry that opens an **archived-session browser**: grouped by workspace, newest activity first, with search, unarchive, and single or batch **permanent deletion**.

## 功能

- **侧栏入口**：在侧栏面板列表点开「归档会话」，主区域即可浏览所有已归档会话。
- **按工作区分组**：同一工作区的归档会话归为一组，组内按最近活动时间倒序；没有归属工作区的会话归入「未分组」。
- **搜索**：按标题、路径或会话 ID 快速筛选，不区分大小写。
- **取消归档**：点行内「取消归档」，会话立即回到原工作区列表。
- **单个 / 批量删除**：行内「删除」或勾选后「删除所选」，二次确认后永久删除，不可撤销。
- **只处理归档会话**：列表只展示归档会话，删除也只对归档会话生效；正在运行的会话会先被停止。

## 已知限制

- 已打开但空闲的会话被删除后，侧栏行会立即消失，但宿主内存中的会话对象会保留到重启。
- 只能删除归档会话；未归档会话请在侧栏的「…」菜单里先归档。
- 删除不可撤销。
- 与 DSH 0.2.x 的存储布局绑定，大版本升级后可能需要适配。

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
