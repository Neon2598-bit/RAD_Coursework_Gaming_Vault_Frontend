import api from "./axios";
import type { ApiResponse, AuthPayload, User } from "../types";

export const register = async (body: { name: string; email: string; password: string }) =>
  (await api.post<ApiResponse<AuthPayload>>("/auth/register", body)).data;

export const login = async (body: { email: string; password: string }) =>
  (await api.post<ApiResponse<AuthPayload>>("/auth/login", body)).data;

export const logout = async () => (await api.post<ApiResponse<null>>("/auth/logout")).data;

export const getMe = async () =>
  (await api.get<ApiResponse<{ user: User }>>("/auth/me")).data.data.user;
