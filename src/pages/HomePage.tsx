import { Link } from "react-router-dom";
import { useAppSelector } from "../store/hooks";

function HomePage() {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold sm:text-5xl">
        Your games. Your reviews. <span className="text-vault-accent">Your vault.</span>
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-slate-400">
        Browse games, share reviews and keep track of what you want to play, are playing and have finished.
      </p>

      <div className="mt-8 flex justify-center gap-3">
        <Link to="/games" className="rounded-lg bg-vault-accent px-5 py-2.5 font-medium hover:bg-vault-accent-hover">
          Browse games
        </Link>
        {!user && (
          <Link to="/register" className="rounded-lg border border-vault-700 px-5 py-2.5 font-medium hover:bg-vault-800">
            Create account
          </Link>
        )}
      </div>
    </section>
  );
}

export default HomePage;
