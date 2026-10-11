/**
 * Single source of truth for every path in the app.
 * Never inline a path string in a <Link to="..."> or navigate("...").
 *
 * Two device contexts: the big screen (/host/*) and the phone (/join, /play/*).
 */
export const ROUTES = {
  HOME: '/',

  // Big screen
  HOST_SETUP: '/host/:gameId',
  HOST_ROOM: '/host/room/:code',

  // Phone
  JOIN: '/join',
  // The QR code and join link land here with the code already filled in.
  JOIN_WITH_CODE: '/join/:code',
  PLAY: '/play/:code',

  // The design system, live.
  PREVIEW: '/preview',
} as const;

/** Parametric routes are functions, so a path is never assembled by hand. */
export const PATHS = {
  home: '/',
  join: '/join',
  hostSetup: (gameId: string) => `/host/${gameId}`,
  hostRoom: (code: string) => `/host/room/${code}`,
  joinWithCode: (code: string) => `/join/${code}`,
  play: (code: string) => `/play/${code}`,
} as const;
