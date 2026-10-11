import { Repeat, Show } from 'meemaw';

import { Crown } from '@icons';
import type { QuizStatRow } from '@shared/types/quiz';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';
import { CountUp } from '@shared/ui/CountUp';
import { cn } from '@shared/utils/cn';

interface PodiumProps {
  stats: QuizStatRow[];
}

interface Step {
  place: number;
  height: string;
  plate: string;
  delay: string;
}

// Drawn second, first, third — the winner in the middle, standing tallest. The
// delays make third arrive first and the winner last.
const STEPS: Step[] = [
  { place: 2, height: 'h-[clamp(56px,9vh,110px)]', plate: 'bg-surface text-ink', delay: '700ms' },
  { place: 1, height: 'h-[clamp(84px,14vh,170px)]', plate: 'bg-sun text-ink', delay: '1400ms' },
  { place: 3, height: 'h-[clamp(40px,6vh,80px)]', plate: 'bg-accent text-white', delay: '0ms' },
];
const WINNER = 1;
const SCORE_ROLL_MS = 1600;

export function Podium({ stats }: PodiumProps) {
  const steps = STEPS.filter((step) => stats[step.place - 1] !== undefined);

  return (
    <ol className="flex items-end justify-center gap-[clamp(10px,2vw,36px)] pt-[clamp(28px,3.4vw,56px)]">
      <Repeat each={steps}>
        {(step) => {
          const player = stats[step.place - 1];
          if (player === undefined) return null;
          const winner = step.place === WINNER;

          return (
            <li key={player.player_id} style={{ animationDelay: step.delay }} className="flex w-[clamp(110px,18vw,300px)] animate-slide-up flex-col items-center gap-2">
              <span className={cn('relative', winner && 'animate-bob')}>
                <Show when={winner}>
                  <Crown
                    className="absolute -top-[0.9em] left-1/2 h-[1.2em] w-[1.2em] -translate-x-1/2 -rotate-6 text-[clamp(36px,4vw,64px)] text-sun"
                    strokeWidth={3}
                    fill="currentColor"
                    aria-hidden="true"
                  />
                </Show>
                <Avatar emoji={player.avatar} size={winner ? AVATAR_SIZE.XL : AVATAR_SIZE.LG} />
              </span>
              <p className="max-w-full truncate font-display text-[clamp(18px,2.2vw,36px)] font-extrabold leading-none">{player.name}</p>
              <CountUp value={player.score} durationMs={SCORE_ROLL_MS} className="font-display text-[clamp(18px,2vw,34px)] font-extrabold opacity-90" />
              <div
                className={cn(
                  'flex w-full origin-bottom animate-grow-bar items-start justify-center rounded-t-[24px] border-3 border-b-0 border-ink pt-3 font-display text-[clamp(26px,3vw,52px)] font-extrabold leading-none',
                  step.height,
                  step.plate,
                )}
                style={{ animationDelay: step.delay }}
              >
                {step.place}
              </div>
            </li>
          );
        }}
      </Repeat>
    </ol>
  );
}
