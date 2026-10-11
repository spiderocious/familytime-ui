import { Show } from 'meemaw';
import { useEffect } from 'react';


import { confettiBurst } from '@shared/services/confetti';
import type { QuizView } from '@shared/types/quiz';
import { Avatar, AVATAR_SIZE } from '@shared/ui/Avatar';
import { Card } from '@shared/ui/Card';
import { BOARD_SIZE, Leaderboard } from '@shared/ui/Leaderboard';
import { Pill, PILL_TONE } from '@shared/ui/Pill';

interface RoundEndStageProps {
  game: QuizView;
}

const ROWS_SHOWN = 5;

/** The end of a round: who won THIS round, beside where everyone stands overall. */
export function RoundEndStage({ game }: RoundEndStageProps) {
  useEffect(() => {
    confettiBurst();
  }, []);

  const roundWinner = [...game.board].sort((a, b) => b.round_score - a.round_score || a.rank - b.rank)[0];
  const last = game.total_rounds !== 0 && game.round >= game.total_rounds;

  return (
    <div className="grid min-h-0 flex-1 items-center gap-8 px-[clamp(16px,2.4vw,40px)] pb-28 pt-4 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
      <div className="flex flex-col items-center gap-5 text-center">
        <h1 className="animate-drop-in text-[clamp(44px,6vw,100px)]">Round {game.round} done!</h1>
        <Show when={roundWinner !== undefined && roundWinner.round_score > 0}>
          <Card big className="flex animate-pop-in flex-col items-center gap-3 px-8 py-6 text-ink">
            <Pill tone={PILL_TONE.ACCENT}>Round winner</Pill>
            <Avatar emoji={roundWinner?.avatar ?? ''} size={AVATAR_SIZE.HUGE} className="animate-bob" />
            <p className="font-display text-[clamp(32px,3.6vw,60px)] font-extrabold leading-none">{roundWinner?.name}</p>
            <p className="font-display text-[clamp(20px,2vw,32px)] font-extrabold text-action-deep">
              +{(roundWinner?.round_score ?? 0).toLocaleString()} this round
            </p>
          </Card>
        </Show>
        <p className="font-display text-[clamp(18px,1.8vw,28px)] font-bold">
          <Show when={last} fallback={`Round ${game.round + 1} is next…`}>
            That was the last round. Final scores next!
          </Show>
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="font-display text-[clamp(26px,2.6vw,42px)] font-extrabold">Overall</h2>
        <Leaderboard rows={game.board} size={BOARD_SIZE.SCREEN} limit={ROWS_SHOWN} />
      </div>
    </div>
  );
}
