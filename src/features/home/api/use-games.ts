import { useQuery } from '@tanstack/react-query';

import { EP } from '@shared/constants/endpoints';
import { apiClient, type ApiError } from '@shared/services/api-client';

export interface GameSummary {
  id: string;
  title: string;
  tagline: string;
  emoji: string;
  min_players: number;
  max_players: number;
}

export const GAMES_KEY = ['games'] as const;

export function useGames() {
  return useQuery<GameSummary[], ApiError>({
    queryKey: GAMES_KEY,
    queryFn: ({ signal }) => apiClient.get<GameSummary[]>(EP.GAMES.LIST, signal),
  });
}
