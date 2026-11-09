import { useEffect } from "react";
import { Link } from "react-router-dom";
import GameCover from "../components/GameCover";
import ReviewItem from "../components/ReviewItem";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteReview, fetchMyReviews, updateReview } from "../store/reviewsSlice";

function MyReviewsPage() {
  const dispatch = useAppDispatch();
  const { myReviews, myLoaded, myError } = useAppSelector((state) => state.reviews);

  useEffect(() => {
    const request = dispatch(fetchMyReviews());
    return () => request.abort();
  }, [dispatch]);

  const handleUpdate = (id: string) => async (rating: number, comment: string) => {
    await dispatch(updateReview({ id, rating, comment })).unwrap();
    dispatch(fetchMyReviews());
  };

  const handleDelete = (id: string) => async () => {
    await dispatch(deleteReview(id)).unwrap();
    dispatch(fetchMyReviews());
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My reviews</h1>
        <p className="text-sm text-slate-400">{myReviews.length} reviews written</p>
      </div>

      {myError && (
        <p role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
          {myError}
        </p>
      )}

      {!myLoaded && !myError && <p className="text-slate-400">Loading your reviews...</p>}

      {myLoaded && myReviews.length === 0 && (
        <div className="py-10 text-center text-slate-400">
          <p>You have not reviewed any games yet.</p>
          <Link to="/games" className="mt-3 inline-block text-vault-accent hover:underline">
            Browse games
          </Link>
        </div>
      )}

      {myReviews.length > 0 && (
        <ul className="space-y-3">
          {myReviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              title={
                <Link to={`/games/${review.game._id}`} className="hover:text-vault-accent">
                  {review.game.title}
                </Link>
              }
              leading={
                <Link to={`/games/${review.game._id}`} className="shrink-0">
                  <GameCover
                    src={review.game.coverImage}
                    title={review.game.title}
                    className="h-24 w-18 rounded-lg text-2xl"
                  />
                </Link>
              }
              canEdit
              canDelete
              onSave={handleUpdate(review._id)}
              onDelete={handleDelete(review._id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default MyReviewsPage;
