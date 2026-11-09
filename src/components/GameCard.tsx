import { Link } from "react-router-dom";
import type { Game } from "../types";
import GameCover from "./GameCover";

function GameCard({ game }: { game: Game }) {
  return (
    <Link
      to={`/games/${game._id}`}
      className="group overflow-hidden rounded-xl border border-vault-700 bg-vault-800 transition hover:-translate-y-1 hover:border-vault-accent"
    >
      <GameCover src={game.coverImage} title={game.title} className="aspect-3/4 w-full" />
      <div className="space-y-2 p-4">
        <h2 className="line-clamp-1 font-semibold group-hover:text-vault-accent">{game.title}</h2>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="rounded-full bg-vault-700 px-2 py-0.5">{game.genre}</span>
          <span className="rounded-full bg-vault-700 px-2 py-0.5">{game.platform}</span>
        </div>
        <p className="text-xs text-slate-400">{game.releaseYear}</p>
      </div>
    </Link>
  );
}

export default GameCard;
