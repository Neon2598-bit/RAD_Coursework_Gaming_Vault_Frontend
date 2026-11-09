import api from "./axios";
import type { ApiResponse, Game, GameFilters, GamesPage } from "../types";
import { GAMES_PER_PAGE } from "../utils/constants";

export const getGames = async (filters: GameFilters, signal?: AbortSignal) => {
  const params: Record<string, string | number> = { page: filters.page, limit: GAMES_PER_PAGE };
  if (filters.search) params.search = filters.search;
  if (filters.genre) params.genre = filters.genre;
  if (filters.platform) params.platform = filters.platform;

  const res = await api.get<ApiResponse<GamesPage>>("/games", { params, signal });
  return res.data.data;
};

export const getGameById = async (id: string, signal?: AbortSignal) => {
  const res = await api.get<ApiResponse<{ game: Game }>>(`/games/${id}`, { signal });
  return res.data.data.game;
};
