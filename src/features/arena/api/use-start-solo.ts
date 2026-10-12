import { useMutation } from '@tanstack/react-query';

import { EP } from '@shared/constants/endpoints';
import { apiClient, type ApiError } from '@shared/services/api-client';
import type { QuizConfig } from '@shared/types/quiz';

export interface Seat {
  code: string;
  player_id: string;
  player_token: string;
  name: string;
  avatar: string;
}

export interface StartSoloPayload {
  name: string;
  config: QuizConfig;
}

/** Starts a solo run: a private room that this one player owns and plays in. */
export function useStartSolo() {
  return useMutation<Seat, ApiError, StartSoloPayload>({
    mutationFn: (payload) => apiClient.post<Seat>(EP.SOLO.START, payload),
  });
}
