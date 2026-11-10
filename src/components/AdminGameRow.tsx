import { useState } from "react";
import { Link } from "react-router-dom";
import type { Game } from "../types";
import { useAppDispatch } from "../store/hooks";
import { deleteGame, restoreGame } from "../store/adminSlice";
import { getErrorMessage } from "../utils/getErrorMessage";
import GameCover from "./GameCover";

interface AdminGameRowProps {
  game: Game;
  mode: "active" | "deleted";
  onChanged?: () => void;
}

function AdminGameRow({ game, mode, onChanged }: AdminGameRowProps) {
  const dispatch = useAppDispatch();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(null);
    try {
      await action();
      onChanged?.();
    } catch (err) {
      setError(typeof err === "string" ? err : getErrorMessage(err));
      setBusy(false);
    }
  };

  return (
    <tr>
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <GameCover src={game.coverImage} title={game.title} className="h-12 w-9 shrink-0 rounded text-sm" />
          <span className="font-medium">{game.title}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-300">{game.genre}</td>
      <td className="px-4 py-3 text-slate-300">{game.platform}</td>
      <td className="px-4 py-3 text-slate-300">{game.releaseYear}</td>
      <td className="px-4 py-3">
        <div className="flex flex-wrap items-center justify-end gap-3">
          {mode === "active" ? (
            <>
              <Link to={`/admin/games/${game._id}/edit`} className="text-vault-accent hover:underline">
                Edit
              </Link>
              {confirming ? (
                <>
                  <span className="text-slate-400">Delete?</span>
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => run(() => dispatch(deleteGame(game._id)).unwrap())}
                    className="text-red-400 hover:underline disabled:opacity-50"
                  >
                    Yes
                  </button>
                  <button type="button" onClick={() => setConfirming(false)} className="text-slate-400 hover:underline">
                    No
                  </button>
                </>
              ) : (
                <button type="button" onClick={() => setConfirming(true)} className="text-red-400 hover:underline">
                  Delete
                </button>
              )}
            </>
          ) : (
            <button
              type="button"
              disabled={busy}
              onClick={() => run(() => dispatch(restoreGame(game._id)).unwrap())}
              className="text-emerald-400 hover:underline disabled:opacity-50"
            >
              {busy ? "Restoring..." : "Restore"}
            </button>
          )}
        </div>
        {error && <p className="mt-1 text-right text-xs text-red-400">{error}</p>}
      </td>
    </tr>
  );
}

export default AdminGameRow;
