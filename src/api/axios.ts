import axios, { type InternalAxiosRequestConfig } from "axios";
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from "../utils/tokenStorage";

const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
});

let onAuthFailure: (() => void) | null = null;
export const setAuthFailureHandler = (handler: () => void) => {
  onAuthFailure = handler;
};

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) config.headers.set("Authorization", `Bearer ${token}`);
  return config;
});

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const AUTH_URLS = ["/auth/login", "/auth/register", "/auth/refresh"];

let isRefreshing = false;
let waiting: Array<(token: string | null) => void> = [];

const releaseWaiting = (token: string | null) => {
  waiting.forEach((resume) => resume(token));
  waiting = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as RetryConfig | undefined;
    const isAuthCall = AUTH_URLS.some((url) => original?.url?.startsWith(url));

    if (!original || error.response?.status !== 401 || original._retry || isAuthCall) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();
    if (!refreshToken) return Promise.reject(error);
    original._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        waiting.push((token) => {
          if (!token) return reject(error);
          original.headers.set("Authorization", `Bearer ${token}`);
          resolve(api(original));
        });
      });
    }

    isRefreshing = true;
    try {
      const res = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
      const newToken: string = res.data.data.accessToken;
      setAccessToken(newToken);
      releaseWaiting(newToken);
      original.headers.set("Authorization", `Bearer ${newToken}`);
      return api(original);
    } catch {
      releaseWaiting(null);
      clearTokens();
      onAuthFailure?.();
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;
