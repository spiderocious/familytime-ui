import { Show } from 'meemaw';
import { useState } from 'react';


import { Check, X } from '@icons';
import type { QuizConfig } from '@shared/types/quiz';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { InlineError } from '@shared/ui/InlineError';

import { useGameOptions } from '../../../api/use-game-options';
import { countMatching } from '../../../helpers/count-matching';
import { QuizSettingsForm } from '../../../widgets/QuizSettingsForm';

interface SettingsDialogProps {
  gameId: string;
  config: QuizConfig;
  onSave: (config: QuizConfig) => void;
  onClose: () => void;
}

/** Change the settings from the lobby without closing the room. */
export function SettingsDialog({ gameId, config, onSave, onClose }: SettingsDialogProps) {
  const options = useGameOptions(gameId);
  const [draft, setDraft] = useState<QuizConfig>(config);
  const matching = options.data === undefined ? 0 : countMatching(options.data.options.categories, draft);

  return (
    <div role="dialog" aria-modal="true" aria-labelledby="settings-title" className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-4 backdrop-blur-sm">
      <Card big className="flex max-h-[92vh] w-full max-w-4xl animate-pop-in flex-col text-ink">
        <header className="flex items-center justify-between gap-4 border-b-3 border-ink px-6 py-4">
          <h2 id="settings-title" className="text-[32px]">
            Game settings
          </h2>
          <button
            type="button"
            aria-label="Close settings"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border-3 border-ink bg-surface shadow-pop-sm transition-transform active:translate-y-1 active:shadow-none"
          >
            <X size={20} strokeWidth={3} aria-hidden="true" />
          </button>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto p-6">
          <Show when={options.isPending}>
            <p role="status" className="text-[18px] font-bold">
              Loading the settings…
            </p>
          </Show>
          <Show when={options.isError}>
            <InlineError message={options.error?.message ?? ''} />
          </Show>
          <Show when={options.data !== undefined}>
            {options.data === undefined ? null : <QuizSettingsForm options={options.data.options} value={draft} onChange={setDraft} />}
          </Show>
        </div>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t-3 border-ink px-6 py-4">
          <p className="text-[16px] font-bold text-ink-3">{matching.toLocaleString()} questions match</p>
          <div className="flex gap-3">
            <Button variant={BUTTON_VARIANT.PLAIN} onClick={onClose}>
              Cancel
            </Button>
            <Button
              size={BUTTON_SIZE.MD}
              disabled={matching === 0}
              icon={<Check size={20} strokeWidth={3} aria-hidden="true" />}
              onClick={() => {
                onSave(draft);
                onClose();
              }}
            >
              Save settings
            </Button>
          </div>
        </footer>
      </Card>
    </div>
  );
}
