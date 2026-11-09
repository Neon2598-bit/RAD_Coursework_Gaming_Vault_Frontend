import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  createReview,
  deleteReview,
  fetchGameReviews,
  fetchMyReviews,
  updateReview,
} from "../store/reviewsSlice";
import Pagination from "./Pagination";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";
import StarRating from "./StarRating";

function ReviewSection({ gameId }: { gameId: string }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { gameId: loadedGameId, items, total, pages, averageRating, loading, error, myReviews, myLoaded } =
    useAppSelector((state) => state.reviews);
  const [page, setPage] = useState(1);

  const userId = user?.id;
  const reviews = loadedGameId === gameId ? items : [];
  const hasReviewed = myReviews.some((review) => review.game._id === gameId);

  useEffect(() => {
    const request = dispatch(fetchGameReviews({ gameId, page }));
    return () => request.abort();
  }, [dispatch, gameId, page]);

  useEffect(() => {
    if (!userId) return;
    const request = dispatch(fetchMyReviews());
    return () => request.abort();
  }, [dispatch, userId]);

  const refresh = () => {
    dispatch(fetchGameReviews({ gameId, page }));
    dispatch(fetchMyReviews());
  };

  const handleCreate = async (rating: number, comment: string) => {
    await dispatch(createReview({ gameId, rating, comment })).unwrap();
    setPage(1);
    refresh();
  };

  const handleUpdate = (id: string) => async (rating: number, comment: string) => {
    await dispatch(updateReview({ id, rating, comment })).unwrap();
    refresh();
  };

  const handleDelete = (id: string) => async () => {
    await dispatch(deleteReview(id)).unwrap();
    if (reviews.length === 1 && page > 1) setPage(page - 1);
    else refresh();
    dispatch(fetchMyReviews());
  };

  return (
    <section className="space-y-6 border-t border-vault-700 pt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold">Reviews</h2>
        {total > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <StarRating value={averageRating} size="text-lg" />
            <span>
              {averageRating.toFixed(1)} from {total} {total === 1 ? "review" : "reviews"}
            </span>
          </div>
        )}
      </div>

      {user ? (
        myLoaded &&
        (hasReviewed ? (
          <p className="text-sm text-slate-400">You have already reviewed this game. You can edit or delete your review below.</p>
        ) : (
          <div className="rounded-xl border border-vault-700 bg-vault-800 p-4">
            <h3 className="mb-3 font-semibold">Write a review</h3>
            <ReviewForm submitLabel="Post review" onSubmit={handleCreate} />
          </div>
        ))
      ) : (
        <p className="text-sm text-slate-400">
          <Link to="/login" state={{ from: `/games/${gameId}` }} className="text-vault-accent hover:underline">
            Log in
          </Link>{" "}
          to write a review.
        </p>
      )}

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </p>
      )}

      {loading && reviews.length === 0 && <p className="text-slate-400">Loading reviews...</p>}
      {!loading && !error && reviews.length === 0 && <p className="text-slate-400">No reviews yet. Be the first!</p>}

      {reviews.length > 0 && (
        <ul className={`space-y-3 transition-opacity ${loading ? "opacity-60" : ""}`}>
          {reviews.map((review) => {
            const isOwner = review.user._id === userId;
            return (
              <ReviewItem
                key={review._id}
                review={review}
                title={review.user.name}
                isYours={isOwner}
                canEdit={isOwner}
                canDelete={isOwner || user?.role === "admin"}
                onSave={handleUpdate(review._id)}
                onDelete={handleDelete(review._id)}
              />
            );
          })}
        </ul>
      )}

      <Pagination page={page} pages={pages} onChange={setPage} />
    </section>
  );
}

export default ReviewSection;
