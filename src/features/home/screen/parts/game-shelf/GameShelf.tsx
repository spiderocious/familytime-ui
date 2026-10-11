import { Repeat, Show } from 'meemaw';

import { Loader2 } from '@icons';
import { InlineError } from '@shared/ui/InlineError';

import { useGames } from '../../../api/use-games';

import { ComingSoonTile } from './ComingSoonTile';
import { GameTile } from './GameTile';

interface GameShelfProps {
  onPlay: (gameId: string) => void;
}

const COMING_SOON = [
  { emoji: '🕵️', title: 'Who Knows Who' },
  { emoji: '🎲', title: 'More on the way' },
];

export function GameShelf({ onPlay }: GameShelfProps) {
  const games = useGames();

  return (
    <section aria-labelledby="shelf-title" className="w-full">
      <h2 id="shelf-title" className="mb-4 font-display text-[26px] font-extrabold">
        Pick a game
      </h2>

      <Show when={games.isPending}>
        <p role="status" className="flex items-center gap-3 text-[18px] font-bold">
          <Loader2 size={22} strokeWidth={3} className="animate-spin" aria-hidden="true" />
          Fetching the games…
        </p>
      </Show>

      <Show when={games.isError}>
        <InlineError message={games.error?.message ?? ''} />
      </Show>

      <Show when={games.isSuccess}>
        <div className="grid gap-5 md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
          <div className="grid gap-5">
            <Repeat each={games.data ?? []}>{(game) => <GameTile key={game.id} game={game} onPlay={onPlay} />}</Repeat>
            <Show when={(games.data ?? []).length === 0}>
              <p className="rounded-card border-3 border-dashed border-white/50 p-6 text-[18px] font-bold">
                No games are available right now.
              </p>
            </Show>
          </div>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
            <Repeat each={COMING_SOON}>{(soon) => <ComingSoonTile key={soon.title} emoji={soon.emoji} title={soon.title} />}</Repeat>
          </div>
        </div>
      </Show>
    </section>
  );
}
