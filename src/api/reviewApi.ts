import api from "./axios";
import type { ApiResponse, MyReview, Review, ReviewsPage } from "../types";
import { REVIEWS_PER_PAGE } from "../utils/constants";

interface ReviewBody {
  rating: number;
  comment: string;
}

export const getGameReviews = async (gameId: string, page: number, signal?: AbortSignal) => {
  const res = await api.get<ApiResponse<ReviewsPage>>(`/games/${gameId}/reviews`, {
    params: { page, limit: REVIEWS_PER_PAGE },
    signal,
  });
  return res.data.data;
};

export const createReview = async (gameId: string, body: ReviewBody) =>
  (await api.post<ApiResponse<{ review: Review }>>(`/games/${gameId}/reviews`, body)).data.data.review;

export const updateReview = async (id: string, body: ReviewBody) =>
  (await api.put<ApiResponse<{ review: Review }>>(`/reviews/${id}`, body)).data.data.review;

export const deleteReview = async (id: string) => {
  await api.delete(`/reviews/${id}`);
};

export const getMyReviews = async (signal?: AbortSignal) =>
  (await api.get<ApiResponse<{ reviews: MyReview[] }>>("/reviews/my", { signal })).data.data.reviews;
