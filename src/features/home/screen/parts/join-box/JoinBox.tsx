import { useState, type FormEvent } from 'react';

import { ArrowRight, Smartphone } from '@icons';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';

interface JoinBoxProps {
  onJoin: (code: string) => void;
}

const CODE_LENGTH = 5;

/** Type the code from the big screen. The name and avatar come on the next screen. */
export function JoinBox({ onJoin }: JoinBoxProps) {
  const [code, setCode] = useState('');
  const ready = code.length === CODE_LENGTH;

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (ready) onJoin(code);
  };

  return (
    <Card className="w-full p-6 text-ink">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border-3 border-ink bg-bubble text-white">
            <Smartphone size={24} strokeWidth={3} aria-hidden="true" />
          </span>
          <div>
            <h2 className="font-display text-[26px] font-extrabold leading-none">Got a code?</h2>
            <p className="text-[15px] font-semibold text-ink-3">Join the game on the big screen.</p>
          </div>
        </div>

        <label className="flex flex-col gap-2">
          <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-3">Game code</span>
          <input
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODE_LENGTH))}
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            spellCheck={false}
            placeholder="ABCDE"
            className="h-16 w-full rounded-btn border-3 border-ink bg-canvas-tint text-center font-display text-[36px] font-extrabold uppercase tracking-[0.3em] text-ink placeholder:text-ink-5"
          />
        </label>

        <Button type="submit" variant={BUTTON_VARIANT.STAGE} size={BUTTON_SIZE.LG} disabled={!ready} icon={<ArrowRight size={22} strokeWidth={3} aria-hidden="true" />}>
          Join
        </Button>
      </form>
    </Card>
  );
}
