import { useMutation } from '@tanstack/react-query';

import { EP } from '@shared/constants/endpoints';
import { apiClient, type ApiError } from '@shared/services/api-client';

export interface JoinPayload {
  code: string;
  name: string;
  avatar: string;
}

export interface JoinedRoom {
  code: string;
  player_id: string;
  player_token: string;
  name: string;
  avatar: string;
}

export function useJoinRoom() {
  return useMutation<JoinedRoom, ApiError, JoinPayload>({
    mutationFn: ({ code, name, avatar }) => apiClient.post<JoinedRoom>(EP.ROOMS.JOIN(code), { name, avatar }),
  });
}
