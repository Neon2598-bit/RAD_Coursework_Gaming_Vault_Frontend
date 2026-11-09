import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { addToBacklog, fetchBacklog } from "../store/backlogSlice";
import type { BacklogStatus } from "../types";
import { BACKLOG_STATUSES, STATUS_LABELS } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";
import BacklogItemControls from "./BacklogItemControls";

function BacklogButton({ gameId }: { gameId: string }) {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { items, loaded } = useAppSelector((state) => state.backlog);
  const [status, setStatus] = useState<BacklogStatus>("wishlist");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;
    const request = dispatch(fetchBacklog());
    return () => request.abort();
  }, [dispatch, userId]);

  if (!user) {
    return (
      <p className="text-sm text-slate-400">
        <Link to="/login" state={{ from: `/games/${gameId}` }} className="text-vault-accent hover:underline">
          Log in
        </Link>{" "}
        to add this game to your backlog.
      </p>
    );
  }

  if (!loaded) return null;

  const item = items.find((entry) => entry.game._id === gameId);

  if (item) {
    return (
      <div className="space-y-2 rounded-xl border border-vault-700 bg-vault-800 p-4">
        <p className="text-sm font-medium">In your backlog</p>
        <BacklogItemControls item={item} />
      </div>
    );
  }

  const handleAdd = async () => {
    setAdding(true);
    setError(null);
    try {
      await dispatch(addToBacklog({ gameId, status })).unwrap();
    } catch (err) {
      setError(typeof err === "string" ? err : getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  return (
    <div className="space-y-2 rounded-xl border border-vault-700 bg-vault-800 p-4">
      <p className="text-sm font-medium">Add to your backlog</p>
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Choose status"
          value={status}
          onChange={(e) => setStatus(e.target.value as BacklogStatus)}
          className="rounded-lg border border-vault-700 bg-vault-900 px-3 py-1.5 text-sm outline-none focus:border-vault-accent"
        >
          {BACKLOG_STATUSES.map((value) => (
            <option key={value} value={value}>
              {STATUS_LABELS[value]}
            </option>
          ))}
        </select>
        <button
          type="button"
          disabled={adding}
          onClick={handleAdd}
          className="rounded-lg bg-vault-accent px-4 py-1.5 text-sm font-medium hover:bg-vault-accent-hover disabled:opacity-50"
        >
          {adding ? "Adding..." : "Add to backlog"}
        </button>
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default BacklogButton;
