import { Repeat } from 'meemaw';

import type { QuizFinal } from '@shared/types/quiz';

interface StatsTableProps {
  final: QuizFinal;
}

const MS_PER_SECOND = 1000;

function speed(ms: number, correct: number): string {
  // An average only exists for someone who got at least one right.
  return correct === 0 ? '—' : `${(ms / MS_PER_SECOND).toFixed(1)}s`;
}

/** Everyone's numbers for the whole game. */
export function StatsTable({ final }: StatsTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border-3 border-ink bg-surface text-ink shadow-pop-sm">
      <table className="w-full text-left">
        <caption className="sr-only">Final results for every player</caption>
        <thead>
          <tr className="border-b-3 border-ink bg-canvas-tint text-[13px] font-extrabold uppercase tracking-[0.08em] text-ink-3">
            <th scope="col" className="px-4 py-2">#</th>
            <th scope="col" className="px-2 py-2">Player</th>
            <th scope="col" className="px-2 py-2 text-right">Score</th>
            <th scope="col" className="px-2 py-2 text-right">Right</th>
            <th scope="col" className="px-2 py-2 text-right">Accuracy</th>
            <th scope="col" className="px-2 py-2 text-right">Avg speed</th>
            <th scope="col" className="px-4 py-2 text-right">Best streak</th>
          </tr>
        </thead>
        <tbody className="font-display text-[clamp(16px,1.5vw,22px)] font-extrabold">
          <Repeat each={final.stats}>
            {(row) => (
              <tr key={row.player_id} className="border-b-2 border-ink-5 last:border-b-0">
                <td className="px-4 py-2">{row.rank}</td>
                <td className="px-2 py-2">
                  <span aria-hidden="true">{row.avatar}</span> {row.name}
                </td>
                <td className="px-2 py-2 text-right">{row.score.toLocaleString()}</td>
                <td className="px-2 py-2 text-right">
                  {row.correct}/{final.total_questions}
                </td>
                <td className="px-2 py-2 text-right">{row.accuracy_pct}%</td>
                <td className="px-2 py-2 text-right">{speed(row.avg_ms, row.correct)}</td>
                <td className="px-4 py-2 text-right">{row.best_streak}</td>
              </tr>
            )}
          </Repeat>
        </tbody>
      </table>
    </div>
  );
}
