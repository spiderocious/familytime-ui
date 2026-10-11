import { Repeat } from 'meemaw';

import type { RoomPlayer, RoomView } from '@shared/realtime/protocol';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';

import { ReactionBar } from './ReactionBar';

interface PlayerLobbyProps {
  room: RoomView;
  me: RoomPlayer;
}

/** You are in. Nothing to do but wait — and throw emoji at the TV. */
export function PlayerLobby({ room, me }: PlayerLobbyProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-between gap-6 px-5 pb-8 pt-6 text-center">
      <div className="flex flex-col items-center gap-4">
        <Avatar emoji={me.avatar} size={AVATAR_SIZE.HUGE} className="animate-bob" />
        <h1 className="animate-pop-in text-[44px]">You’re in, {me.name}!</h1>
        <p className="font-display text-[22px] font-bold">See your name on the big screen?</p>
        <p className="animate-wiggle rounded-full border-3 border-ink bg-sun px-5 py-2 font-display text-[18px] font-extrabold text-ink shadow-pop-sm">
          Waiting for the host to start…
        </p>
      </div>

      <ul className="flex flex-wrap justify-center gap-2">
        <Repeat each={room.facts}>
          {(fact) => (
            <li key={fact.label} className="rounded-full border-2 border-white/40 bg-white/15 px-3 py-1 text-[13px] font-extrabold">
              {fact.value}
            </li>
          )}
        </Repeat>
      </ul>

      <ReactionBar />
    </div>
  );
}
