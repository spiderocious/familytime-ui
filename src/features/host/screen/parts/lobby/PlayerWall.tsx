import { Repeat, Show } from 'meemaw';

import type { RoomPlayer } from '@shared/realtime/protocol';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';

interface PlayerWallProps {
  players: RoomPlayer[];
}

/** Everyone who has joined, popping in as they arrive. */
export function PlayerWall({ players }: PlayerWallProps) {
  return (
    <section aria-label="Players" className="flex min-h-0 flex-1 flex-col gap-4">
      <h2 className="font-display text-[clamp(26px,3vw,48px)] font-extrabold">
        <Show when={players.length > 0} fallback="Waiting for players…">
          {players.length} {players.length === 1 ? 'player' : 'players'} in
        </Show>
      </h2>

      <Show
        when={players.length > 0}
        fallback={
          <p className="animate-bob text-[clamp(18px,1.8vw,28px)] font-bold opacity-90">
            Grab a phone and scan the code. Names will pop up right here.
          </p>
        }
      >
        <ul className="flex flex-wrap content-start gap-[clamp(10px,1.2vw,20px)] overflow-y-auto pb-4">
          <Repeat each={players}>
            {(player) => (
              <li
                key={player.id}
                className="flex animate-pop-in items-center gap-3 rounded-full border-3 border-ink bg-surface py-2 pl-2 pr-5 text-ink shadow-pop-sm"
              >
                <Avatar emoji={player.avatar} size={AVATAR_SIZE.LG} away={!player.connected} />
                <span className="font-display text-[clamp(20px,2vw,32px)] font-extrabold">{player.name}</span>
              </li>
            )}
          </Repeat>
        </ul>
      </Show>
    </section>
  );
}
