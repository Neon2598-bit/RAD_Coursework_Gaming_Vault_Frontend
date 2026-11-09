import { Link } from "react-router-dom";

function NotFoundPage() {
  return (
    <div className="py-20 text-center">
      <h1 className="text-5xl font-bold text-vault-accent">404</h1>
      <p className="mt-3 text-slate-400">This page does not exist.</p>
      <Link to="/" className="mt-6 inline-block rounded-lg bg-vault-accent px-5 py-2.5 font-medium hover:bg-vault-accent-hover">
        Back to home
      </Link>
    </div>
  );
}

export default NotFoundPage;
