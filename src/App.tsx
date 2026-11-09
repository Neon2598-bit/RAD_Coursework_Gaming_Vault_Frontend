import { useEffect, useState } from "react";
import api from "./api/axios";

type Status = "checking" | "online" | "offline";

function App() {
  const [status, setStatus] = useState<Status>("checking");
  const [message, setMessage] = useState("");

  useEffect(() => {
    api
      .get<{ success: boolean; message: string }>("/health")
      .then((res) => {
        setMessage(res.data.message);
        setStatus("online");
      })
      .catch(() => setStatus("offline"));
  }, []);

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-2xl bg-vault-800 border border-vault-700 p-8 text-center shadow-xl">
        <h1 className="text-3xl font-bold text-vault-accent">GameVault</h1>
        <p className="mt-2 text-slate-400">Game review and backlog tracker</p>

        <div className="mt-6 rounded-lg bg-vault-900 p-4 text-sm">
          {status === "checking" && <p className="text-slate-400">Checking backend...</p>}
          {status === "online" && <p className="text-emerald-400">Backend connected: {message}</p>}
          {status === "offline" && (
            <p className="text-red-400">
              Cannot reach the backend. Is it running on the URL in your .env file?
            </p>
          )}
        </div>
      </div>
    </main>
  );
}

export default App;
