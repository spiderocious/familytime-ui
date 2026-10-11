import { Show } from 'meemaw';

import { Maximize, Users } from '@icons';
import type { RoomView } from '@shared/realtime/protocol';
import type { QuizView } from '@shared/types/quiz';
import { Logo, LOGO_SIZE } from '@shared/ui/Logo';
import { SoundToggle } from '@shared/ui/SoundToggle';

import { useFullscreen } from '../../../utils/use-fullscreen';

interface HostTopBarProps {
  room: RoomView;
  game: QuizView | null;
}

function progressLabel(game: QuizView): string {
  const round = game.total_rounds === 0 ? `Round ${game.round}` : `Round ${game.round} of ${game.total_rounds}`;
  if (game.question_in_round === 0) return round;
  return `${round} · Question ${game.question_in_round} of ${game.questions_per_round}`;
}

/** Always on screen during a game: the code (latecomers can still join), where we are, and the screen controls. */
export function HostTopBar({ room, game }: HostTopBarProps) {
  const fullscreen = useFullscreen();

  return (
    <header className="flex items-center justify-between gap-4 px-[clamp(16px,2.4vw,40px)] pt-[clamp(12px,1.6vw,24px)]">
      <div className="flex items-center gap-4">
        <Logo size={LOGO_SIZE.SM} />
        <span className="hidden items-center gap-2 rounded-full border-3 border-ink bg-surface px-4 py-1.5 font-display text-[20px] font-extrabold text-ink shadow-pop-sm sm:inline-flex">
          <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-3">Join</span>
          <span className="tracking-[0.18em]">{room.code}</span>
        </span>
      </div>

      <Show when={game !== null}>
        <p className="hidden rounded-full border-2 border-white/40 bg-white/15 px-5 py-1.5 font-display text-[clamp(16px,1.5vw,24px)] font-extrabold md:block">
          {game === null ? '' : progressLabel(game)}
        </p>
      </Show>

      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-2 rounded-full border-3 border-ink bg-sun px-4 py-1.5 font-display text-[20px] font-extrabold text-ink shadow-pop-sm">
          <Users size={20} strokeWidth={3} aria-hidden="true" />
          {room.players.length}
        </span>
        <SoundToggle />
        <button
          type="button"
          aria-label={fullscreen.active ? 'Leave fullscreen' : 'Go fullscreen'}
          aria-pressed={fullscreen.active}
          onClick={fullscreen.toggle}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border-3 border-ink bg-surface text-ink shadow-pop-sm transition-transform active:translate-y-1 active:shadow-none"
        >
          <Maximize size={20} strokeWidth={3} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
