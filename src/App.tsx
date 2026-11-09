import { useEffect, useState, type FormEvent } from "react";
import * as authApi from "./api/authApi";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { loadUser, loginUser, logoutUser } from "./store/authSlice";
import { setAccessToken } from "./utils/tokenStorage";

function App() {
  const dispatch = useAppDispatch();
  const { user, loading, initialized, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [testResult, setTestResult] = useState("");

  useEffect(() => {
    dispatch(loadUser());
  }, [dispatch]);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  const testRefresh = async () => {
    setAccessToken("broken-token");
    try {
      const me = await authApi.getMe();
      setTestResult(`Refresh worked. Still logged in as ${me.name}`);
    } catch {
      setTestResult("Refresh failed. You were logged out.");
    }
  };

  const input = "w-full rounded-lg bg-vault-900 border border-vault-700 px-3 py-2 outline-none focus:border-vault-accent";
  const button = "rounded-lg bg-vault-accent px-4 py-2 font-medium hover:bg-vault-accent-hover disabled:opacity-50";

  if (!initialized) {
    return <main className="p-6 text-slate-400">Loading...</main>;
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-vault-800 border border-vault-700 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-vault-accent">GameVault - Step 2 test</h1>

        {user ? (
          <div className="mt-6 space-y-4">
            <div className="rounded-lg bg-vault-900 p-4 text-sm">
              <p>Name: {user.name}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
            <div className="flex gap-3">
              <button className={button} onClick={testRefresh}>Test token refresh</button>
              <button className={button} onClick={() => dispatch(logoutUser())}>Logout</button>
            </div>
            {testResult && <p className="text-sm text-emerald-400">{testResult}</p>}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input className={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button className={button} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
            <p className="text-xs text-slate-500">Register a user first (see the test steps), then log in here.</p>
          </form>
        )}
      </div>
    </main>
  );
}

export default App;
