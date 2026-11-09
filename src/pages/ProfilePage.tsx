import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deactivateAccount } from "../store/authSlice";

function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, error } = useAppSelector((state) => state.auth);
  const [confirming, setConfirming] = useState(false);

  if (!user) return null;

  const handleDeactivate = async () => {
    const result = await dispatch(deactivateAccount());
    if (deactivateAccount.fulfilled.match(result)) navigate("/login", { replace: true });
  };

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <h1 className="text-2xl font-bold">My profile</h1>

      <div className="rounded-2xl border border-vault-700 bg-vault-800 p-6">
        <dl className="space-y-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-slate-400">Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Email</dt>
            <dd>{user.email}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-slate-400">Role</dt>
            <dd className="capitalize">{user.role}</dd>
          </div>
        </dl>
      </div>

      <div className="rounded-2xl border border-red-500/30 bg-vault-800 p-6">
        <h2 className="font-semibold text-red-400">Deactivate account</h2>
        <p className="mt-1 text-sm text-slate-400">
          Your account and reviews will be hidden. You can log in again at any time to reactivate it.
        </p>
        {error && <p className="mt-3 text-sm text-red-400">{error}</p>}

        {confirming ? (
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={handleDeactivate}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium hover:bg-red-700"
            >
              Yes, deactivate
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-lg border border-vault-700 px-4 py-2 text-sm hover:bg-vault-700"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            className="mt-4 rounded-lg border border-red-500/50 px-4 py-2 text-sm text-red-400 hover:bg-red-500/10"
          >
            Deactivate account
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
