import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { ROUTES } from '@shared/constants/routes';

import { PhonePrefsProvider } from './providers/phone-prefs-provider';

const JoinScreen = lazy(() => import('./screen/join-screen'));
const PlayerRoomScreen = lazy(() => import('./screen/player-room-screen'));

export const playerRoutes: RouteObject[] = [
  // The literal /join before the parameterised /join/:code.
  { path: ROUTES.JOIN, element: <PhonePrefsProvider><JoinScreen /></PhonePrefsProvider> },
  { path: ROUTES.JOIN_WITH_CODE, element: <PhonePrefsProvider><JoinScreen /></PhonePrefsProvider> },
  { path: ROUTES.PLAY, element: <PhonePrefsProvider><PlayerRoomScreen /></PhonePrefsProvider> },
];
