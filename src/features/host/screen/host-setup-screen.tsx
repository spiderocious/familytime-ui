import { Show } from 'meemaw';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ArrowLeft, Clock, Play, Tv } from '@icons';
import { PATHS } from '@shared/constants/routes';
import { sessionStore } from '@shared/services/session-store';
import type { QuizConfig } from '@shared/types/quiz';
import { Button, BUTTON_SIZE } from '@shared/ui/Button';
import { Card } from '@shared/ui/Card';
import { InlineError } from '@shared/ui/InlineError';
import { LoadingScreen } from '@shared/ui/LoadingScreen';
import { MessageScreen } from '@shared/ui/MessageScreen';
import { BACKDROP, PartyBackdrop } from '@shared/ui/PartyBackdrop';
import { Pill, PILL_TONE } from '@shared/ui/Pill';

import { useCreateRoom } from '../api/use-create-room';
import { useGameOptions, type GameOptions } from '../api/use-game-options';
import { countMatching } from '../helpers/count-matching';
import { estimateMinutes } from '../helpers/estimate-minutes';
import { QuizSettingsForm } from '../widgets/QuizSettingsForm';

interface SetupProps {
  data: GameOptions;
}

function Setup({ data }: SetupProps) {
  const navigate = useNavigate();
  const createRoom = useCreateRoom();
  const [config, setConfig] = useState<QuizConfig>(data.game.default_config);

  const matching = countMatching(data.options.categories, config);
  const minutes = estimateMinutes(config);
  const totalQuestions = config.rounds * config.questions_per_round;

  const open = (): void => {
    createRoom.mutate(
      { game_id: data.game.id, config },
      {
        onSuccess: (room) => {
          // The token is what makes THIS browser the host of that room.
          sessionStore.setHostToken(room.code, room.host_token);
          navigate(PATHS.hostRoom(room.code));
        },
      },
    );
  };

  return (
    <PartyBackdrop tone={BACKDROP.CANVAS}>
      <main className="mx-auto grid min-h-screen w-full max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8">
        <div className="flex flex-col gap-5">
          <header className="flex flex-wrap items-center gap-4">
            <Link
              to={PATHS.home}
              aria-label="Back to the games"
              className="inline-flex h-12 w-12 items-center justify-center rounded-full border-3 border-ink bg-surface text-ink shadow-pop-sm transition-transform active:translate-y-1 active:shadow-none"
            >
              <ArrowLeft size={22} strokeWidth={3} aria-hidden="true" />
            </Link>
            <span className="inline-flex h-16 w-16 animate-pop-in items-center justify-center rounded-[20px] border-3 border-ink bg-sun text-[38px] leading-none" aria-hidden="true">
              {data.game.emoji}
            </span>
            <div>
              <h1 className="text-[clamp(34px,5vw,54px)]">{data.game.title}</h1>
              <p className="text-[17px] font-bold text-ink-3">Set it up, then open the room for everyone to join.</p>
            </div>
          </header>

          <Card big className="animate-slide-up p-6 md:p-8">
            <QuizSettingsForm options={data.options} value={config} onChange={setConfig} />
          </Card>
        </div>

        <aside className="lg:sticky lg:top-8 lg:self-start">
          <Card big className="flex animate-pop-in flex-col gap-5 bg-stage p-6 text-white">
            <Pill tone={PILL_TONE.SUN}>
              <Tv size={14} strokeWidth={3} aria-hidden="true" />
              Your game
            </Pill>

            <div>
              <p className="font-display text-[64px] font-extrabold leading-none">
                <Show when={!config.endless} fallback="∞">
                  {totalQuestions}
                </Show>
              </p>
              <p className="font-display text-[22px] font-bold">
                <Show when={!config.endless} fallback="questions, until you stop">
                  questions in {config.rounds} {config.rounds === 1 ? 'round' : 'rounds'}
                </Show>
              </p>
            </div>

            <Show when={minutes !== null}>
              <p className="flex items-center gap-2 text-[18px] font-extrabold">
                <Clock size={20} strokeWidth={3} aria-hidden="true" />
                About {minutes} {minutes === 1 ? 'minute' : 'minutes'}
              </p>
            </Show>

            <p className="rounded-btn border-2 border-white/40 bg-white/10 p-3 text-[15px] font-bold">
              Drawing from <span className="font-display text-[20px] font-extrabold">{matching.toLocaleString()}</span> questions that match.
            </p>

            <Show when={matching === 0}>
              <InlineError message="No questions match those choices. Add a topic or change the difficulty." />
            </Show>
            <Show when={createRoom.isError}>
              <InlineError message={createRoom.error?.message ?? ''} />
            </Show>

            <Button
              size={BUTTON_SIZE.XL}
              disabled={matching === 0 || createRoom.isPending}
              onClick={open}
              icon={<Play size={26} strokeWidth={3} fill="currentColor" aria-hidden="true" />}
            >
              <Show when={!createRoom.isPending} fallback="Opening…">
                Open the room
              </Show>
            </Button>
          </Card>
        </aside>
      </main>
    </PartyBackdrop>
  );
}

/** Configure a game on the big screen before anyone joins. */
export default function HostSetupScreen() {
  const { gameId = '' } = useParams();
  const options = useGameOptions(gameId);

  if (options.isPending) {
    return <LoadingScreen label="Getting the game ready…" />;
  }
  if (options.isError) {
    return (
      <MessageScreen
        emoji="🤷"
        title="Can't set that up"
        message={options.error.message}
        action={
          <Link to={PATHS.home} className="font-display text-[20px] font-extrabold text-stage underline">
            Back to the games
          </Link>
        }
      />
    );
  }
  return <Setup data={options.data} />;
}
