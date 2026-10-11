import { useCallback, useEffect, useState } from 'react';

/** Toggle the whole page into fullscreen: a TV has no use for browser chrome. */
export function useFullscreen() {
  const [active, setActive] = useState(() => document.fullscreenElement !== null);

  useEffect(() => {
    const sync = (): void => setActive(document.fullscreenElement !== null);
    document.addEventListener('fullscreenchange', sync);
    return () => document.removeEventListener('fullscreenchange', sync);
  }, []);

  const toggle = useCallback(() => {
    // Either call can be refused by the browser; there is nothing to recover.
    if (document.fullscreenElement === null) {
      void document.documentElement.requestFullscreen().catch(() => undefined);
    } else {
      void document.exitFullscreen().catch(() => undefined);
    }
  }, []);

  return { active, toggle };
}
