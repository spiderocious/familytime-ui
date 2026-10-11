import { useEffect, useRef } from 'react';

import type { RoomState } from '@shared/realtime/protocol';
import { useCountdown } from '@shared/realtime/use-countdown';
import { SOUND, sound, type SoundKey } from '@shared/services/sound';
import { QUIZ_PHASE, type QuizPhase } from '@shared/types/quiz';

const TICK_FROM_SECONDS = 5;

const PHASE_SOUND: Partial<Record<QuizPhase, SoundKey>> = {
  [QUIZ_PHASE.INTRO]: SOUND.WHOOSH,
  [QUIZ_PHASE.QUESTION]: SOUND.GO,
  [QUIZ_PHASE.REVEAL]: SOUND.REVEAL,
  [QUIZ_PHASE.LEADERBOARD]: SOUND.RANK,
  [QUIZ_PHASE.ROUND_END]: SOUND.DRUMROLL,
  [QUIZ_PHASE.FINISHED]: SOUND.FANFARE,
};

/**
 * The big screen is the room's speaker. This plays a cue on every change worth
 * hearing: someone joining, each answer locking in, the last five seconds, and
 * every change of phase.
 */
export function useHostSounds(state: RoomState | null): void {
  const game = state?.game ?? null;
  const playerCount = state?.room.players.length ?? 0;
  const answeredCount = game?.answered_ids.length ?? 0;
  const phaseKey = game === null ? '' : `${game.phase}:${game.round}:${game.question_seq}`;
  const phase = game?.phase;

  const countdown = useCountdown(phase === QUIZ_PHASE.QUESTION ? (game?.deadline ?? 0) : 0, game?.phase_started_at ?? 0);

  const previousPlayers = useRef(playerCount);
  const previousAnswered = useRef(answeredCount);

  useEffect(() => {
    if (playerCount > previousPlayers.current) sound.play(SOUND.JOIN);
    previousPlayers.current = playerCount;
  }, [playerCount]);

  useEffect(() => {
    if (phase !== undefined) {
      const cue = PHASE_SOUND[phase];
      if (cue !== undefined) sound.play(cue);
    }
    // phaseKey changes once per phase step; `phase` alone would miss question → question.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phaseKey]);

  useEffect(() => {
    if (phase === QUIZ_PHASE.QUESTION && answeredCount > previousAnswered.current) sound.play(SOUND.LOCK);
    previousAnswered.current = answeredCount;
  }, [answeredCount, phase]);

  const ticking = countdown.running && countdown.secondsLeft <= TICK_FROM_SECONDS && countdown.secondsLeft > 0;
  useEffect(() => {
    if (ticking) sound.play(SOUND.TICK);
  }, [ticking, countdown.secondsLeft]);
}
