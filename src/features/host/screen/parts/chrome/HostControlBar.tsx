import { Show } from 'meemaw';
import { useEffect, useState } from 'react';


import { SkipForward, X } from '@icons';
import { useRoomSocket } from '@shared/realtime/room-socket-context';
import { PACING, QUIZ_ACTION, QUIZ_PHASE, type QuizView } from '@shared/types/quiz';
import { Button, BUTTON_SIZE, BUTTON_VARIANT } from '@shared/ui/Button';
import { cn } from '@shared/utils/cn';

interface HostControlBarProps {
  game: QuizView;
}

const CONFIRM_WINDOW_MS = 4000;

/**
 * The host's two controls during play. Next always works — it skips a question
 * or moves past a scoreboard — and when the host is pacing by hand it pulses
 * whenever the game is waiting on them.
 *
 * Ending a game mid-way asks twice, so a stray tap cannot throw away the scores.
 */
export function HostControlBar({ game }: HostControlBarProps) {
  const { send } = useRoomSocket();
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!confirming) return undefined;
    const timer = window.setTimeout(() => setConfirming(false), CONFIRM_WINDOW_MS);
    return () => window.clearTimeout(timer);
  }, [confirming]);

  const answering = game.phase === QUIZ_PHASE.QUESTION;
  const waitingOnHost = game.pacing === PACING.HOST && game.deadline === 0;

  return (
    <div className="fixed bottom-[clamp(12px,1.6vw,24px)] right-[clamp(16px,2.4vw,40px)] z-30 flex items-center gap-3">
      <Button
        variant={confirming ? BUTTON_VARIANT.DANGER : BUTTON_VARIANT.PLAIN}
        size={BUTTON_SIZE.MD}
        icon={<X size={18} strokeWidth={3} aria-hidden="true" />}
        onClick={() => {
          if (!confirming) {
            setConfirming(true);
            return;
          }
          setConfirming(false);
          send(QUIZ_ACTION.END_GAME);
        }}
      >
        <Show when={confirming} fallback="End game">
          Sure? End now
        </Show>
      </Button>
      <Button
        variant={BUTTON_VARIANT.SUN}
        size={BUTTON_SIZE.LG}
        className={cn(waitingOnHost && 'animate-heartbeat')}
        icon={<SkipForward size={22} strokeWidth={3} aria-hidden="true" />}
        onClick={() => send(QUIZ_ACTION.NEXT)}
      >
        <Show when={answering} fallback="Next">
          Skip
        </Show>
      </Button>
    </div>
  );
}
