/**
 * Host plugin entry: registers the authenticated `/api/archive-sessions` route
 * on `ctx.webServer` and serves permanent deletion of archived Sessions.
 *
 * The route exists only while this fiber is alive: the registration's disposer
 * is owned by `ctx.effect`, so unloading the plugin removes the route instead
 * of leaving a dangling handler.
 *
 * @module dsh-plugin-archive-sessions/host
 */

import { createArchiveSessionsHandler, ROUTE_PREFIX } from './http.js';

/** Stable Cordis plugin name. */
export const name = 'archive-sessions';

/**
 * The route needs the Web server to exist. Every other service
 * (`connection`, `sessionPersistence`, `sessions`, `agents`,
 * `workspaceRegistry`) is read lazily at request time, so the plugin still
 * loads when an optional service is absent from the profile.
 */
export const inject = ['webServer'];

/**
 * Install the host half.
 * @param {object} ctx - host plugin context.
 */
export function apply(ctx) {
  ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(
      () =>
        webCtx.webServer.register({
          kind: 'prefix',
          path: ROUTE_PREFIX,
          handler: createArchiveSessionsHandler(webCtx),
        }),
      'archive-sessions: /api/archive-sessions route',
    );
  });
}
