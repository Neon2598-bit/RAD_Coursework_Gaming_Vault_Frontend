import api from "./axios";
import type { ApiResponse, BacklogItem, BacklogStatus } from "../types";

export const getMyBacklog = async (signal?: AbortSignal) =>
  (await api.get<ApiResponse<{ items: BacklogItem[] }>>("/backlog", { signal })).data.data.items;

export const addToBacklog = async (gameId: string, status: BacklogStatus) =>
  (await api.post<ApiResponse<{ item: BacklogItem }>>("/backlog", { gameId, status })).data.data.item;

export const updateBacklogStatus = async (id: string, status: BacklogStatus) =>
  (await api.put<ApiResponse<{ item: BacklogItem }>>(`/backlog/${id}`, { status })).data.data.item;

export const removeFromBacklog = async (id: string) => {
  await api.delete(`/backlog/${id}`);
};
