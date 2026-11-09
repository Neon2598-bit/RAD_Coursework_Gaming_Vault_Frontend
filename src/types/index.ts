import type { BACKLOG_STATUSES, GENRES, PLATFORMS } from "../utils/constants";

export type Role = "user" | "admin";
export type Genre = (typeof GENRES)[number];
export type Platform = (typeof PLATFORMS)[number];
export type BacklogStatus = (typeof BACKLOG_STATUSES)[number];

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface AuthPayload {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface Game {
  _id: string;
  title: string;
  genre: Genre;
  platform: Platform;
  releaseYear: number;
  description: string;
  coverImage: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export type GameSummary = Pick<Game, "_id" | "title" | "genre" | "platform" | "coverImage"> & {
  releaseYear?: number;
};

export interface Review {
  _id: string;
  user: { _id: string; name: string };
  game: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
}

export interface MyReview extends Omit<Review, "game" | "user"> {
  user: string;
  game: GameSummary;
}

export interface BacklogItem {
  _id: string;
  user: string;
  game: GameSummary;
  status: BacklogStatus;
  createdAt: string;
  updatedAt: string;
}

export interface DashboardData {
  backlog: Record<BacklogStatus, number> & { total: number };
  reviews: { count: number; averageRating: number };
  topGenres: { genre: string; count: number }[];
}

export interface GamesPage {
  games: Game[];
  total: number;
  page: number;
  pages: number;
}

export interface GameFilters {
  search: string;
  genre: string;
  platform: string;
  page: number;
}

export interface ReviewsPage {
  reviews: Review[];
  total: number;
  page: number;
  pages: number;
  averageRating: number;
}
