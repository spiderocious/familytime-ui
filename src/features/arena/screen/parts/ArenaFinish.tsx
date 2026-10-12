import { useNavigate } from 'react-router-dom';

import { Home, RotateCcw, Settings2 } from '@icons';
import { PATHS } from '@shared/constants/routes';
import { CLIENT_MESSAGE } from '@shared/realtime/protocol';
import { useRoomSocket } from '@shared/realtime/room-socket-context';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@shared/ui/Button';

/** What follows a finished solo run: go again, change the settings, or leave. */
export function ArenaFinish() {
  const navigate = useNavigate();
  const { send } = useRoomSocket();

  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      {/* The player owns their room, so they can restart it with no host. */}
      <Button size={BUTTON_SIZE.LG} icon={<RotateCcw size={22} strokeWidth={3} aria-hidden="true" />} onClick={() => send(CLIENT_MESSAGE.HOST_PLAY_AGAIN)}>
        Play again
      </Button>
      <Button variant={BUTTON_VARIANT.PLAIN} icon={<Settings2 size={20} strokeWidth={3} aria-hidden="true" />} onClick={() => navigate(PATHS.solo)}>
        Change settings
      </Button>
      <Button variant={BUTTON_VARIANT.PLAIN} icon={<Home size={20} strokeWidth={3} aria-hidden="true" />} onClick={() => navigate(PATHS.home)}>
        Home
      </Button>
    </div>
  );
}
