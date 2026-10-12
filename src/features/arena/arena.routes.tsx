import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { ROUTES } from '@shared/constants/routes';

const SoloSetupScreen = lazy(() => import('./screen/solo-setup-screen'));
const ArenaPlayScreen = lazy(() => import('./screen/arena-play-screen'));

export const arenaRoutes: RouteObject[] = [
  // The literal /solo before /solo/:code.
  { path: ROUTES.SOLO, element: <SoloSetupScreen /> },
  { path: ROUTES.SOLO_PLAY, element: <ArenaPlayScreen /> },
];
