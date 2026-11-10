import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="relative mx-auto w-full max-w-6xl flex-1 px-4 py-8">
        <Outlet />
      </main>
      <footer className="border-t border-vault-700 py-6 text-center text-sm text-slate-500">
        GameVault &middot; Game review and backlog tracker
      </footer>
    </div>
  );
}

export default Layout;
