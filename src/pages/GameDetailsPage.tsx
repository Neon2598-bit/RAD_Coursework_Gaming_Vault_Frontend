import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import GameCover from "../components/GameCover";
import ReviewSection from "../components/ReviewSection";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchGameById } from "../store/gamesSlice";

function GameDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { current, currentLoading, currentError } = useAppSelector((state) => state.games);

  useEffect(() => {
    if (!id) return;
    const request = dispatch(fetchGameById(id));
    return () => request.abort();
  }, [dispatch, id]);

  const game = current && current._id === id ? current : null;

  return (
    <div className="space-y-6">
      <Link to="/games" className="text-sm text-slate-400 hover:text-white">
        &larr; Back to games
      </Link>

      {currentLoading && !game && <p className="py-12 text-center text-slate-400">Loading game...</p>}

      {currentError && !game && (
        <div role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
          {currentError}
        </div>
      )}

      {game && (
        <article className="grid gap-8 md:grid-cols-[280px_1fr]">
          <GameCover
            src={game.coverImage}
            title={game.title}
            className="aspect-3/4 w-full max-w-xs rounded-xl border border-vault-700"
          />
          <div className="space-y-4">
            <h1 className="text-3xl font-bold">{game.title}</h1>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full bg-vault-accent/20 px-3 py-1 text-vault-accent">{game.genre}</span>
              <span className="rounded-full bg-vault-700 px-3 py-1">{game.platform}</span>
              <span className="rounded-full bg-vault-700 px-3 py-1">{game.releaseYear}</span>
            </div>
            <p className="whitespace-pre-line leading-relaxed text-slate-300">
              {game.description || "No description available."}
            </p>
          </div>
        </article>
      )}

      {game && <ReviewSection key={game._id} gameId={game._id} />}
    </div>
  );
}

export default GameDetailsPage;
