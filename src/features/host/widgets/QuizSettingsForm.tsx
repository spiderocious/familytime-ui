import type { ReactNode } from 'react';

import { InfinityIcon } from '@icons';
import { DIFFICULTY, PACING, type Difficulty, type Pacing, type QuizConfig, type QuizOptions } from '@shared/types/quiz';
import { Segmented } from '@shared/ui/Segmented';
import { Stepper } from '@shared/ui/Stepper';
import { Toggle } from '@shared/ui/Toggle';

import { CategoryPicker } from './CategoryPicker';

interface QuizSettingsFormProps {
  options: QuizOptions;
  value: QuizConfig;
  onChange: (value: QuizConfig) => void;
}

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  [DIFFICULTY.EASY]: '🐣 Easy',
  [DIFFICULTY.MEDIUM]: '🤓 Medium',
  [DIFFICULTY.HARD]: '🧨 Hard',
  [DIFFICULTY.MIXED]: '🎲 Mixed',
};

const PACING_LABEL: Record<Pacing, string> = {
  [PACING.AUTO]: '⏱️ Moves on its own',
  [PACING.HOST]: '👆 I press Next',
};

interface SectionProps {
  step: number;
  title: string;
  hint: string;
  children: ReactNode;
}

function Section({ step, title, hint, children }: SectionProps) {
  return (
    <section className="flex flex-col gap-3">
      <header className="flex items-center gap-3">
        <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-3 border-ink bg-sun font-display text-[18px] font-extrabold">
          {step}
        </span>
        <div>
          <h3 className="font-display text-[24px] font-extrabold leading-none">{title}</h3>
          <p className="text-[14px] font-semibold text-ink-3">{hint}</p>
        </div>
      </header>
      {children}
    </section>
  );
}

/**
 * Every quiz setting. Used on the setup screen before a room exists, and again
 * in the lobby to change settings between games — one form, two places.
 */
export function QuizSettingsForm({ options, value, onChange }: QuizSettingsFormProps) {
  const set = <K extends keyof QuizConfig>(key: K, next: QuizConfig[K]): void => onChange({ ...value, [key]: next });

  return (
    <div className="flex flex-col gap-8 text-ink">
      <Section step={1} title="How hard?" hint="Mixed keeps everyone in the game.">
        <Segmented
          label="Difficulty"
          value={value.difficulty}
          options={options.difficulties.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] }))}
          onChange={(difficulty) => set('difficulty', difficulty)}
        />
      </Section>

      <Section step={2} title="What about?" hint="Pick as many as you like, or let it surprise you.">
        <CategoryPicker
          categories={options.categories}
          difficulty={value.difficulty}
          selected={value.categories}
          onChange={(categories) => set('categories', categories)}
        />
      </Section>

      <Section step={3} title="How long?" hint="Rounds give everyone a breather and a scoreboard.">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-2 rounded-btn border-3 border-ink bg-canvas-tint p-4">
            <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-3">Rounds</span>
            <Stepper
              label="rounds"
              value={value.rounds}
              min={options.rounds.min}
              max={options.rounds.max}
              disabled={value.endless}
              onChange={(rounds) => set('rounds', rounds)}
            />
          </div>
          <div className="flex flex-col items-center gap-2 rounded-btn border-3 border-ink bg-canvas-tint p-4">
            <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-3">Questions per round</span>
            <Stepper
              label="questions per round"
              value={value.questions_per_round}
              min={options.questions_per_round.min}
              max={options.questions_per_round.max}
              onChange={(count) => set('questions_per_round', count)}
            />
          </div>
        </div>
        <label className="flex items-center justify-between gap-4 rounded-btn border-3 border-ink bg-berry-soft p-4">
          <span className="flex items-center gap-3">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border-3 border-ink bg-berry text-white">
              <InfinityIcon size={24} strokeWidth={3} aria-hidden="true" />
            </span>
            <span>
              <span className="block font-display text-[20px] font-extrabold leading-tight">Endless</span>
              <span className="block text-[14px] font-semibold text-ink-3">Keep going, round after round, until you end it.</span>
            </span>
          </span>
          <Toggle label="Endless game" checked={value.endless} onChange={(endless) => set('endless', endless)} />
        </label>
      </Section>

      <Section step={4} title="How fast?" hint="Seconds on the clock for each question.">
        <Segmented
          label="Seconds per question"
          value={value.seconds_per_question}
          options={options.seconds_choices.map((seconds) => ({ value: seconds, label: `${seconds}s` }))}
          onChange={(seconds) => set('seconds_per_question', seconds)}
        />
      </Section>

      <Section step={5} title="Who moves it along?" hint="Press Next yourself if you like to chat about the answers.">
        <Segmented
          label="Pacing"
          value={value.pacing}
          options={options.pacings.map((p) => ({ value: p, label: PACING_LABEL[p] }))}
          onChange={(pacing) => set('pacing', pacing)}
        />
      </Section>
    </div>
  );
}
