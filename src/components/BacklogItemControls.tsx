import { useState } from "react";
import type { BacklogItem, BacklogStatus } from "../types";
import { useAppDispatch } from "../store/hooks";
import { removeFromBacklog, updateBacklogStatus } from "../store/backlogSlice";
import { BACKLOG_STATUSES, STATUS_LABELS } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";

function BacklogItemControls({ item }: { item: BacklogItem }) {
  const dispatch = useAppDispatch();
  const [busy, setBusy] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
    } catch (err) {
      setError(typeof err === "string" ? err : getErrorMessage(err));
      setBusy(false);
    }
  };

  const handleStatusChange = (status: BacklogStatus) =>
    run(async () => {
      await dispatch(updateBacklogStatus({ id: item._id, status })).unwrap();
      setBusy(false);
    });

  const handleRemove = () => run(() => dispatch(removeFromBacklog(item._id)).unwrap());

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <select
          aria-label="Backlog status"
          value={item.status}
          disabled={busy}
          onChange={(e) => handleStatusChange(e.target.value as BacklogStatus)}
          className="rounded-lg border border-vault-700 bg-vault-900 px-3 py-1.5 text-sm outline-none focus:border-vault-accent disabled:opacity-50"
        >
          {BACKLOG_STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_LABELS[status]}
            </option>
          ))}
        </select>

        {confirming ? (
          <span className="flex items-center gap-2 text-sm">
            <span className="text-slate-400">Remove?</span>
            <button type="button" disabled={busy} onClick={handleRemove} className="text-red-400 hover:underline disabled:opacity-50">
              Yes
            </button>
            <button type="button" onClick={() => setConfirming(false)} className="text-slate-400 hover:underline">
              No
            </button>
          </span>
        ) : (
          <button type="button" onClick={() => setConfirming(true)} className="text-sm text-red-400 hover:underline">
            Remove
          </button>
        )}
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default BacklogItemControls;
