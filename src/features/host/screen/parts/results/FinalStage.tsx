import { Repeat, Show } from 'meemaw';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { RotateCcw, Settings2, X } from '@icons';
import { PATHS } from '@shared/constants/routes';
import { CLIENT_MESSAGE } from '@shared/realtime/protocol';
import { useRoomSocket } from '@shared/realtime/room-socket-context';
import { confettiCelebration } from '@shared/services/confetti';
import type { QuizFinal } from '@shared/types/quiz';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@shared/ui/Button';

import { AwardCard } from './AwardCard';
import { Podium } from './Podium';
import { StatsTable } from './StatsTable';

interface FinalStageProps {
  final: QuizFinal;
}

/** The end: podium, awards, everyone's numbers, and what to do next. */
export function FinalStage({ final }: FinalStageProps) {
  const { send } = useRoomSocket();
  const navigate = useNavigate();

  useEffect(() => confettiCelebration(), []);

  const played = final.total_questions > 0;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-[clamp(10px,1.4vw,22px)] overflow-y-auto px-[clamp(16px,2.4vw,40px)] pb-8">
      <h1 className="animate-drop-in text-center text-[clamp(32px,4.2vw,68px)]">
        <Show when={played} fallback="Game over">
          🏆 We have a winner!
        </Show>
      </h1>

      <Show when={played} fallback={<p className="text-center font-display text-[24px] font-bold">The game ended before the first question was scored.</p>}>
        <Podium stats={final.stats} />
      </Show>

      <div className="flex flex-wrap justify-center gap-4">
        <Button size={BUTTON_SIZE.LG} icon={<RotateCcw size={24} strokeWidth={3} aria-hidden="true" />} onClick={() => send(CLIENT_MESSAGE.HOST_PLAY_AGAIN)}>
          Play again
        </Button>
        <Button
          variant={BUTTON_VARIANT.PLAIN}
          size={BUTTON_SIZE.LG}
          icon={<Settings2 size={22} strokeWidth={3} aria-hidden="true" />}
          onClick={() => send(CLIENT_MESSAGE.HOST_BACK_TO_LOBBY)}
        >
          Change settings
        </Button>
        <Button
          variant={BUTTON_VARIANT.PLAIN}
          size={BUTTON_SIZE.LG}
          icon={<X size={22} strokeWidth={3} aria-hidden="true" />}
          onClick={() => {
            send(CLIENT_MESSAGE.HOST_CLOSE_ROOM);
            navigate(PATHS.home);
          }}
        >
          Finish
        </Button>
      </div>

      <Show when={played}>

        <div className="flex flex-col gap-[clamp(10px,1.2vw,18px)]">
          <Show when={final.awards.length > 0}>
            <ul className="grid gap-3 md:grid-cols-3">
              <Repeat each={final.awards}>{(award, index) => <AwardCard key={award.key} award={award} index={index} />}</Repeat>
            </ul>
          </Show>
          <StatsTable final={final} />
        </div>
      </Show>

    </div>
  );
}
