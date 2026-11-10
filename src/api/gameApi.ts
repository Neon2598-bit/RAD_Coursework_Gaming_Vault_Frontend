import api from "./axios";
import type { ApiResponse, Game, GameFilters, GamePayload, GamesPage } from "../types";
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

export const getDeletedGames = async (signal?: AbortSignal) =>
  (await api.get<ApiResponse<{ games: Game[] }>>("/games/deleted", { signal })).data.data.games;

export const createGame = async (payload: GamePayload) =>
  (await api.post<ApiResponse<{ game: Game }>>("/games", payload)).data.data.game;

export const updateGame = async (id: string, payload: GamePayload) =>
  (await api.put<ApiResponse<{ game: Game }>>(`/games/${id}`, payload)).data.data.game;

export const deleteGame = async (id: string) => {
  await api.delete(`/games/${id}`);
};

export const restoreGame = async (id: string) =>
  (await api.put<ApiResponse<{ game: Game }>>(`/games/${id}/restore`)).data.data.game;
