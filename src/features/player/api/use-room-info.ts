import { useQuery } from '@tanstack/react-query';

import { EP } from '@shared/constants/endpoints';
import type { RoomPhase } from '@shared/realtime/protocol';
import { apiClient, type ApiError } from '@shared/services/api-client';

export interface RoomInfo {
  code: string;
  phase: RoomPhase;
  game_id: string;
  game_title: string;
  player_count: number;
  max_players: number;
  joinable: boolean;
  avatars: string[];
}

export const roomInfoKey = (code: string) => ['rooms', code] as const;

export function useRoomInfo(code: string) {
  return useQuery<RoomInfo, ApiError>({
    queryKey: roomInfoKey(code),
    queryFn: ({ signal }) => apiClient.get<RoomInfo>(EP.ROOMS.DETAIL(code), signal),
    enabled: code !== '',
    // A wrong code will not become right on a retry.
    retry: false,
    staleTime: 0,
  });
}
