import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BacklogItemControls from "../components/BacklogItemControls";
import GameCover from "../components/GameCover";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchBacklog } from "../store/backlogSlice";
import type { BacklogStatus } from "../types";
import { BACKLOG_STATUSES, STATUS_LABELS } from "../utils/constants";

type Tab = "all" | BacklogStatus;

function BacklogPage() {
  const dispatch = useAppDispatch();
  const { items, loaded, error } = useAppSelector((state) => state.backlog);
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => {
    const request = dispatch(fetchBacklog());
    return () => request.abort();
  }, [dispatch]);

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "all", label: "All", count: items.length },
    ...BACKLOG_STATUSES.map((status) => ({
      key: status,
      label: STATUS_LABELS[status],
      count: items.filter((item) => item.status === status).length,
    })),
  ];

  const visible = tab === "all" ? items : items.filter((item) => item.status === tab);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">My backlog</h1>

      <div role="tablist" className="flex flex-wrap gap-2">
        {tabs.map(({ key, label, count }) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={`rounded-full border px-4 py-1.5 text-sm transition ${
              tab === key ? "border-vault-accent bg-vault-accent" : "border-vault-700 hover:bg-vault-800"
            }`}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {error && (
        <div role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
          {error}{" "}
          <button type="button" className="underline" onClick={() => dispatch(fetchBacklog())}>
            Try again
          </button>
        </div>
      )}

      {!loaded && !error && <p className="py-12 text-center text-slate-400">Loading your backlog...</p>}

      {loaded && visible.length === 0 && (
        <div className="py-12 text-center text-slate-400">
          <p>{tab === "all" ? "Your backlog is empty." : `No games in ${STATUS_LABELS[tab]}.`}</p>
          <Link to="/games" className="mt-3 inline-block text-vault-accent hover:underline">
            Browse games
          </Link>
        </div>
      )}

      {visible.length > 0 && (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((item) => (
            <li key={item._id} className="flex gap-4 rounded-xl border border-vault-700 bg-vault-800 p-4">
              <Link to={`/games/${item.game._id}`} className="shrink-0">
                <GameCover
                  src={item.game.coverImage}
                  title={item.game.title}
                  className="h-28 w-20 rounded-lg text-2xl"
                />
              </Link>
              <div className="min-w-0 flex-1 space-y-2">
                <Link to={`/games/${item.game._id}`} className="line-clamp-1 font-semibold hover:text-vault-accent">
                  {item.game.title}
                </Link>
                <p className="text-xs text-slate-400">
                  {item.game.genre} &middot; {item.game.platform}
                </p>
                <BacklogItemControls item={item} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default BacklogPage;
