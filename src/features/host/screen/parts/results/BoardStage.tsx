import type { QuizView } from '@shared/types/quiz';
import { BOARD_SIZE, Leaderboard } from '@shared/ui/Leaderboard';

interface BoardStageProps {
  game: QuizView;
}

const ROWS_SHOWN = 7;

/** The scoreboard between questions. Rows climb past each other as ranks change. */
export function BoardStage({ game }: BoardStageProps) {
  return (
    <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-6 pb-28 pt-4">
      <h1 className="animate-drop-in text-center text-[clamp(48px,7vw,112px)]">Scoreboard</h1>
      <Leaderboard rows={game.board} size={BOARD_SIZE.SCREEN} showDelta limit={ROWS_SHOWN} />
    </div>
  );
}
