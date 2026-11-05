/**
 * Host half of the archive-sessions bundle.
 *
 * The browser half can read the archived-session set, unarchive a session and
 * render the whole list by itself, but it cannot delete a stored Session: DSH
 * exposes no deletion service, so the log directory and the workspace/global
 * bookkeeping have to be removed by the Host. That capability is served over
 * one authenticated route, `/api/archive-sessions/*`, registered on the Web
 * server. See `src/host/plugin.js`.
 *
 * @module dsh-plugin-archive-sessions
 */
export { name, inject, apply } from './src/host/plugin.js';
