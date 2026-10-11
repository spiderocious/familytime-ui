import { Repeat, Show } from 'meemaw';

import type { QuizFinal } from '@shared/types/quiz';
import { CountUp } from '@shared/ui/CountUp';

import { ordinal } from '../../helpers/ordinal';

import { ReactionBar } from './ReactionBar';

interface PlayerFinalProps {
  final: QuizFinal;
  myId: string;
}

const MS_PER_SECOND = 1000;
const MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };
const SCORE_ROLL_MS = 1400;

/** Your own result: place, score, your numbers, and anything you won. */
export function PlayerFinal({ final, myId }: PlayerFinalProps) {
  const mine = final.stats.find((row) => row.player_id === myId);
  const myAwards = final.awards.filter((award) => award.player_id === myId);

  if (mine === undefined) {
    return (
      <div className="flex flex-1 items-center justify-center px-6 text-center">
        <p className="font-display text-[26px] font-extrabold">That game is over. Hang on for the next one!</p>
      </div>
    );
  }

  const facts = [
    { label: 'Right', value: `${mine.correct}/${final.total_questions}` },
    { label: 'Accuracy', value: `${mine.accuracy_pct}%` },
    { label: 'Avg speed', value: mine.correct === 0 ? '—' : `${(mine.avg_ms / MS_PER_SECOND).toFixed(1)}s` },
    { label: 'Best streak', value: String(mine.best_streak) },
  ];

  return (
    <div className="flex flex-1 flex-col items-center gap-5 px-5 pb-8 pt-6 text-center">
      <p className="animate-pop-in text-[110px] leading-none" aria-hidden="true">
        {MEDALS[mine.rank] ?? '🎈'}
      </p>
      <h1 className="animate-drop-in text-[52px]">{ordinal(mine.rank)} place!</h1>
      <p className="font-display text-[44px] font-extrabold leading-none text-sun ink-stroke">
        <CountUp value={mine.score} durationMs={SCORE_ROLL_MS} /> pts
      </p>

      <dl className="grid w-full max-w-sm grid-cols-2 gap-3">
        <Repeat each={facts}>
          {(fact) => (
            <div key={fact.label} className="rounded-card border-3 border-ink bg-surface px-3 py-3 text-ink shadow-pop-sm">
              <dt className="text-[12px] font-extrabold uppercase tracking-[0.1em] text-ink-3">{fact.label}</dt>
              <dd className="font-display text-[28px] font-extrabold leading-none">{fact.value}</dd>
            </div>
          )}
        </Repeat>
      </dl>

      <Show when={myAwards.length > 0}>
        <ul className="flex flex-wrap justify-center gap-2">
          <Repeat each={myAwards}>
            {(award) => (
              <li key={award.key} className="animate-pop-in rounded-full border-3 border-ink bg-accent px-4 py-1.5 font-display text-[18px] font-extrabold text-white shadow-pop-sm">
                🏅 {award.title}
              </li>
            )}
          </Repeat>
        </ul>
      </Show>

      <p className="font-display text-[18px] font-bold opacity-90">Stay here — the host can start another game.</p>
      <div className="mt-auto">
        <ReactionBar />
      </div>
    </div>
  );
}
