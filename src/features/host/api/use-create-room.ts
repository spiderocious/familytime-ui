import { useMutation } from '@tanstack/react-query';

import { EP } from '@shared/constants/endpoints';
import { apiClient, type ApiError } from '@shared/services/api-client';
import type { QuizConfig } from '@shared/types/quiz';

export interface CreateRoomPayload {
  game_id: string;
  config: QuizConfig;
}

export interface CreatedRoom {
  code: string;
  host_token: string;
  join_url: string;
  game_id: string;
}

export function useCreateRoom() {
  return useMutation<CreatedRoom, ApiError, CreateRoomPayload>({
    mutationFn: (payload) => apiClient.post<CreatedRoom>(EP.ROOMS.CREATE, payload),
  });
}
