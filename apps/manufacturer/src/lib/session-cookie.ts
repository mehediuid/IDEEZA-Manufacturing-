/**
 * This panel's own session cookie.
 *
 * The buyer panel and the shop panel used to share one cookie name,
 * `ideeza_session`. Cookies are scoped to a host, not a port, so on one machine
 * (localhost:3100 beside localhost:3200) signing into one panel replaced the
 * other's session and the second window answered "This account cannot use the
 * shop app". A name per panel keeps both signed in side by side.
 * Kept in the app rather than in `@ideeza/auth` because the name is about
 * which panel is reading it, and the middleware imports it on the edge.
 */
export const SESSION_COOKIE = 'ideeza_session_shop';
