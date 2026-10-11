import type { QuizView } from '@shared/types/quiz';

interface PlayerIntroProps {
  game: QuizView;
}

export function PlayerIntro({ game }: PlayerIntroProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
      <p className="animate-wiggle text-[72px] leading-none" aria-hidden="true">
        👀
      </p>
      <h1 className="animate-drop-in text-[64px]">Round {game.round}</h1>
      <p className="font-display text-[24px] font-bold">Eyes up, thumbs ready!</p>
    </div>
  );
}
