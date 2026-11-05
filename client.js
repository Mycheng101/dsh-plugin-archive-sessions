window.__ModuleLoader__.load({
  id: '@local/dsh-plugin-archive-sessions',
  factory(require) {
    const React = require('react');
    const h = React.createElement;

    /** Dictionary namespace owned by this plugin. */
    const NS = 'archiveSessions';
    /** Sidebar entry id, which is also the `main` panel key. */
    const PANEL_ID = 'archive-sessions';
    /** Authenticated host route that performs the irreversible part. */
    const DELETE_ROUTE = '/api/archive-sessions/delete';

    // ────────────────────────────── dictionaries ────────────────────────────

    /** Simplified Chinese dictionary (the key-set source of truth). */
    const zh = {
      'panel.label': '归档会话',
      'page.title': '归档会话',
      'page.count': '{count} 个会话',
      'page.subtitle': '{groups} 个工作区 · 按最近活动倒序',
      'page.subtitleEmpty': '归档后的会话会集中出现在这里。',
      'search.placeholder': '搜索标题、路径或会话 ID',
      'search.clear': '清除搜索',
      'toolbar.selectAll': '全选',
      'toolbar.selected': '已选 {count}',
      'toolbar.deleteSelected': '删除所选（{count}）',
      'group.untitled': '未命名工作区',
      'group.ungrouped': '未分组',
      'row.unarchive': '取消归档',
      'row.delete': '删除',
      'row.blank': '空白会话',
      'row.running': '运行中',
      'state.loading': '正在加载归档会话…',
      'state.unavailable': '无法读取会话列表：宿主未提供工作区或会话服务。',
      'empty.title': '还没有归档会话',
      'empty.desc': '在侧栏会话的「…」菜单里选择「归档」后，会话会出现在这里。',
      'nomatch.title': '没有匹配的归档会话',
      'nomatch.desc': '换个关键词，或清除搜索后重试。',
      'dialog.titleOne': '删除这个归档会话？',
      'dialog.titleMany': '删除 {count} 个归档会话？',
      'dialog.descOne': '「{title}」及其全部历史记录将从磁盘永久删除，无法撤销。',
      'dialog.descMany': '以下 {count} 个会话及其全部历史记录将从磁盘永久删除，无法撤销。',
      'dialog.more': '还有 {count} 个…',
      'dialog.note': '删除后，会话不再出现在侧栏、归档列表与搜索结果中；正在运行的会话会先被停止。',
      'dialog.cancel': '取消',
      'dialog.confirm': '永久删除',
      'dialog.pending': '正在删除…',
      'toast.deletedOne': '已删除 1 个会话',
      'toast.deletedMany': '已删除 {count} 个会话',
      'toast.partial': '删除完成：成功 {ok} 个，失败 {failed} 个（{message}）',
      'toast.unarchived': '已取消归档',
      'toast.unarchiveFailed': '取消归档失败：{message}',
      'toast.deleteFailed': '删除失败：{message}',
      'error.invalid': '会话 ID 无效，无法删除。',
      'error.notArchived': '该会话已不在归档列表中，无法通过此页面删除。',
      'error.notFound': '该会话不存在或已被删除。',
      'error.active': '该会话仍在运行：宿主已尝试停止，但未能在限定时间内停止，未删除任何内容。请先停止该会话的工作后重试。',
      'error.workspace': '无法从工作区记录中移除该会话，删除已中止。',
      'error.failed': '删除会话失败：{message}',
      'error.unavailable': '宿主缺少必要的服务，暂时无法删除。',
      'error.tooLarge': '一次提交的会话过多，请分批删除。',
      'error.network': '无法连接宿主：{message}',
    };

    /** English dictionary, checked complete against the zh key set. */
    const en = {
      'panel.label': 'Archived sessions',
      'page.title': 'Archived sessions',
      'page.count': '{count} sessions',
      'page.subtitle': '{groups} workspaces · newest activity first',
      'page.subtitleEmpty': 'Sessions you archive collect here.',
      'search.placeholder': 'Search title, path, or session id',
      'search.clear': 'Clear search',
      'toolbar.selectAll': 'Select all',
      'toolbar.selected': '{count} selected',
      'toolbar.deleteSelected': 'Delete selected ({count})',
      'group.untitled': 'Untitled workspace',
      'group.ungrouped': 'Ungrouped',
      'row.unarchive': 'Unarchive',
      'row.delete': 'Delete',
      'row.blank': 'Blank',
      'row.running': 'Running',
      'state.loading': 'Loading archived sessions…',
      'state.unavailable': 'The session list is unavailable: the host exposes no workspace or session service.',
      'empty.title': 'No archived sessions yet',
      'empty.desc': 'Archive a session from the sidebar overflow menu and it will appear here.',
      'nomatch.title': 'No matching archived sessions',
      'nomatch.desc': 'Try another keyword, or clear the search.',
      'dialog.titleOne': 'Delete this archived session?',
      'dialog.titleMany': 'Delete {count} archived sessions?',
      'dialog.descOne': '“{title}” and its entire history will be permanently removed from disk. This cannot be undone.',
      'dialog.descMany': 'These {count} sessions and their entire history will be permanently removed from disk. This cannot be undone.',
      'dialog.more': 'and {count} more…',
      'dialog.note': 'After deletion the sessions disappear from the sidebar, this list, and search results. Running sessions are stopped first.',
      'dialog.cancel': 'Cancel',
      'dialog.confirm': 'Delete permanently',
      'dialog.pending': 'Deleting…',
      'toast.deletedOne': 'Deleted 1 session',
      'toast.deletedMany': 'Deleted {count} sessions',
      'toast.partial': 'Deleted {ok}, failed {failed} ({message})',
      'toast.unarchived': 'Session unarchived',
      'toast.unarchiveFailed': 'Unarchive failed: {message}',
      'toast.deleteFailed': 'Delete failed: {message}',
      'error.invalid': 'The session id is invalid, so it cannot be deleted.',
      'error.notArchived': 'That session is no longer archived, so this page cannot delete it.',
      'error.notFound': 'The session does not exist or was already deleted.',
      'error.active': 'This session is still running: the host tried to stop it but it did not stop in time, so nothing was deleted. Stop its work and retry.',
      'error.workspace': 'The session could not be detached from its workspace; deletion was aborted.',
      'error.failed': 'Deleting the session failed: {message}',
      'error.unavailable': 'The host is missing a required service, so deletion is unavailable.',
      'error.tooLarge': 'Too many sessions in one request; delete them in smaller batches.',
      'error.network': 'Cannot reach the host: {message}',
    };

    /** Stable error-code -> dictionary key mapping shared by the dialog. */
    const ERROR_KEYS = {
      'session/invalid': 'error.invalid',
      'session/not-archived': 'error.notArchived',
      'session/not-found': 'error.notFound',
      'session/active': 'error.active',
      'workspace/refused': 'error.workspace',
      'delete/failed': 'error.failed',
      'service/unavailable': 'error.unavailable',
      'request/too-large': 'error.tooLarge',
      network: 'error.network',
    };

    // ─────────────────────────────── styling ────────────────────────────────

    /** Plugin stylesheet: only `--dsw-alias-*` tokens, no Harness package imports. */
    const CSS = [
      '.dac-page{display:flex;flex-direction:column;flex:1;min-height:0;height:100%;background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}',
      '.dac-scroll{flex:1;min-height:0;overflow-y:auto;padding:28px 32px 56px;display:flex;flex-direction:column}',
      '.dac-head{display:flex;align-items:flex-end;justify-content:space-between;gap:20px;flex-wrap:wrap;margin:0 0 20px}',
      '.dac-titleRow{display:flex;align-items:center;gap:10px;min-width:0}',
      '.dac-title{margin:0;font-size:20px;line-height:28px;font-weight:600;letter-spacing:-.01em}',
      '.dac-title:focus{outline:none}',
      '.dac-count{flex:none;font-size:12px;line-height:18px;padding:2px 9px;border-radius:999px;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}',
      '.dac-subtitle{margin:6px 0 0;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}',
      '.dac-search{position:relative;display:flex;align-items:center;width:min(320px,100%)}',
      '.dac-searchIcon{position:absolute;left:10px;display:flex;color:var(--dsw-alias-label-secondary);pointer-events:none}',
      '.dac-searchInput{width:100%;height:34px;box-sizing:border-box;padding:0 30px 0 32px;border-radius:9px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;outline:none;appearance:none}',
      '.dac-searchInput::placeholder{color:var(--dsw-alias-label-secondary)}',
      '.dac-searchInput:focus{border-color:var(--dsw-alias-brand-primary);box-shadow:0 0 0 3px color-mix(in srgb,var(--dsw-alias-brand-primary) 16%,transparent)}',
      '.dac-searchInput::-webkit-search-cancel-button{display:none}',
      '.dac-searchClear{position:absolute;right:6px;display:flex;align-items:center;justify-content:center;width:20px;height:20px;padding:0;border:0;border-radius:50%;background:var(--dsw-alias-bg-layer-2);color:var(--dsw-alias-label-secondary);font-size:13px;line-height:1;cursor:pointer}',
      '.dac-searchClear:hover{color:var(--dsw-alias-label-primary)}',
      '.dac-toolbar{display:flex;align-items:center;gap:12px;padding:9px 14px;margin:0 0 18px;border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1)}',
      '.dac-checkLabel{display:flex;align-items:center;gap:8px;font-size:13px;color:var(--dsw-alias-label-primary);cursor:pointer;user-select:none}',
      '.dac-check{width:15px;height:15px;margin:0;accent-color:var(--dsw-alias-brand-primary);cursor:pointer;flex:none}',
      '.dac-toolbarCount{font-size:12px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}',
      '.dac-spacer{flex:1}',
      '.dac-btn{height:32px;padding:0 12px;border-radius:8px;border:1px solid var(--dsw-alias-border-l1);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);font:inherit;font-size:13px;cursor:pointer;white-space:nowrap}',
      '.dac-btn:hover:not(:disabled){background:var(--dsw-alias-bg-layer-2)}',
      '.dac-btn:disabled{opacity:.45;cursor:not-allowed}',
      '.dac-btnDanger{color:var(--dsw-alias-state-error-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 38%,var(--dsw-alias-border-l1))}',
      '.dac-btnDanger:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 10%,transparent)}',
      '.dac-list{display:flex;flex-direction:column;gap:12px}',
      '.dac-group{border:1px solid var(--dsw-alias-border-l1);border-radius:12px;background:var(--dsw-alias-bg-layer-1);overflow:hidden}',
      '.dac-groupHead{display:flex;align-items:center;gap:10px;width:100%;min-height:44px;padding:0 14px;border:0;background:none;color:inherit;font:inherit;text-align:left;cursor:pointer}',
      '.dac-groupHead:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dac-caret{flex:none;display:flex;color:var(--dsw-alias-label-secondary);transition:transform .15s var(--ds-ease-in-out,ease)}',
      '.dac-caret[data-open="true"]{transform:rotate(90deg)}',
      '.dac-groupTitle{flex:none;font-size:13px;font-weight:600;max-width:40%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dac-groupPath{flex:1;min-width:0;font-size:12px;color:var(--dsw-alias-label-secondary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dac-groupCount{flex:none;margin-left:auto;font-size:12px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}',
      '.dac-rows{list-style:none;margin:0;padding:0;border-top:1px solid var(--dsw-alias-border-l1)}',
      '.dac-row{display:flex;align-items:center;gap:12px;padding:9px 14px;min-height:46px;box-sizing:border-box}',
      '.dac-row+.dac-row{border-top:1px solid color-mix(in srgb,var(--dsw-alias-border-l1) 60%,transparent)}',
      '.dac-row:hover{background:var(--dsw-alias-bg-layer-2)}',
      '.dac-row[data-selected="true"]{background:color-mix(in srgb,var(--dsw-alias-brand-primary) 8%,transparent)}',
      '.dac-rowMain{display:flex;flex-direction:column;gap:2px;flex:1;min-width:0}',
      '.dac-rowTitle{font-size:13px;line-height:20px;color:var(--dsw-alias-label-primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dac-rowMeta{display:flex;align-items:center;gap:6px;font-size:12px;line-height:18px;color:var(--dsw-alias-label-secondary);min-width:0}',
      '.dac-rowMetaText{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dac-dot{flex:none;width:2px;height:2px;border-radius:50%;background:currentColor;opacity:.7}',
      '.dac-badge{flex:none;font-size:11px;line-height:16px;padding:0 6px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary)}',
      '.dac-badge[data-tone="run"]{color:var(--dsw-alias-state-success-primary);border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 40%,transparent)}',
      '.dac-rowActions{display:flex;align-items:center;gap:4px;flex:none}',
      '.dac-link{padding:4px 8px;border:0;border-radius:6px;background:none;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;cursor:pointer}',
      '.dac-link:hover:not(:disabled){background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary)}',
      '.dac-link:disabled{opacity:.45;cursor:not-allowed}',
      '.dac-linkDanger{color:var(--dsw-alias-state-error-primary)}',
      '.dac-linkDanger:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 10%,transparent);color:var(--dsw-alias-state-error-primary)}',
      '.dac-state{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;flex:1;min-height:260px;padding:40px 20px;text-align:center}',
      '.dac-stateIcon{display:flex;align-items:center;justify-content:center;width:56px;height:56px;border-radius:16px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-secondary)}',
      '.dac-stateTitle{margin:0;font-size:15px;line-height:22px;font-weight:600}',
      '.dac-stateDesc{margin:0;max-width:420px;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}',
      '.dac-modal{position:fixed;inset:0;z-index:1200;display:flex;align-items:center;justify-content:center;padding:24px;background:var(--dsw-alias-bg-mask-3,rgba(0,0,0,.48));animation:dacMaskIn .2s ease-out}',
      '.dac-dialog{position:relative;width:min(416px,100%);box-sizing:border-box;padding:20px 24px;border-radius:8px;background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);box-shadow:0 6px 16px 0 rgba(0,0,0,.08),0 3px 6px -4px rgba(0,0,0,.12),0 9px 28px 8px rgba(0,0,0,.05);animation:dacDialogIn .2s cubic-bezier(.08,.82,.17,1)}',
      '.dac-dialogBody{display:flex;align-items:flex-start;gap:12px}',
      '.dac-dialogIcon{flex:none;display:flex;width:22px;height:22px;margin-top:1px;color:var(--dsw-alias-state-error-primary)}',
      '.dac-dialogMain{flex:1;min-width:0}',
      '.dac-dialogTitle{margin:0;font-size:16px;line-height:24px;font-weight:600;color:var(--dsw-alias-label-primary)}',
      '.dac-dialogDesc{margin:8px 0 0;font-size:14px;line-height:22px;color:var(--dsw-alias-label-primary);word-break:break-word}',
      '.dac-dialogList{margin:12px 0 0;padding:8px 12px;list-style:none;border-radius:6px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 4%,transparent);font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary);max-height:156px;overflow-y:auto;scrollbar-width:thin;scrollbar-color:color-mix(in srgb,var(--dsw-alias-label-primary) 20%,transparent) transparent}',
      '.dac-dialogList li{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}',
      '.dac-dialogList::-webkit-scrollbar{width:6px}',
      '.dac-dialogList::-webkit-scrollbar-thumb{border-radius:3px;background:color-mix(in srgb,var(--dsw-alias-label-primary) 18%,transparent)}',
      '.dac-dialogList::-webkit-scrollbar-track{background:transparent}',
      '.dac-dialogNote{margin:12px 0 0;font-size:13px;line-height:20px;color:var(--dsw-alias-label-secondary)}',
      '.dac-dialogError{margin:12px 0 0;font-size:13px;line-height:20px;color:var(--dsw-alias-state-error-primary)}',
      '.dac-dialogActions{display:flex;justify-content:flex-end;gap:8px;margin-top:20px}',
      '.dac-dialogActions .dac-btn{height:32px;padding:0 15px;border-radius:6px;border:1px solid var(--dsw-alias-border-l3);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary);font-size:14px;line-height:30px;box-shadow:0 2px 0 rgba(0,0,0,.02);transition:background-color .2s,border-color .2s,color .2s,box-shadow .2s}',
      '.dac-dialogActions .dac-btn:hover:not(:disabled){border-color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-bg-layer-1);color:var(--dsw-alias-label-primary)}',
      '.dac-dialogActions .dac-btn:active:not(:disabled){border-color:var(--dsw-alias-label-primary)}',
      '.dac-dialogActions .dac-btn:focus-visible{outline:4px solid color-mix(in srgb,var(--dsw-alias-label-primary) 12%,transparent);outline-offset:1px}',
      '.dac-dialogActions .dac-btn:disabled{opacity:1;cursor:not-allowed;color:color-mix(in srgb,var(--dsw-alias-label-primary) 25%,transparent);background:color-mix(in srgb,var(--dsw-alias-label-primary) 4%,transparent);border-color:var(--dsw-alias-border-l2);box-shadow:none}',
      '.dac-dialogActions .dac-btnDanger{background:var(--dsw-alias-state-error-primary);border-color:var(--dsw-alias-state-error-primary);color:#fff;box-shadow:0 2px 0 color-mix(in srgb,var(--dsw-alias-state-error-primary) 12%,transparent)}',
      '.dac-dialogActions .dac-btnDanger:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 80%,#fff);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 80%,#fff);color:#fff}',
      '.dac-dialogActions .dac-btnDanger:active:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 85%,#000);border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 85%,#000);color:#fff}',
      '.dac-dialogActions .dac-btnDanger:focus-visible{outline-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 20%,transparent)}',
      '.dac-dialogActions .dac-btnDanger:disabled{opacity:1;cursor:progress;color:#fff;background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 82%,#000);border-color:transparent;box-shadow:none}',
      'body[data-ds-dark-theme] .dac-dialogActions .dac-btnDanger{background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 78%,#000);border-color:transparent}',
      'body[data-ds-dark-theme] .dac-dialogActions .dac-btnDanger:hover:not(:disabled){background:color-mix(in srgb,var(--dsw-alias-state-error-primary) 87%,#000);border-color:transparent}',
      '@keyframes dacMaskIn{from{opacity:0}to{opacity:1}}',
      '@keyframes dacDialogIn{from{opacity:0;transform:scale(.92)}to{opacity:1;transform:scale(1)}}',
      '@media (prefers-reduced-motion:reduce){.dac-modal,.dac-dialog{animation:none}}',
      '.dac-toast{position:fixed;left:50%;bottom:32px;transform:translateX(-50%);z-index:1300;max-width:min(560px,calc(100vw - 48px));box-sizing:border-box;padding:9px 14px;border-radius:10px;border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-overlay);color:var(--dsw-alias-label-primary);font-size:13px;line-height:20px;box-shadow:0 8px 24px color-mix(in srgb,#000 18%,transparent)}',
      '.dac-toast[data-tone="success"]{border-color:color-mix(in srgb,var(--dsw-alias-state-success-primary) 45%,var(--dsw-alias-border-l2))}',
      '.dac-toast[data-tone="error"]{border-color:color-mix(in srgb,var(--dsw-alias-state-error-primary) 45%,var(--dsw-alias-border-l2))}',
      '.dac-toast[data-tone="warning"]{border-color:color-mix(in srgb,var(--dsw-alias-state-warn-primary) 45%,var(--dsw-alias-border-l2))}',
      '@media (max-width:760px){.dac-scroll{padding:20px 16px 40px}.dac-head{align-items:stretch}.dac-search{width:100%}}',
    ].join('\n');

    // ─────────────────────────────── helpers ────────────────────────────────

    /** Empty snapshot sentinels used before a service store is available. */
    const EMPTY_SESSIONS = Object.freeze({ ids: [], byId: {}, phase: 'loading' });
    const EMPTY_WORKSPACES = Object.freeze({ items: [], archivedSessionIds: [], pinnedSessionIds: [], phase: 'loading' });

    /** No-op unsubscribe used when a store is absent. */
    function noop() {}

    /** Re-render on a wall-clock interval so relative times stay honest. */
    function useNow(intervalMs) {
      const [now, setNow] = React.useState(() => Date.now());
      React.useEffect(() => {
        const id = window.setInterval(() => setNow(Date.now()), intervalMs);
        return () => window.clearInterval(id);
      }, [intervalMs]);
      return now;
    }

    /** Best-effort `Intl.RelativeTimeFormat`; falls back to a fixed locale. */
    function relativeFormatter(localeId) {
      try {
        return new Intl.RelativeTimeFormat(localeId, { numeric: 'auto' });
      } catch {
        try {
          return new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
        } catch {
          return undefined;
        }
      }
    }

    /** Format an activity timestamp relative to `now`, falling back to a date. */
    function formatRelative(ts, now, localeId) {
      if (typeof ts !== 'number' || !Number.isFinite(ts) || ts <= 0) return '';
      const delta = ts - now;
      const abs = Math.abs(delta);
      const formatter = relativeFormatter(localeId);
      if (formatter !== undefined) {
        if (abs < 45e3) return formatter.format(Math.round(delta / 1e3), 'second');
        if (abs < 45 * 60e3) return formatter.format(Math.round(delta / 60e3), 'minute');
        if (abs < 22 * 36e5) return formatter.format(Math.round(delta / 36e5), 'hour');
        if (abs < 6 * 864e5) return formatter.format(Math.round(delta / 864e5), 'day');
      }
      try {
        return new Intl.DateTimeFormat(localeId, { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(ts));
      } catch {
        return new Date(ts).toLocaleString();
      }
    }

    /** Format one timestamp as an absolute local date/time for tooltips. */
    function formatAbsolute(ts, localeId) {
      if (typeof ts !== 'number' || !Number.isFinite(ts) || ts <= 0) return '';
      try {
        return new Intl.DateTimeFormat(localeId, { dateStyle: 'full', timeStyle: 'medium' }).format(new Date(ts));
      } catch {
        return new Date(ts).toLocaleString();
      }
    }

    /** Interpolate `{name}` placeholders in a localized string. */
    function fill(text, params) {
      if (params === undefined) return text;
      return text.replace(/\{(\w+)\}/g, (match, key) => {
        const value = params[key];
        return value === undefined ? match : String(value);
      });
    }

    /** Localize one stable host error code. */
    function errorText(t, code, message) {
      const key = typeof code === 'string' ? ERROR_KEYS[code] : undefined;
      if (key !== undefined) return fill(t(key), { message: message ?? '' });
      return fill(t('error.failed'), { message: message ?? (typeof code === 'string' ? code : '') });
    }

    /**
     * Group the archived set by workspace and order every group by activity.
     * @param items - workspace views in registry order.
     * @param archivedIds - registry-global archive set.
     * @param byId - live session summaries keyed by id.
     * @param t - translate function.
     * @returns ordered groups with `{ id, title, path, ids }`.
     */
    function buildGroups(items, archivedIds, byId, t) {
      const archived = new Set(archivedIds.filter((id) => byId[id] !== undefined));
      const accounted = new Set();
      const groups = [];
      for (const workspace of items) {
        const ids = [];
        for (const id of workspace.sessionIds ?? []) {
          accounted.add(id);
          if (archived.has(id)) ids.push(id);
        }
        if (ids.length === 0) continue;
        groups.push({
          id: workspace.workspaceId,
          title: workspace.title === '' ? t('group.untitled') : workspace.title,
          path: workspace.path,
          ids: sortByActivity(ids, byId),
        });
      }
      const ungrouped = sortByActivity(archivedIds.filter((id) => archived.has(id) && !accounted.has(id)), byId);
      if (ungrouped.length > 0) {
        groups.push({ id: '__ungrouped__', title: t('group.ungrouped'), path: undefined, ids: ungrouped });
      }
      return groups;
    }

    /** Order session ids by descending `updatedAt`, then by title. */
    function sortByActivity(ids, byId) {
      return [...ids].sort((left, right) => {
        const a = byId[left] ?? {};
        const b = byId[right] ?? {};
        const delta = (b.updatedAt ?? 0) - (a.updatedAt ?? 0);
        if (delta !== 0) return delta;
        return String(a.displayTitle ?? a.id ?? left).localeCompare(String(b.displayTitle ?? b.id ?? right));
      });
    }

    // ────────────────────────────── components ──────────────────────────────

    /** Sidebar glyph; receives `{ size, active }` from the panel row. */
    function ArchiveIcon(props) {
      const size = typeof props.size === 'number' ? props.size : 18;
      return h(
        'svg',
        {
          width: size,
          height: size,
          viewBox: '0 0 20 20',
          fill: 'none',
          'aria-hidden': 'true',
          style: { display: 'block' },
        },
        h('rect', { x: 2.5, y: 3.5, width: 15, height: 4, rx: 1.2, stroke: 'currentColor', strokeWidth: 1.4 }),
        h('path', {
          d: 'M4 7.5v7.2a1.8 1.8 0 0 0 1.8 1.8h8.4a1.8 1.8 0 0 0 1.8-1.8V7.5',
          stroke: 'currentColor',
          strokeWidth: 1.4,
          strokeLinecap: 'round',
        }),
        h('path', { d: 'M8 11h4', stroke: 'currentColor', strokeWidth: 1.4, strokeLinecap: 'round' }),
      );
    }

    /** Decorative archive glyph for empty and unavailable states. */
    function StateGlyph() {
      return h(
        'svg',
        { width: 26, height: 26, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': 'true' },
        h('rect', { x: 2.5, y: 3.5, width: 15, height: 4, rx: 1.2, stroke: 'currentColor', strokeWidth: 1.3 }),
        h('path', {
          d: 'M4 7.5v7.2a1.8 1.8 0 0 0 1.8 1.8h8.4a1.8 1.8 0 0 0 1.8-1.8V7.5',
          stroke: 'currentColor',
          strokeWidth: 1.3,
          strokeLinecap: 'round',
        }),
        h('path', { d: 'M8 11h4', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' }),
      );
    }

    /** Search glyph. */
    function SearchGlyph() {
      return h(
        'svg',
        { width: 14, height: 14, viewBox: '0 0 20 20', fill: 'none', 'aria-hidden': 'true' },
        h('circle', { cx: 8.6, cy: 8.6, r: 4.6, stroke: 'currentColor', strokeWidth: 1.5 }),
        h('path', { d: 'm12.4 12.4 3.4 3.4', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' }),
      );
    }

    /** Disclosure caret. */
    function Caret(props) {
      return h(
        'span',
        { className: 'dac-caret', 'data-open': props.open === true ? 'true' : 'false', 'aria-hidden': 'true' },
        h(
          'svg',
          { width: 12, height: 12, viewBox: '0 0 12 12', fill: 'none' },
          h('path', { d: 'M4.5 2.5 8 6l-3.5 3.5', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }),
        ),
      );
    }

    /** Confirmation dialog shared by the single-row and batch actions. */
    function DeleteDialog(props) {
      const { t, ids, byId, error, pending, onCancel, onConfirm } = props;
      const cancelRef = React.useRef(null);

      React.useEffect(() => {
        const timer = window.setTimeout(() => {
          if (cancelRef.current !== null) cancelRef.current.focus();
        }, 0);
        return () => window.clearTimeout(timer);
      }, []);

      React.useEffect(() => {
        const onKey = (event) => {
          if (event.key !== 'Escape' || pending) return;
          event.stopPropagation();
          onCancel();
        };
        document.addEventListener('keydown', onKey, true);
        return () => document.removeEventListener('keydown', onKey, true);
      }, [onCancel, pending]);

      const samples = ids.slice(0, 6);
      const titleOf = (id) => {
        const info = byId[id];
        return info !== undefined && typeof info.displayTitle === 'string' && info.displayTitle !== '' ? info.displayTitle : id;
      };

      return h(
        'div',
        {
          className: 'dac-modal',
          onMouseDown: (event) => {
            if (event.target === event.currentTarget && !pending) onCancel();
          },
        },
        h(
          'div',
          {
            className: 'dac-dialog',
            role: 'dialog',
            'aria-modal': 'true',
            'aria-labelledby': 'dac-dialog-title',
            'aria-describedby': 'dac-dialog-desc',
          },
          h(
            'div',
            { className: 'dac-dialogBody' },
            h(
              'span',
              { className: 'dac-dialogIcon', 'aria-hidden': 'true' },
              h(
                'svg',
                { width: 22, height: 22, viewBox: '64 64 896 896', fill: 'currentColor', focusable: 'false' },
                h('path', {
                  d: 'M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm-32 232c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v272c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8V296zm32 440a48.01 48.01 0 010-96 48.01 48.01 0 010 96z',
                }),
              ),
            ),
            h(
              'div',
              { className: 'dac-dialogMain' },
              h('h2', { id: 'dac-dialog-title', className: 'dac-dialogTitle' },
                ids.length === 1 ? t('dialog.titleOne') : fill(t('dialog.titleMany'), { count: ids.length })),
              h('p', { id: 'dac-dialog-desc', className: 'dac-dialogDesc' },
                ids.length === 1
                  ? fill(t('dialog.descOne'), { title: titleOf(ids[0]) })
                  : fill(t('dialog.descMany'), { count: ids.length })),
              ids.length > 1
                ? h('ul', { className: 'dac-dialogList' },
                    samples.map((id) => h('li', { key: id, title: id }, titleOf(id))),
                    ids.length > samples.length
                      ? h('li', { key: '__more__' }, fill(t('dialog.more'), { count: ids.length - samples.length }))
                      : null)
                : null,
              h('p', { className: 'dac-dialogNote' }, t('dialog.note')),
              error !== null && error !== undefined ? h('p', { className: 'dac-dialogError', role: 'alert' }, error) : null,
            ),
          ),
          h('div', { className: 'dac-dialogActions' },
            h('button', { ref: cancelRef, type: 'button', className: 'dac-btn', onClick: onCancel, disabled: pending }, t('dialog.cancel')),
            h('button', { type: 'button', className: 'dac-btn dac-btnDanger', onClick: onConfirm, disabled: pending },
              pending ? t('dialog.pending') : t('dialog.confirm'))),
        ),
      );
    }

    /** Transient status line. */
    function Toast(props) {
      return h('div', { className: 'dac-toast', 'data-tone': props.tone, role: 'status' }, props.text);
    }

    /** The archived-session page registered into the `main` panel. */
    function ArchivePage(props) {
      const deps = props.deps;
      const t = deps.translate;
      const sessions = deps.useSessions((state) => state);
      const workspaces = deps.useWorkspaces((state) => state);
      const localeId = deps.useLocaleId();
      const now = useNow(30000);

      const [search, setSearch] = React.useState('');
      const [selected, setSelected] = React.useState(() => new Set());
      const [collapsed, setCollapsed] = React.useState(() => new Set());
      const [dialog, setDialog] = React.useState(null);
      const [pending, setPending] = React.useState(false);
      const [busyId, setBusyId] = React.useState(null);
      const [toast, setToast] = React.useState(null);
      const allRef = React.useRef(null);
      const headingRef = React.useRef(null);

      const available = deps.available();
      const byId = sessions !== undefined && sessions.byId !== undefined ? sessions.byId : EMPTY_SESSIONS.byId;
      const archivedIds = workspaces !== undefined && Array.isArray(workspaces.archivedSessionIds) ? workspaces.archivedSessionIds : [];
      const workspaceItems = workspaces !== undefined && Array.isArray(workspaces.items) ? workspaces.items : [];
      const sessionsReady = sessions !== undefined && sessions.phase === 'ready';
      const workspacesReady = workspaces !== undefined && workspaces.phase === 'ready';

      const groups = React.useMemo(
        () => buildGroups(workspaceItems, archivedIds, byId, t),
        [workspaceItems, archivedIds, byId, t],
      );

      const query = search.trim().toLowerCase();
      const visibleGroups = React.useMemo(() => {
        if (query === '') return groups;
        return groups
          .map((group) => ({
            ...group,
            ids: group.ids.filter((id) => {
              const info = byId[id] ?? {};
              const haystack = [info.displayTitle, info.title, info.cwd, id, group.title, group.path]
                .filter((value) => typeof value === 'string')
                .join(' ')
                .toLowerCase();
              return haystack.includes(query);
            }),
          }))
          .filter((group) => group.ids.length > 0);
      }, [groups, query, byId]);

      const totalArchived = React.useMemo(() => groups.reduce((sum, group) => sum + group.ids.length, 0), [groups]);
      const visibleIds = React.useMemo(() => visibleGroups.flatMap((group) => group.ids), [visibleGroups]);
      const selectedVisible = React.useMemo(() => visibleIds.filter((id) => selected.has(id)), [visibleIds, selected]);
      const allSelected = visibleIds.length > 0 && selectedVisible.length === visibleIds.length;
      const someSelected = selectedVisible.length > 0 && !allSelected;

      React.useEffect(() => {
        if (allRef.current !== null) allRef.current.indeterminate = someSelected;
      }, [someSelected]);

      React.useEffect(() => {
        setSelected((previous) => {
          let changed = false;
          const next = new Set();
          for (const id of previous) {
            if (byId[id] !== undefined) next.add(id);
            else changed = true;
          }
          return changed ? next : previous;
        });
      }, [byId]);

      React.useEffect(() => {
        if (toast === null) return undefined;
        const timer = window.setTimeout(() => setToast(null), 4200);
        return () => window.clearTimeout(timer);
      }, [toast]);

      const toggleOne = React.useCallback((id) => {
        setSelected((previous) => {
          const next = new Set(previous);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        });
      }, []);

      const toggleAll = React.useCallback(() => {
        setSelected((previous) => {
          const next = new Set(previous);
          const everySelected = visibleIds.length > 0 && visibleIds.every((id) => next.has(id));
          for (const id of visibleIds) {
            if (everySelected) next.delete(id);
            else next.add(id);
          }
          return next;
        });
      }, [visibleIds]);

      const toggleGroup = React.useCallback((groupId) => {
        setCollapsed((previous) => {
          const next = new Set(previous);
          if (next.has(groupId)) next.delete(groupId);
          else next.add(groupId);
          return next;
        });
      }, []);

      const askDelete = React.useCallback((ids) => {
        if (ids.length === 0) return;
        setDialog({ ids, error: null });
      }, []);

      const cancelDelete = React.useCallback(() => {
        if (pending) return;
        setDialog(null);
      }, [pending]);

      const confirmDelete = React.useCallback(async () => {
        if (dialog === null || pending) return;
        const ids = dialog.ids;
        // The archived row is normally not openable, but archiving the current
        // Session keeps its view; capture that before the row disappears so a
        // fresh Session can take its place.
        const mainViewId = Object.values(byId).find((summary) => (summary?.retainedBy?.mainView ?? 0) > 0)?.id;
        const mainViewWorkspaceId = mainViewId === undefined
          ? undefined
          : workspaceItems.find((workspace) => (workspace.sessionIds ?? []).includes(mainViewId))?.workspaceId;
        setPending(true);
        const result = await deps.requestDelete(ids);
        setPending(false);

        if (result.ok !== true) {
          const message = errorText(t, result.code, result.message);
          setDialog((current) => (current === null ? current : { ...current, error: message }));
          setToast({ tone: 'error', text: message });
          return;
        }

        const failed = result.results.filter((entry) => entry.ok !== true);
        const deleted = result.results.filter((entry) => entry.ok === true).map((entry) => entry.sessionId);
        if (deleted.length > 0) {
          setSelected((previous) => {
            const next = new Set(previous);
            for (const id of deleted) next.delete(id);
            return next;
          });
        }

        if (result.deleted === 0) {
          const first = failed[0];
          const message = errorText(t, first?.code, first?.message);
          setDialog((current) => (current === null ? current : { ...current, error: message }));
          setToast({ tone: 'error', text: message });
          return;
        }

        setDialog(null);
        if (mainViewId !== undefined && deleted.includes(mainViewId)) {
          deps.startSession(mainViewWorkspaceId);
        }
        if (failed.length > 0) {
          const first = failed[0];
          setToast({
            tone: 'warning',
            text: fill(t('toast.partial'), {
              ok: result.deleted,
              failed: failed.length,
              message: errorText(t, first?.code, first?.message),
            }),
          });
        } else {
          setToast({
            tone: 'success',
            text: result.deleted === 1 ? t('toast.deletedOne') : fill(t('toast.deletedMany'), { count: result.deleted }),
          });
        }
        window.setTimeout(() => {
          if (headingRef.current !== null) headingRef.current.focus();
        }, 0);
      }, [dialog, pending, t, deps, byId, workspaceItems, headingRef]);

      const unarchive = React.useCallback(async (sessionId) => {
        setBusyId(sessionId);
        try {
          await deps.unarchiveSession(sessionId);
          setToast({ tone: 'success', text: t('toast.unarchived') });
        } catch (error) {
          setToast({
            tone: 'error',
            text: fill(t('toast.unarchiveFailed'), { message: error instanceof Error ? error.message : String(error) }),
          });
        } finally {
          setBusyId(null);
        }
      }, [deps, t]);

      const heading = h('h1', { className: 'dac-title', tabIndex: -1, ref: headingRef }, t('page.title'));

      const head = h('header', { className: 'dac-head' },
        h('div', null,
          h('div', { className: 'dac-titleRow' },
            heading,
            h('span', { className: 'dac-count' }, fill(t('page.count'), { count: totalArchived }))),
          h('p', { className: 'dac-subtitle' },
            totalArchived === 0 ? t('page.subtitleEmpty') : fill(t('page.subtitle'), { groups: groups.length }))),
        h('label', { className: 'dac-search' },
          h('span', { className: 'dac-searchIcon' }, h(SearchGlyph)),
          h('input', {
            className: 'dac-searchInput',
            type: 'search',
            value: search,
            placeholder: t('search.placeholder'),
            'aria-label': t('search.placeholder'),
            onChange: (event) => setSearch(event.target.value),
          }),
          search === ''
            ? null
            : h('button', {
                type: 'button',
                className: 'dac-searchClear',
                onClick: () => setSearch(''),
                'aria-label': t('search.clear'),
                title: t('search.clear'),
              }, '\u00d7')));

      const toolbar = h('div', { className: 'dac-toolbar' },
        h('label', { className: 'dac-checkLabel' },
          h('input', {
            ref: allRef,
            type: 'checkbox',
            className: 'dac-check',
            checked: allSelected,
            disabled: visibleIds.length === 0,
            onChange: toggleAll,
            'aria-label': t('toolbar.selectAll'),
          }),
          h('span', null, t('toolbar.selectAll'))),
        h('span', { className: 'dac-toolbarCount' }, fill(t('toolbar.selected'), { count: selectedVisible.length })),
        h('span', { className: 'dac-spacer' }),
        h('button', {
          type: 'button',
          className: 'dac-btn dac-btnDanger',
          disabled: selectedVisible.length === 0 || pending,
          onClick: () => askDelete(selectedVisible),
        }, fill(t('toolbar.deleteSelected'), { count: selectedVisible.length })));

      const renderRow = (sessionId) => {
        const info = byId[sessionId] ?? {};
        const title = typeof info.displayTitle === 'string' && info.displayTitle !== '' ? info.displayTitle : sessionId;
        const updatedAt = typeof info.updatedAt === 'number' ? info.updatedAt : 0;
        const isSelected = selected.has(sessionId);
        return h('li', { key: sessionId, className: 'dac-row', 'data-selected': isSelected ? 'true' : 'false' },
          h('input', {
            type: 'checkbox',
            className: 'dac-check',
            checked: isSelected,
            onChange: () => toggleOne(sessionId),
            'aria-label': title,
          }),
          h('div', { className: 'dac-rowMain' },
            h('span', { className: 'dac-rowTitle', title }, title),
            h('span', { className: 'dac-rowMeta' },
              h('span', { className: 'dac-rowMetaText', title: formatAbsolute(updatedAt, localeId) },
                formatRelative(updatedAt, now, localeId)),
              info.blank === true ? h('span', { className: 'dac-badge' }, t('row.blank')) : null,
              info.running === true ? h('span', { className: 'dac-badge', 'data-tone': 'run' }, t('row.running')) : null,
              typeof info.cwd === 'string' && info.cwd !== ''
                ? h('span', { className: 'dac-dot', 'aria-hidden': 'true' })
                : null,
              typeof info.cwd === 'string' && info.cwd !== ''
                ? h('span', { className: 'dac-rowMetaText', title: info.cwd }, info.cwd)
                : null)),
          h('div', { className: 'dac-rowActions' },
            h('button', {
              type: 'button',
              className: 'dac-link',
              disabled: busyId === sessionId || pending,
              onClick: () => unarchive(sessionId),
            }, t('row.unarchive')),
            h('button', {
              type: 'button',
              className: 'dac-link dac-linkDanger',
              disabled: busyId === sessionId || pending,
              onClick: () => askDelete([sessionId]),
            }, t('row.delete'))));
      };

      let body;
      if (!available) {
        body = h('div', { className: 'dac-state' },
          h('span', { className: 'dac-stateIcon' }, h(StateGlyph)),
          h('p', { className: 'dac-stateTitle' }, t('state.unavailable')));
      } else if ((!sessionsReady || !workspacesReady) && totalArchived === 0) {
        body = h('div', { className: 'dac-state' },
          h('span', { className: 'dac-stateIcon' }, h(StateGlyph)),
          h('p', { className: 'dac-stateTitle' }, t('state.loading')));
      } else if (totalArchived === 0) {
        body = h('div', { className: 'dac-state' },
          h('span', { className: 'dac-stateIcon' }, h(StateGlyph)),
          h('p', { className: 'dac-stateTitle' }, t('empty.title')),
          h('p', { className: 'dac-stateDesc' }, t('empty.desc')));
      } else if (visibleGroups.length === 0) {
        body = h('div', { className: 'dac-state' },
          h('span', { className: 'dac-stateIcon' }, h(StateGlyph)),
          h('p', { className: 'dac-stateTitle' }, t('nomatch.title')),
          h('p', { className: 'dac-stateDesc' }, t('nomatch.desc')));
      } else {
        body = h('div', { className: 'dac-list' },
          visibleGroups.map((group) => {
            const isCollapsed = collapsed.has(group.id);
            return h('section', { className: 'dac-group', key: group.id },
              h('button', {
                type: 'button',
                className: 'dac-groupHead',
                onClick: () => toggleGroup(group.id),
                'aria-expanded': isCollapsed ? 'false' : 'true',
              },
                h(Caret, { open: !isCollapsed }),
                h('span', { className: 'dac-groupTitle', title: group.title }, group.title),
                group.path === undefined ? null : h('span', { className: 'dac-groupPath', title: group.path }, group.path),
                h('span', { className: 'dac-groupCount' }, group.ids.length)),
              isCollapsed ? null : h('ul', { className: 'dac-rows' }, group.ids.map(renderRow)));
          }));
      }

      return h('div', { className: 'dac-page' },
        h('div', { className: 'dac-scroll' }, head, toolbar, body),
        dialog === null
          ? null
          : h(DeleteDialog, {
              t,
              ids: dialog.ids,
              byId,
              error: dialog.error,
              pending,
              onCancel: cancelDelete,
              onConfirm: confirmDelete,
            }),
        toast === null ? null : h(Toast, { tone: toast.tone, text: toast.text }));
    }

    // ─────────────────────────────── wiring ─────────────────────────────────

    /**
     * Services the browser half consumes. `slots` and `locale` are the
     * contribution surface; `sessions` and `workspaces` are the archived-list
     * read model, and the host route owns deletion.
     */
    const inject = ['slots', 'locale', 'sessions', 'workspaces'];

    /**
     * Client plugin body.
     * @param ctx - client root context.
     */
    function apply(ctx) {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'archive-sessions: dictionaries');

      ctx.effect(() => {
        if (typeof document === 'undefined') return () => {};
        const tagId = 'dsh-plugin-archive-sessions/styles';
        if (document.querySelector(`style[data-plugin-css="${tagId}"]`) !== null) return () => {};
        const tag = document.createElement('style');
        tag.dataset.plugin = 'dsh-plugin-archive-sessions';
        tag.dataset.pluginCss = tagId;
        tag.textContent = CSS;
        document.head.appendChild(tag);
        return () => {
          tag.remove();
        };
      }, 'archive-sessions: styles');

      let t;
      try {
        t = ctx.locale.bind(NS);
      } catch {
        t = (key, params) => fill(key, params);
      }

      const face = (name) => {
        try {
          return ctx.get(name);
        } catch {
          return undefined;
        }
      };
      const sessionsStore = () => {
        const sessions = face('sessions');
        return sessions !== undefined && sessions.list !== undefined ? sessions.list : undefined;
      };
      const workspacesStore = () => {
        const workspaces = face('workspaces');
        return workspaces !== undefined && workspaces.list !== undefined ? workspaces.list : undefined;
      };

      const subscribeSessions = (listener) => {
        const store = sessionsStore();
        return store === undefined ? noop : store.subscribe(listener);
      };
      const getSessionsSnapshot = () => {
        const store = sessionsStore();
        return store === undefined ? EMPTY_SESSIONS : store.getSnapshot();
      };
      const subscribeWorkspaces = (listener) => {
        const store = workspacesStore();
        return store === undefined ? noop : store.subscribe(listener);
      };
      const getWorkspacesSnapshot = () => {
        const store = workspacesStore();
        return store === undefined ? EMPTY_WORKSPACES : store.getSnapshot();
      };

      function useSessions(selector) {
        return selector(React.useSyncExternalStore(subscribeSessions, getSessionsSnapshot, getSessionsSnapshot));
      }
      function useWorkspaces(selector) {
        return selector(React.useSyncExternalStore(subscribeWorkspaces, getWorkspacesSnapshot, getWorkspacesSnapshot));
      }
      function useLocaleId() {
        return React.useSyncExternalStore(
          (listener) => ctx.locale.subscribe(listener),
          () => ctx.locale.getSnapshot(),
          () => ctx.locale.getSnapshot(),
        ).active;
      }

      /** POST one batch to the authenticated host route. */
      async function requestDelete(sessionIds) {
        let response;
        try {
          response = await fetch(DELETE_ROUTE, {
            method: 'POST',
            credentials: 'same-origin',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ sessionIds }),
          });
        } catch (error) {
          return { ok: false, code: 'network', message: error instanceof Error ? error.message : String(error) };
        }
        let payload;
        try {
          payload = await response.json();
        } catch {
          payload = undefined;
        }
        if (payload === undefined || payload === null || typeof payload !== 'object') {
          return { ok: false, code: `http/${response.status}`, message: `HTTP ${response.status}` };
        }
        if (response.ok && payload.ok === true && Array.isArray(payload.results)) return payload;
        const error = payload.error;
        return {
          ok: false,
          code: error !== undefined && typeof error.code === 'string' ? error.code : `http/${response.status}`,
          message: error !== undefined && typeof error.message === 'string' ? error.message : `HTTP ${response.status}`,
        };
      }

      /** Unarchive one session through the Workspace controller. */
      async function unarchiveSession(sessionId) {
        const workspaces = face('workspaces');
        if (workspaces === undefined || typeof workspaces.unarchiveSession !== 'function') {
          throw new Error('the workspace service is unavailable');
        }
        await workspaces.unarchiveSession(sessionId);
      }

      /** Open a fresh Session in `workspaceId` after deleting the viewed one. */
      function startSession(workspaceId) {
        const uiWorkspace = face('uiWorkspace');
        if (uiWorkspace === undefined || typeof uiWorkspace.startSession !== 'function') return;
        try {
          uiWorkspace.startSession(workspaceId);
        } catch (error) {
          console.warn('[archive-sessions] opening a fresh session failed:', error);
        }
      }

      const deps = {
        translate: t,
        useSessions,
        useWorkspaces,
        useLocaleId,
        available: () => sessionsStore() !== undefined && workspacesStore() !== undefined,
        requestDelete,
        unarchiveSession,
        startSession,
      };

      ctx.slots.inject('main', () =>
        ctx.slots.register(
          {
            name: 'main',
            key: PANEL_ID,
            locale: NS,
            inject: () => ({ deps }),
          },
          ArchivePage,
        ));

      ctx.slots.inject('sidebar.panellist', () =>
        ctx.slots.register(
          {
            name: 'sidebar.panellist',
            id: PANEL_ID,
            order: 20,
            locale: NS,
            label: () => t('panel.label'),
          },
          ArchiveIcon,
        ));
    }

    return { inject, apply };
  },
});
