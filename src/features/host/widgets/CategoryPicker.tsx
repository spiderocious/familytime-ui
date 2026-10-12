import { Repeat } from 'meemaw';

import { Shuffle } from '@icons';
import { SOUND, sound } from '@shared/services/sound';
import type { QuizCategoryOption, QuizConfig } from '@shared/types/quiz';
import { cn } from '@shared/utils/cn';

import { countForCategory } from '../helpers/count-matching';

interface CategoryPickerProps {
  categories: QuizCategoryOption[];
  difficulty: QuizConfig['difficulty'];
  selected: string[];
  onChange: (selected: string[]) => void;
}

const chipClass =
  'flex items-center gap-3 rounded-btn border-3 border-ink px-3 py-2.5 text-left transition-transform disabled:pointer-events-none disabled:opacity-35';

/**
 * Pick topics, or pick none and get everything shuffled together. "Surprise
 * me" is not a separate mode — it is simply the empty selection.
 */
export function CategoryPicker({ categories, difficulty, selected, onChange }: CategoryPickerProps) {
  const everything = selected.length === 0;

  const toggle = (slug: string): void => {
    sound.play(SOUND.TAP);
    onChange(selected.includes(slug) ? selected.filter((s) => s !== slug) : [...selected, slug]);
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <button
        type="button"
        aria-pressed={everything}
        onClick={() => {
          sound.play(SOUND.TAP);
          onChange([]);
        }}
        className={cn(chipClass, everything ? 'translate-y-1 bg-stage text-white' : 'bg-surface text-ink shadow-pop-sm')}
      >
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-3 border-ink bg-sun text-ink">
          <Shuffle size={22} strokeWidth={3} aria-hidden="true" />
        </span>
        <span className="min-w-0">
          <span className="block font-display text-[19px] font-extrabold leading-tight">Surprise me</span>
          <span className={cn('block text-[13px] font-bold', everything ? 'text-white/80' : 'text-ink-3')}>Everything, shuffled</span>
        </span>
      </button>

      <Repeat each={categories}>
        {(category) => {
          const on = selected.includes(category.slug);
          const count = countForCategory(category, difficulty);
          return (
            <button
              key={category.slug}
              type="button"
              aria-pressed={on}
              disabled={count === 0}
              onClick={() => toggle(category.slug)}
              className={cn(chipClass, on ? 'translate-y-1 bg-action text-white' : 'bg-surface text-ink shadow-pop-sm')}
            >
              <span
                className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-3 border-ink bg-canvas-tint text-[24px] leading-none"
                aria-hidden="true"
              >
                {category.emoji}
              </span>
              <span className="min-w-0">
                <span className="block truncate font-display text-[19px] font-extrabold leading-tight">{category.label}</span>
              </span>
            </button>
          );
        }}
      </Repeat>
    </div>
  );
}
