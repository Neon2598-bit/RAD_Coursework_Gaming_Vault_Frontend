import { useState, type FormEvent } from "react";
import { getErrorMessage } from "../utils/getErrorMessage";
import StarRating from "./StarRating";

interface ReviewFormProps {
  initialRating?: number;
  initialComment?: string;
  submitLabel: string;
  onSubmit: (rating: number, comment: string) => Promise<void>;
  onCancel?: () => void;
}

const MAX_COMMENT = 500;

function ReviewForm({ initialRating = 0, initialComment = "", submitLabel, onSubmit, onCancel }: ReviewFormProps) {
  const [rating, setRating] = useState(initialRating);
  const [comment, setComment] = useState(initialComment);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (rating < 1) {
      setError("Please select a rating");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await onSubmit(rating, comment.trim());
    } catch (err) {
      setError(typeof err === "string" ? err : getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <StarRating value={rating} onChange={setRating} size="text-3xl" />

      <div>
        <textarea
          aria-label="Comment"
          rows={3}
          maxLength={MAX_COMMENT}
          placeholder="Share your thoughts (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full rounded-lg border border-vault-700 bg-vault-900 px-3 py-2 text-sm outline-none focus:border-vault-accent"
        />
        <p className="text-right text-xs text-slate-500">
          {comment.length}/{MAX_COMMENT}
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-vault-accent px-4 py-2 text-sm font-medium hover:bg-vault-accent-hover disabled:opacity-50"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-vault-700 px-4 py-2 text-sm hover:bg-vault-700"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default ReviewForm;
