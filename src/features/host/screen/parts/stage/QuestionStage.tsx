import { Repeat, Show } from 'meemaw';

import { Zap } from '@icons';
import { useCountdown } from '@shared/realtime/use-countdown';
import { QUIZ_PHASE, type QuizQuestion, type QuizView } from '@shared/types/quiz';
import { Pill, PILL_TONE } from '@shared/ui/Pill';
import { TimerBar } from '@shared/ui/TimerBar';

import { AnsweredStrip } from './AnsweredStrip';
import { AnswerTile } from './AnswerTile';

interface QuestionStageProps {
  game: QuizView;
  question: QuizQuestion;
}

const MS_PER_SECOND = 1000;

/**
 * The question, and then its reveal. One component for both phases on purpose:
 * the tiles stay exactly where they were and the right one lights up in place,
 * which reads far better across a room than swapping to a new screen.
 */
export function QuestionStage({ game, question }: QuestionStageProps) {
  const revealed = game.phase === QUIZ_PHASE.REVEAL && game.reveal !== null;
  const countdown = useCountdown(revealed ? 0 : game.deadline, game.phase_started_at);
  const reveal = game.reveal;
  const fastest = reveal?.fastest ?? null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[clamp(10px,1.4vw,22px)] px-[clamp(16px,2.4vw,40px)] pb-[clamp(72px,7vw,104px)] pt-[clamp(8px,1vw,16px)]">
      <div className="flex flex-wrap items-center gap-3">
        <Pill tone={PILL_TONE.SUN} className="text-[clamp(13px,1.1vw,18px)]">
          <span aria-hidden="true">{question.category_emoji}</span>
          {question.category_label}
        </Pill>
        <Pill tone={PILL_TONE.GHOST} className="text-[clamp(13px,1.1vw,18px)]">
          {question.difficulty}
        </Pill>
      </div>

      <div className="flex h-16 items-center">
        <Show
          when={revealed}
          fallback={
            <Show when={countdown.running}>
              <TimerBar fraction={countdown.fraction} secondsLeft={countdown.secondsLeft} className="w-full" />
            </Show>
          }
        >
          <p className="flex animate-pop-in items-center gap-3 rounded-full border-3 border-ink bg-sun px-5 py-2 font-display text-[clamp(18px,2vw,32px)] font-extrabold text-ink shadow-pop-sm">
            <Zap className="h-[1em] w-[1em]" strokeWidth={3} fill="currentColor" aria-hidden="true" />
            <Show when={fastest !== null} fallback="Nobody got that one!">
              Fastest: {fastest?.avatar} {fastest?.name} in {((fastest?.ms ?? 0) / MS_PER_SECOND).toFixed(1)}s
            </Show>
          </p>
        </Show>
      </div>

      <div
        key={game.question_seq}
        className="flex min-h-[22vh] flex-1 animate-drop-in items-center justify-center rounded-stage border-3 border-ink bg-surface px-[clamp(16px,3vw,56px)] py-[clamp(12px,2vw,32px)] text-center text-ink shadow-pop-lg"
      >
        <h1 className="text-balance font-display text-[clamp(26px,4.3vw,76px)] font-extrabold leading-[1.05]">{question.prompt}</h1>
      </div>

      <div key={`answers-${game.question_seq}`} className="grid grid-cols-1 gap-[clamp(10px,1.4vw,22px)] md:grid-cols-2">
        <Repeat each={question.options}>
          {(option, index) => (
            <AnswerTile
              key={option}
              index={index}
              text={option}
              revealed={revealed}
              correct={reveal?.answer_idx === index}
              count={reveal?.counts[index] ?? 0}
            />
          )}
        </Repeat>
      </div>

      <AnsweredStrip board={game.board} answeredIds={game.answered_ids} revealed={revealed} />
    </div>
  );
}
