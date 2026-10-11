import { Play, Users } from '@icons';
import { SOUND, sound } from '@shared/services/sound';

import type { GameSummary } from '../../../api/use-games';

interface GameTileProps {
  game: GameSummary;
  onPlay: (gameId: string) => void;
}

export function GameTile({ game, onPlay }: GameTileProps) {
  return (
    <button
      type="button"
      onClick={() => {
        sound.play(SOUND.TAP);
        onPlay(game.id);
      }}
      className="group flex w-full animate-pop-in flex-col items-start gap-3 rounded-card border-3 border-ink bg-surface p-6 text-left text-ink shadow-pop-lg transition-transform hover:-translate-y-1 hover:rotate-[-1deg] active:translate-y-[10px] active:shadow-none"
    >
      <span className="flex w-full items-start justify-between">
        <span className="inline-flex h-20 w-20 items-center justify-center rounded-[24px] border-3 border-ink bg-sun text-[48px] leading-none transition-transform group-hover:animate-jelly" aria-hidden="true">
          {game.emoji}
        </span>
        <span className="rounded-full border-2 border-ink bg-action px-3 py-1 font-sans text-[12px] font-extrabold uppercase tracking-[0.1em] text-white">
          Ready to play
        </span>
      </span>
      <span className="font-display text-[34px] font-extrabold leading-none">{game.title}</span>
      <span className="text-[16px] font-semibold text-ink-3">{game.tagline}</span>
      <span className="mt-1 flex w-full items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-[14px] font-extrabold text-ink-3">
          <Users size={16} strokeWidth={3} aria-hidden="true" />
          {game.min_players}–{game.max_players} players
        </span>
        <span className="inline-flex items-center gap-2 rounded-btn border-3 border-ink bg-stage px-4 py-2 font-display text-[18px] font-extrabold text-white">
          <Play size={18} strokeWidth={3} fill="currentColor" aria-hidden="true" />
          Host this
        </span>
      </span>
    </button>
  );
}
