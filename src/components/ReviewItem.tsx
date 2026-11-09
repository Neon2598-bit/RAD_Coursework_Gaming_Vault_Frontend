import { useState, type ReactNode } from "react";
import { formatDate } from "../utils/formatDate";
import { getErrorMessage } from "../utils/getErrorMessage";
import ReviewForm from "./ReviewForm";
import StarRating from "./StarRating";

interface ReviewItemProps {
  review: { rating: number; comment: string; createdAt: string; updatedAt: string };
  title: ReactNode;
  leading?: ReactNode;
  isYours?: boolean;
  canEdit: boolean;
  canDelete: boolean;
  onSave: (rating: number, comment: string) => Promise<void>;
  onDelete: () => Promise<void>;
}

function ReviewItem({ review, title, leading, isYours, canEdit, canDelete, onSave, onDelete }: ReviewItemProps) {
  const [editing, setEditing] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      await onDelete();
    } catch (err) {
      setDeleteError(typeof err === "string" ? err : getErrorMessage(err));
      setDeleting(false);
    }
  };

  return (
    <li className="flex gap-4 rounded-xl border border-vault-700 bg-vault-800 p-4">
      {leading}
      <div className="min-w-0 flex-1 space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-medium">{title}</span>
            {isYours && (
              <span className="rounded-full bg-vault-accent/20 px-2 py-0.5 text-xs text-vault-accent">You</span>
            )}
          </div>
          <span className="text-xs text-slate-500">
            {formatDate(review.createdAt)}
            {review.updatedAt !== review.createdAt && " (edited)"}
          </span>
        </div>

        {editing ? (
          <ReviewForm
            initialRating={review.rating}
            initialComment={review.comment}
            submitLabel="Save changes"
            onSubmit={async (rating, comment) => {
              await onSave(rating, comment);
              setEditing(false);
            }}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <StarRating value={review.rating} size="text-lg" />
            {review.comment && <p className="whitespace-pre-line break-words text-sm text-slate-300">{review.comment}</p>}

            {(canEdit || canDelete) && (
              <div className="flex flex-wrap items-center gap-3 pt-1 text-sm">
                {canEdit && (
                  <button type="button" onClick={() => setEditing(true)} className="text-vault-accent hover:underline">
                    Edit
                  </button>
                )}
                {canDelete && !confirming && (
                  <button type="button" onClick={() => setConfirming(true)} className="text-red-400 hover:underline">
                    Delete
                  </button>
                )}
                {canDelete && confirming && (
                  <>
                    <span className="text-slate-400">Delete this review?</span>
                    <button
                      type="button"
                      disabled={deleting}
                      onClick={handleDelete}
                      className="text-red-400 hover:underline disabled:opacity-50"
                    >
                      {deleting ? "Deleting..." : "Yes"}
                    </button>
                    <button type="button" onClick={() => setConfirming(false)} className="text-slate-400 hover:underline">
                      No
                    </button>
                  </>
                )}
              </div>
            )}
            {deleteError && <p className="text-sm text-red-400">{deleteError}</p>}
          </>
        )}
      </div>
    </li>
  );
}

export default ReviewItem;
