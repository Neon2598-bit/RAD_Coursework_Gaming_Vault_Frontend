import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { logoutUser } from "../store/authSlice";

function Navbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    setOpen(false);
    await dispatch(logoutUser());
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive ? "bg-vault-700 text-white" : "text-slate-300 hover:bg-vault-800 hover:text-white"
    }`;

  return (
    <header className="border-b border-vault-700 bg-vault-900">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-vault-accent" onClick={() => setOpen(false)}>
          GameVault
        </Link>

        <button
          type="button"
          className="rounded-md p-2 text-slate-300 hover:bg-vault-800 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 6h16M4 12h16M4 18h16" />}
          </svg>
        </button>

        <div
          className={`${
            open ? "flex" : "hidden"
          } absolute left-0 right-0 top-14 z-10 flex-col gap-1 border-b border-vault-700 bg-vault-900 p-4 md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0`}
          onClick={() => setOpen(false)}
        >
          <NavLink to="/" end className={linkClass}>Home</NavLink>
          <NavLink to="/games" className={linkClass}>Games</NavLink>

          {user ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              <NavLink to="/backlog" className={linkClass}>Backlog</NavLink>
              <NavLink to="/my-reviews" className={linkClass}>My reviews</NavLink>
              <NavLink to="/profile" className={linkClass}>Profile</NavLink>
              {user.role === "admin" && <NavLink to="/admin" className={linkClass}>Admin</NavLink>}
              <span className="px-3 py-2 text-sm text-slate-400">{user.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md bg-vault-accent px-3 py-2 text-sm font-medium hover:bg-vault-accent-hover"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Login</NavLink>
              <NavLink
                to="/register"
                className="rounded-md bg-vault-accent px-3 py-2 text-sm font-medium hover:bg-vault-accent-hover"
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
