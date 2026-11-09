import { useEffect } from "react";
import { Link } from "react-router-dom";
import StarRating from "../components/StarRating";
import StatCard from "../components/StatCard";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchDashboard } from "../store/dashboardSlice";
import type { BacklogStatus } from "../types";
import { BACKLOG_STATUSES, STATUS_LABELS } from "../utils/constants";

const STATUS_COLORS: Record<BacklogStatus, string> = {
  wishlist: "bg-sky-500",
  playing: "bg-amber-500",
  completed: "bg-emerald-500",
};

function DashboardPage() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.auth.user);
  const { data, loading, error } = useAppSelector((state) => state.dashboard);

  useEffect(() => {
    const request = dispatch(fetchDashboard());
    return () => request.abort();
  }, [dispatch]);

  if (error) {
    return (
      <div role="alert" className="rounded-lg bg-red-500/10 p-4 text-sm text-red-400">
        {error}{" "}
        <button type="button" className="underline" onClick={() => dispatch(fetchDashboard())}>
          Try again
        </button>
      </div>
    );
  }

  if (!data) {
    return <p className="py-12 text-center text-slate-400">{loading ? "Loading dashboard..." : ""}</p>;
  }

  const { backlog, reviews, topGenres } = data;
  const maxGenre = Math.max(...topGenres.map((genre) => genre.count), 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-slate-400">Your gaming activity at a glance, {user?.name}.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Games in backlog" value={backlog.total} />
        <StatCard label="Currently playing" value={backlog.playing} />
        <StatCard label="Completed" value={backlog.completed} />
        <StatCard
          label="Reviews written"
          value={reviews.count}
          hint={reviews.count > 0 ? `Average rating ${reviews.averageRating.toFixed(1)}` : undefined}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-vault-700 bg-vault-800 p-6">
          <h2 className="font-semibold">Backlog breakdown</h2>

          {backlog.total === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              Nothing here yet.{" "}
              <Link to="/games" className="text-vault-accent hover:underline">
                Add some games
              </Link>
              .
            </p>
          ) : (
            <>
              <div className="mt-4 flex h-4 overflow-hidden rounded-full bg-vault-900" role="img" aria-label="Backlog status breakdown">
                {BACKLOG_STATUSES.map((status) => (
                  <div
                    key={status}
                    className={STATUS_COLORS[status]}
                    style={{ width: `${(backlog[status] / backlog.total) * 100}%` }}
                  />
                ))}
              </div>
              <ul className="mt-4 space-y-2 text-sm">
                {BACKLOG_STATUSES.map((status) => (
                  <li key={status} className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className={`h-3 w-3 rounded-full ${STATUS_COLORS[status]}`} />
                      {STATUS_LABELS[status]}
                    </span>
                    <span className="text-slate-400">
                      {backlog[status]} ({Math.round((backlog[status] / backlog.total) * 100)}%)
                    </span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <section className="rounded-xl border border-vault-700 bg-vault-800 p-6">
          <h2 className="font-semibold">Top genres</h2>

          {topGenres.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">Add games to your backlog to see your favourite genres.</p>
          ) : (
            <ul className="mt-4 space-y-3">
              {topGenres.map((genre) => (
                <li key={genre.genre}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span>{genre.genre}</span>
                    <span className="text-slate-400">{genre.count}</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-vault-900">
                    <div
                      className="h-full rounded-full bg-vault-accent"
                      style={{ width: `${(genre.count / maxGenre) * 100}%` }}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {reviews.count > 0 && (
        <section className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-vault-700 bg-vault-800 p-6">
          <div>
            <h2 className="font-semibold">Your average rating</h2>
            <p className="text-sm text-slate-400">Across {reviews.count} {reviews.count === 1 ? "review" : "reviews"}</p>
          </div>
          <div className="flex items-center gap-3">
            <StarRating value={reviews.averageRating} size="text-2xl" />
            <span className="text-2xl font-bold">{reviews.averageRating.toFixed(1)}</span>
          </div>
        </section>
      )}
    </div>
  );
}

export default DashboardPage;
