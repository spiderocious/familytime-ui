import { Show } from 'meemaw';

import { useCountdown } from '@shared/realtime/use-countdown';
import type { QuizView } from '@shared/types/quiz';

interface IntroStageProps {
  game: QuizView;
}

const COUNT_FROM = 3;
const FIRST_ROUND = 1;

/** "Round 2 — get ready", then 3, 2, 1. Each number is a fresh element so it pops in. */
export function IntroStage({ game }: IntroStageProps) {
  const { secondsLeft } = useCountdown(game.deadline, game.phase_started_at);
  const counting = secondsLeft <= COUNT_FROM && secondsLeft > 0;

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 text-center">
      <p className="animate-slide-up rounded-full border-3 border-ink bg-sun px-6 py-2 font-display text-[clamp(20px,2.2vw,36px)] font-extrabold text-ink shadow-pop-sm">
        <Show when={game.round === FIRST_ROUND} fallback="Phones ready?">
          Here we go!
        </Show>
      </p>
      <h1 className="animate-drop-in text-[clamp(72px,13vw,220px)] ink-stroke text-sun">Round {game.round}</h1>
      <p className="font-display text-[clamp(22px,2.6vw,42px)] font-bold">
        {game.questions_per_round} questions · fastest right answer scores most
      </p>
      <div className="flex h-[clamp(96px,12vw,200px)] items-center justify-center">
        <Show when={counting}>
          <span key={secondsLeft} className="animate-count-pop font-display text-[clamp(96px,12vw,200px)] font-extrabold leading-none">
            {secondsLeft}
          </span>
        </Show>
      </div>
    </div>
  );
}
