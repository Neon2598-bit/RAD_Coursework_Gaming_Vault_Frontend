import api from "./axios";
import type { ApiResponse, DashboardData } from "../types";

export const getDashboard = async (signal?: AbortSignal) =>
  (await api.get<ApiResponse<DashboardData>>("/dashboard", { signal })).data.data;
