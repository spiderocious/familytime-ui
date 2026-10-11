import { Show } from 'meemaw';

import { QUIZ_PHASE, type QuizView } from '@shared/types/quiz';
import { BOARD_SIZE, Leaderboard } from '@shared/ui/Leaderboard';

import { ordinal } from '../../helpers/ordinal';

import { ReactionBar } from './ReactionBar';

interface PlayerStandingProps {
  game: QuizView;
  myId: string;
}

const ROWS_SHOWN = 5;
const FIRST = 1;

/** Between questions and between rounds: where you stand. */
export function PlayerStanding({ game, myId }: PlayerStandingProps) {
  const rank = game.you?.rank ?? FIRST;
  const roundOver = game.phase === QUIZ_PHASE.ROUND_END;

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 pb-6 pt-4">
      <div className="text-center">
        <Show when={roundOver}>
          <p className="font-display text-[20px] font-extrabold">Round {game.round} done!</p>
        </Show>
        <h1 className="animate-pop-in text-[52px]">
          <Show when={rank === FIRST} fallback={`You’re ${ordinal(rank)}`}>
            👑 You’re winning!
          </Show>
        </h1>
      </div>

      <Leaderboard rows={game.board} size={BOARD_SIZE.PHONE} highlightId={myId} showDelta limit={ROWS_SHOWN} />

      <div className="mt-auto">
        <ReactionBar />
      </div>
    </div>
  );
}
