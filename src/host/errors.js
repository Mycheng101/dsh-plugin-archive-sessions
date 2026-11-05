/**
 * Stable error taxonomy for the `/api/archive-sessions` route. The browser
 * half localizes every code; the raw `message` exists for logs and for
 * developers, never as display text.
 *
 * @module dsh-plugin-archive-sessions/host/errors
 */

/** HTTP status for each stable code. */
export const ERROR_STATUSES = Object.freeze({
  'session/invalid': 400,
  'session/not-archived': 409,
  'session/not-found': 404,
  'session/active': 409,
  'workspace/refused': 500,
  'delete/failed': 500,
  'request/invalid-json': 400,
  'request/invalid-body': 400,
  'request/too-large': 413,
  'request/unsupported-media-type': 415,
  'route/not-found': 404,
  'route/method-not-allowed': 405,
  'service/unavailable': 503,
  'gateway/internal': 500,
});

/** A stable, client-facing failure with a code and an HTTP status. */
export class ArchiveSessionsError extends Error {
  /**
   * @param {string} code - one of {@link ERROR_STATUSES}.
   * @param {string} message - human-readable developer message.
   * @param {{ status?: number, details?: unknown, cause?: unknown }} [options]
   *   optional status override, structured details for the response body, and
   *   the underlying failure.
   */
  constructor(code, message, options = {}) {
    super(message, options.cause === undefined ? undefined : { cause: options.cause });
    this.name = 'ArchiveSessionsError';
    /** Stable code the client switches on. */
    this.code = code;
    /** HTTP status to answer with. */
    this.status = options.status ?? ERROR_STATUSES[code] ?? 500;
    /** Optional structured details, safe to serialize into the response. */
    this.details = options.details;
  }
}

/** Best-effort message of an arbitrary thrown value. */
export function messageOf(error) {
  return error instanceof Error ? error.message : String(error);
}
