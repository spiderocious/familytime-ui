import { Show } from 'meemaw';

import { Check } from '@icons';
import { answerStyle } from '@shared/ui/answers';
import { cn } from '@shared/utils/cn';

interface AnswerTileProps {
  index: number;
  text: string;
  /** Set once the answer is revealed. */
  revealed: boolean;
  correct: boolean;
  /** How many players chose this one. Shown at the reveal. */
  count: number;
}

/**
 * One of the four answers on the big screen. At the reveal the right one grows
 * and wobbles, and the wrong ones step back.
 */
export function AnswerTile({ index, text, revealed, correct, count }: AnswerTileProps) {
  const style = answerStyle(index);
  const Shape = style.shape;

  return (
    <div
      style={{ ['--i' as string]: index }}
      className={cn(
        'stagger relative flex animate-pop-in items-center gap-[clamp(10px,1.4vw,24px)] rounded-card border-3 border-ink px-[clamp(12px,1.6vw,28px)] py-[clamp(10px,1.4vw,24px)] shadow-pop transition-all duration-500',
        style.bg,
        style.text,
        revealed && !correct && 'scale-[0.96] opacity-35 saturate-50',
        revealed && correct && 'z-10 scale-[1.03] animate-jelly ring-[6px] ring-white',
      )}
    >
      <span className="inline-flex h-[clamp(40px,4.4vw,76px)] w-[clamp(40px,4.4vw,76px)] shrink-0 items-center justify-center rounded-2xl border-3 border-ink bg-white/25">
        <Shape className="h-[55%] w-[55%]" strokeWidth={3} fill="currentColor" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1 font-display text-[clamp(20px,2.7vw,46px)] font-extrabold leading-[1.05]">
        <span className="sr-only">{style.letter}: </span>
        {text}
      </span>

      <Show when={revealed}>
        <span className="inline-flex shrink-0 animate-pop-in items-center gap-2 rounded-full border-3 border-ink bg-surface px-3 py-1 font-display text-[clamp(18px,2vw,34px)] font-extrabold text-ink">
          <Show when={correct}>
            <Check className="h-[1em] w-[1em] text-action-deep" strokeWidth={4} aria-label="Correct answer" />
          </Show>
          {count}
        </span>
      </Show>
    </div>
  );
}
