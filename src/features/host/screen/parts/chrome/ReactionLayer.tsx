import { Repeat } from 'meemaw';
import { useEffect, useRef, useState } from 'react';


import { useRoomSocket } from '@shared/realtime/room-socket-context';
import { SOUND, sound } from '@shared/services/sound';

interface Floating {
  id: number;
  emoji: string;
  name: string;
  left: number;
}

const LIFETIME_MS = 2600;
const MAX_ON_SCREEN = 24;

/** Emoji sent from phones, floating up the big screen with the sender's name. */
export function ReactionLayer() {
  const { onReaction, state } = useRoomSocket();
  const [floating, setFloating] = useState<Floating[]>([]);
  const nextId = useRef(0);
  const players = useRef(state?.room.players ?? []);
  players.current = state?.room.players ?? [];

  useEffect(
    () =>
      onReaction((reaction) => {
        nextId.current += 1;
        const id = nextId.current;
        const name = players.current.find((p) => p.id === reaction.player_id)?.name ?? '';
        sound.play(SOUND.REACT);
        setFloating((current) => [...current.slice(-MAX_ON_SCREEN), { id, emoji: reaction.emoji, name, left: 6 + Math.random() * 84 }]);
        window.setTimeout(() => setFloating((current) => current.filter((f) => f.id !== id)), LIFETIME_MS);
      }),
    [onReaction],
  );

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 overflow-hidden">
      <Repeat each={floating}>
        {(item) => (
          <span key={item.id} style={{ left: `${item.left}%` }} className="absolute bottom-6 flex animate-float-up flex-col items-center">
            <span className="text-[64px] leading-none drop-shadow-lg">{item.emoji}</span>
            <span className="rounded-full border-2 border-ink bg-surface px-2 font-display text-[14px] font-extrabold text-ink">{item.name}</span>
          </span>
        )}
      </Repeat>
    </div>
  );
}
