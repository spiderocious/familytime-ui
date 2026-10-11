import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';

import { ROUTES } from '@shared/constants/routes';

const HomeScreen = lazy(() => import('./screen/home-screen'));

export const homeRoutes: RouteObject[] = [{ path: ROUTES.HOME, element: <HomeScreen /> }];
