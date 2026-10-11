import type { QuizConfig } from '@shared/types/quiz';

// Mirrors the phase lengths in the backend (games/quiz/quiz.types.go). These
// only feed an estimate shown to the host, so a small drift is harmless.
const INTRO_SECONDS = 4;
const REVEAL_SECONDS = 6;
const BOARD_SECONDS = 6;
const ROUND_END_SECONDS = 9;
// People rarely use the whole clock: a room usually answers in about 60% of it.
const TYPICAL_ANSWER_SHARE = 0.6;
const SECONDS_PER_MINUTE = 60;

/**
 * Roughly how long a game will take, in whole minutes. Returns null for an
 * endless game, which lasts until the host ends it.
 */
export function estimateMinutes(config: QuizConfig): number | null {
  if (config.endless) return null;

  const perQuestion = config.seconds_per_question * TYPICAL_ANSWER_SHARE + REVEAL_SECONDS + BOARD_SECONDS;
  const perRound = INTRO_SECONDS + config.questions_per_round * perQuestion + ROUND_END_SECONDS;
  return Math.max(1, Math.round((config.rounds * perRound) / SECONDS_PER_MINUTE));
}
