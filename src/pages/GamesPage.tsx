import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import GameCard from "../components/GameCard";
import GameFilters from "../components/GameFilters";
import Pagination from "../components/Pagination";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchGames } from "../store/gamesSlice";

type ParamChanges = Partial<Record<"search" | "genre" | "platform" | "page", string>>;

function GamesPage() {
  const dispatch = useAppDispatch();
  const { items, total, pages, loading, error } = useAppSelector((state) => state.games);
  const [searchParams, setSearchParams] = useSearchParams();

  const search = searchParams.get("search") ?? "";
  const genre = searchParams.get("genre") ?? "";
  const platform = searchParams.get("platform") ?? "";
  const page = Math.max(parseInt(searchParams.get("page") ?? "1") || 1, 1);

  const [searchInput, setSearchInput] = useState(search);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const updateParams = (changes: ParamChanges) => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        Object.entries(changes).forEach(([key, value]) => {
          if (value) next.set(key, value);
          else next.delete(key);
        });
        return next;
      },
      { replace: true }
    );
  };

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => updateParams({ search: value.trim(), page: "" }), 400);
  };

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  useEffect(() => {
    const request = dispatch(fetchGames({ search, genre, platform, page }));
    return () => request.abort();
  }, [dispatch, search, genre, platform, page]);

  const handleClear = () => {
    clearTimeout(searchTimer.current);
    setSearchInput("");
    setSearchParams({}, { replace: true });
  };

  const handlePageChange = (next: number) => {
    updateParams({ page: next > 1 ? String(next) : "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Games</h1>
        <p className="text-sm text-slate-400">{total} games found</p>
      </div>

      <GameFilters
        search={searchInput}
        genre={genre}
        platform={platform}
        onSearchChange={handleSearchChange}
        onGenreChange={(value) => updateParams({ genre: value, page: "" })}
        onPlatformChange={(value) => updateParams({ platform: value, page: "" })}
        onClear={handleClear}
      />

      {error && (
        <div role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
          {error}{" "}
          <button
            type="button"
            className="underline"
            onClick={() => dispatch(fetchGames({ search, genre, platform, page }))}
          >
            Try again
          </button>
        </div>
      )}

      {loading && items.length === 0 && <p className="py-12 text-center text-slate-400">Loading games...</p>}

      {!loading && !error && items.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          <p>No games found.</p>
          <button type="button" onClick={handleClear} className="mt-3 text-vault-accent hover:underline">
            Clear filters
          </button>
        </div>
      )}

      {items.length > 0 && (
        <div
          className={`grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-4 ${
            loading ? "opacity-50" : ""
          }`}
        >
          {items.map((game) => (
            <GameCard key={game._id} game={game} />
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onChange={handlePageChange} />
    </div>
  );
}

export default GamesPage;
