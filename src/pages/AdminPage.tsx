import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import AdminGameRow from "../components/AdminGameRow";
import Pagination from "../components/Pagination";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchAdminGames, fetchDeletedGames } from "../store/adminSlice";

type Tab = "active" | "deleted";

function AdminPage() {
  const dispatch = useAppDispatch();
  const { items, total, pages, loading, error, deleted, deletedLoaded, deletedError } = useAppSelector(
    (state) => state.admin
  );
  const [tab, setTab] = useState<Tab>("active");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (tab !== "active") return;
    const request = dispatch(fetchAdminGames({ search, page }));
    return () => request.abort();
  }, [dispatch, tab, search, page]);

  useEffect(() => {
    if (tab !== "deleted") return;
    const request = dispatch(fetchDeletedGames());
    return () => request.abort();
  }, [dispatch, tab]);

  useEffect(() => () => clearTimeout(searchTimer.current), []);

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(value.trim());
      setPage(1);
    }, 400);
  };

  const handleChanged = () => {
    if (items.length === 1 && page > 1) setPage(page - 1);
    else dispatch(fetchAdminGames({ search, page }));
  };

  const tabClass = (key: Tab) =>
    `rounded-full border px-4 py-1.5 text-sm transition ${
      tab === key ? "border-vault-accent bg-vault-accent" : "border-vault-700 hover:bg-vault-800"
    }`;

  const headerCell = "px-4 py-3 font-medium";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Manage games</h1>
          <p className="text-sm text-slate-400">Add, edit, delete and restore games.</p>
        </div>
        <Link to="/admin/games/new" className="rounded-lg bg-vault-accent px-4 py-2 font-medium hover:bg-vault-accent-hover">
          Add game
        </Link>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div role="tablist" className="flex gap-2">
          <button type="button" role="tab" aria-selected={tab === "active"} onClick={() => setTab("active")} className={tabClass("active")}>
            Active games
          </button>
          <button type="button" role="tab" aria-selected={tab === "deleted"} onClick={() => setTab("deleted")} className={tabClass("deleted")}>
            Deleted games
          </button>
        </div>

        {tab === "active" && (
          <input
            type="search"
            aria-label="Search games"
            placeholder="Search by title..."
            value={searchInput}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="rounded-lg border border-vault-700 bg-vault-900 px-3 py-2 text-sm outline-none focus:border-vault-accent sm:ml-auto sm:w-64"
          />
        )}
      </div>

      {tab === "active" && error && (
        <div role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
          {error}{" "}
          <button type="button" className="underline" onClick={() => dispatch(fetchAdminGames({ search, page }))}>
            Try again
          </button>
        </div>
      )}
      {tab === "deleted" && deletedError && (
        <div role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
          {deletedError}
        </div>
      )}

      {tab === "active" && (
        <>
          <p className="text-sm text-slate-400">{total} games</p>
          {loading && items.length === 0 && <p className="py-8 text-center text-slate-400">Loading games...</p>}
          {!loading && !error && items.length === 0 && (
            <p className="py-8 text-center text-slate-400">No games found.</p>
          )}
          {items.length > 0 && (
            <div className={`overflow-x-auto rounded-xl border border-vault-700 transition-opacity ${loading ? "opacity-60" : ""}`}>
              <table className="w-full text-left text-sm">
                <thead className="bg-vault-800 text-slate-400">
                  <tr>
                    <th className={headerCell}>Game</th>
                    <th className={headerCell}>Genre</th>
                    <th className={headerCell}>Platform</th>
                    <th className={headerCell}>Year</th>
                    <th className={`${headerCell} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-700">
                  {items.map((game) => (
                    <AdminGameRow key={game._id} game={game} mode="active" onChanged={handleChanged} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={page} pages={pages} onChange={setPage} />
        </>
      )}

      {tab === "deleted" && (
        <>
          {!deletedLoaded && !deletedError && <p className="py-8 text-center text-slate-400">Loading deleted games...</p>}
          {deletedLoaded && deleted.length === 0 && (
            <p className="py-8 text-center text-slate-400">No deleted games.</p>
          )}
          {deleted.length > 0 && (
            <div className="overflow-x-auto rounded-xl border border-vault-700">
              <table className="w-full text-left text-sm">
                <thead className="bg-vault-800 text-slate-400">
                  <tr>
                    <th className={headerCell}>Game</th>
                    <th className={headerCell}>Genre</th>
                    <th className={headerCell}>Platform</th>
                    <th className={headerCell}>Year</th>
                    <th className={`${headerCell} text-right`}>Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-vault-700">
                  {deleted.map((game) => (
                    <AdminGameRow key={game._id} game={game} mode="deleted" />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminPage;
