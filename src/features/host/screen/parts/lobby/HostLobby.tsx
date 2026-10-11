import { Repeat, Show } from 'meemaw';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Play, Settings2, X } from '@icons';
import { PATHS } from '@shared/constants/routes';
import { CLIENT_MESSAGE, type RoomView } from '@shared/realtime/protocol';
import { useRoomSocket } from '@shared/realtime/room-socket-context';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@shared/ui/Button';
import { InlineError } from '@shared/ui/InlineError';

import { JoinPanel } from './JoinPanel';
import { PlayerWall } from './PlayerWall';
import { SettingsDialog } from './SettingsDialog';

interface HostLobbyProps {
  room: RoomView;
}

const ERROR_VISIBLE_MS = 6000;

/** The waiting room on the big screen: how to join, who is in, and Start. */
export function HostLobby({ room }: HostLobbyProps) {
  const { send, error } = useRoomSocket();
  const navigate = useNavigate();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [shownError, setShownError] = useState<string | null>(null);

  // A refused Start (nobody has joined, no questions match) comes back as a
  // server error. Show the server's own message, then let it fade.
  useEffect(() => {
    if (error === null) return undefined;
    setShownError(error.message);
    const timer = window.setTimeout(() => setShownError(null), ERROR_VISIBLE_MS);
    return () => window.clearTimeout(timer);
  }, [error]);

  const canStart = room.players.length > 0;

  return (
    <div className="grid min-h-0 flex-1 gap-[clamp(16px,2.4vw,40px)] px-[clamp(16px,2.4vw,40px)] pb-[clamp(16px,2vw,32px)] pt-[clamp(12px,1.6vw,24px)] lg:grid-cols-[minmax(300px,0.8fr)_minmax(0,1.4fr)]">
      <JoinPanel code={room.code} />

      <div className="flex min-h-0 flex-col gap-5">
        <div>
          <h1 className="animate-drop-in text-[clamp(40px,5.4vw,92px)]">{room.game_title}</h1>
          <ul className="mt-3 flex flex-wrap gap-2">
            <Repeat each={room.facts}>
              {(fact) => (
                <li key={fact.label} className="rounded-full border-2 border-white/40 bg-white/15 px-4 py-1.5 text-[clamp(14px,1.2vw,18px)] font-extrabold">
                  <span className="opacity-75">{fact.label}:</span> {fact.value}
                </li>
              )}
            </Repeat>
          </ul>
        </div>

        <PlayerWall players={room.players} />

        <Show when={shownError !== null}>
          <InlineError message={shownError ?? ''} />
        </Show>

        <div className="flex flex-wrap items-center gap-4">
          <Button
            size={BUTTON_SIZE.XL}
            disabled={!canStart}
            className={canStart ? 'animate-heartbeat' : undefined}
            icon={<Play size={28} strokeWidth={3} fill="currentColor" aria-hidden="true" />}
            onClick={() => send(CLIENT_MESSAGE.HOST_START)}
          >
            <Show when={canStart} fallback="Waiting for a player">
              Everybody’s in — start!
            </Show>
          </Button>
          <Button
            variant={BUTTON_VARIANT.PLAIN}
            size={BUTTON_SIZE.LG}
            icon={<Settings2 size={22} strokeWidth={3} aria-hidden="true" />}
            onClick={() => setSettingsOpen(true)}
          >
            Settings
          </Button>
          <Button
            variant={BUTTON_VARIANT.PLAIN}
            size={BUTTON_SIZE.LG}
            icon={<X size={22} strokeWidth={3} aria-hidden="true" />}
            onClick={() => {
              send(CLIENT_MESSAGE.HOST_CLOSE_ROOM);
              navigate(PATHS.home);
            }}
          >
            Close room
          </Button>
        </div>
      </div>

      <Show when={settingsOpen}>
        <SettingsDialog
          gameId={room.game_id}
          config={room.config}
          onSave={(config) => send(CLIENT_MESSAGE.HOST_CONFIGURE, config)}
          onClose={() => setSettingsOpen(false)}
        />
      </Show>
    </div>
  );
}
