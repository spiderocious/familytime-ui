import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';

import { sound } from '@shared/services/sound';

import { AppProvider } from './app.provider';
import { router } from './app.routes';

export function App() {
  // Browsers only allow audio after a gesture. The first tap anywhere unlocks
  // it, so by the time a game starts the sounds are ready.
  useEffect(() => {
    const unlock = (): void => sound.unlock();
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
}
