import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { ROUTES } from '@shared/constants/routes';

const HostSetupScreen = lazy(() => import('./screen/host-setup-screen'));
const HostRoomScreen = lazy(() => import('./screen/host-room-screen'));

export const hostRoutes: RouteObject[] = [
  // The literal /host/room/:code is listed BEFORE /host/:gameId. React Router
  // ranks by specificity rather than order, but keeping the literal first means
  // the list reads correctly and survives a move to an order-sensitive router.
  { path: ROUTES.HOST_ROOM, element: <HostRoomScreen /> },
  { path: ROUTES.HOST_SETUP, element: <HostSetupScreen /> },
];
