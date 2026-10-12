import { Show } from 'meemaw';
import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { CategoryPicker, countMatching, useGameOptions } from '@features/host';
import { ArrowLeft, Play, Zap } from '@icons';
import { GAME_ID } from '@shared/constants/game-ids';
import { PATHS } from '@shared/constants/routes';
import { sessionStore } from '@shared/services/session-store';
import { DIFFICULTY, PACING, type Difficulty, type QuizConfig } from '@shared/types/quiz';
import { Button, BUTTON_SIZE } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { InlineError } from '@shared/ui/InlineError';
import { LoadingScreen } from '@shared/ui/LoadingScreen';
import { MessageScreen } from '@shared/ui/MessageScreen';
import { BACKDROP, PartyBackdrop } from '@shared/ui/PartyBackdrop';
import { Segmented } from '@shared/ui/Segmented';

import { useStartSolo } from '../api/use-start-solo';
import { formatMultiplier, multiplierPct } from '../helpers/multiplier';

const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  [DIFFICULTY.EASY]: '🐣 Easy',
  [DIFFICULTY.MEDIUM]: '🤓 Medium',
  [DIFFICULTY.HARD]: '🧨 Hard',
  [DIFFICULTY.MIXED]: '🎲 Mixed',
};
const MAX_NAME_LENGTH = 16;
// A solo run is always this long, so every score is out of the same number.
const SOLO_QUESTIONS = 10;

/**
 * Three choices, then play: how hard, what about, how fast. The run itself is
 * a fixed ten questions, which is what makes one score comparable with another.
 */
export default function SoloSetupScreen() {
  const navigate = useNavigate();
  const options = useGameOptions(GAME_ID.QUIZ);
  const start = useStartSolo();
  const [difficulty, setDifficulty] = useState<Difficulty>(DIFFICULTY.MIXED);
  const [categories, setCategories] = useState<string[]>([]);
  const [seconds, setSeconds] = useState(15);
  const [name, setName] = useState(() => sessionStore.lastName());

  if (options.isPending) return <LoadingScreen label="Getting the questions ready…" />;
  if (options.isError) {
    return <MessageScreen emoji="🤷" title="Can’t load that" message={options.error.message} action={<Link to={PATHS.home} className="font-display text-[20px] font-extrabold text-stage underline">Back</Link>} />;
  }

  const config: QuizConfig = {
    difficulty,
    categories,
    seconds_per_question: seconds,
    rounds: 1,
    questions_per_round: SOLO_QUESTIONS,
    endless: false,
    pacing: PACING.AUTO,
  };
  const matching = countMatching(options.data.options.categories, config);
  const ready = matching > 0 && name.trim() !== '' && !start.isPending;
  // The server's own message for a bad name belongs under the name field.
  const nameError = start.error?.fieldErrors?.name?.[0];

  const submit = (event: FormEvent): void => {
    event.preventDefault();
    if (!ready) return;
    start.mutate(
      { config, name: name.trim() },
      {
        onSuccess: (seat) => {
          sessionStore.setSeat(seat.code, { playerId: seat.player_id, token: seat.player_token, name: seat.name, avatar: seat.avatar });
          navigate(PATHS.soloPlay(seat.code));
        },
      },
    );
  };

  return (
    <PartyBackdrop tone={BACKDROP.CANVAS}>
      <form onSubmit={submit} className="mx-auto flex min-h-[100dvh] w-full max-w-lg flex-col gap-4 px-4 pb-6 pt-4">
        <header className="flex items-center gap-3">
          <Link
            to={PATHS.home}
            aria-label="Back"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-3 border-ink bg-surface text-ink shadow-pop-sm transition-transform active:translate-y-1 active:shadow-none"
          >
            <ArrowLeft size={20} strokeWidth={3} aria-hidden="true" />
          </Link>
          <div>
            <h1 className="text-[32px]">Solo run</h1>
            <p className="text-[14px] font-bold text-ink-3">{SOLO_QUESTIONS} questions. Be right, be quick.</p>
          </div>
        </header>

        <Card className="flex flex-col gap-5 p-4">
            <label className="flex flex-col gap-1">
              <span className="text-[13px] font-extrabold uppercase tracking-[0.1em] text-ink-3">Your name</span>
              <input
                value={name}
                onChange={(event) => setName(event.target.value.slice(0, MAX_NAME_LENGTH))}
                maxLength={MAX_NAME_LENGTH}
                autoComplete="given-name"
                placeholder="e.g. Tobi"
                className="h-12 w-full rounded-btn border-3 border-ink bg-canvas-tint px-4 font-display text-[22px] font-extrabold placeholder:text-ink-5"
              />
            </label>
            <Show when={nameError !== undefined}>
              <InlineError message={nameError ?? ''} />
            </Show>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-[20px] font-extrabold">How hard?</h2>
            <Segmented
              label="Difficulty"
              value={difficulty}
              options={options.data.options.difficulties.map((d) => ({ value: d, label: DIFFICULTY_LABEL[d] }))}
              onChange={setDifficulty}
            />
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-[20px] font-extrabold">How fast?</h2>
            <Segmented
              label="Seconds per question"
              value={seconds}
              options={options.data.options.seconds_choices.map((s) => ({ value: s, label: `${s}s` }))}
              onChange={setSeconds}
            />
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="font-display text-[20px] font-extrabold">What about?</h2>
            <CategoryPicker categories={options.data.options.categories} difficulty={difficulty} selected={categories} onChange={setCategories} />
          </section>
        </Card>

        <div className="sticky bottom-3 flex flex-col gap-2">
          <p className="flex items-center justify-center gap-2 rounded-full border-3 border-ink bg-sun px-4 py-2 font-display text-[17px] font-extrabold text-ink shadow-pop-sm">
            <Zap size={18} strokeWidth={3} fill="currentColor" aria-hidden="true" />
            Points {formatMultiplier(multiplierPct(config))} — harder and faster pays more
          </p>
          <Show when={matching === 0}>
            <InlineError message="No questions match those choices. Add a topic or change the difficulty." />
          </Show>
          <Show when={start.isError && nameError === undefined}>
            <InlineError message={start.error?.message ?? ''} />
          </Show>
          <Button type="submit" size={BUTTON_SIZE.XL} disabled={!ready} icon={<Play size={26} strokeWidth={3} fill="currentColor" aria-hidden="true" />}>
            <Show when={!start.isPending} fallback="Starting…">
              Play
            </Show>
          </Button>
        </div>
      </form>
    </PartyBackdrop>
  );
}
