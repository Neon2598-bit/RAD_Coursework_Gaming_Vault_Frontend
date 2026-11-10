import { useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import GameForm from "../components/GameForm";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { createGame, updateGame } from "../store/adminSlice";
import { fetchGameById } from "../store/gamesSlice";
import type { GamePayload } from "../types";

function GameFormPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { current, currentLoading, currentError } = useAppSelector((state) => state.games);

  const isEditing = Boolean(id);
  const game = current && current._id === id ? current : undefined;

  useEffect(() => {
    if (!id) return;
    const request = dispatch(fetchGameById(id));
    return () => request.abort();
  }, [dispatch, id]);

  const handleSubmit = async (payload: GamePayload) => {
    if (id) await dispatch(updateGame({ id, payload })).unwrap();
    else await dispatch(createGame(payload)).unwrap();
    navigate("/admin");
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/admin" className="text-sm text-slate-400 hover:text-white">
        &larr; Back to manage games
      </Link>
      <h1 className="text-2xl font-bold">{isEditing ? "Edit game" : "Add game"}</h1>

      {isEditing && currentLoading && !game && <p className="text-slate-400">Loading game...</p>}

      {isEditing && currentError && !game && (
        <div role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
          {currentError}
        </div>
      )}

      {(!isEditing || game) && (
        <GameForm
          key={game?._id ?? "new"}
          game={game}
          submitLabel={isEditing ? "Save changes" : "Create game"}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/admin")}
        />
      )}
    </div>
  );
}

export default GameFormPage;
