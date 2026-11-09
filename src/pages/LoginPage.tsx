import { useEffect, useState, type FormEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearError, loginUser } from "../store/authSlice";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const redirectTo = (location.state as { from?: string } | null)?.from ?? "/";

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!EMAIL_REGEX.test(email.trim())) next.email = "Please enter a valid email";
    if (!password) next.password = "Password is required";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(loginUser({ email: email.trim(), password }));
    if (loginUser.fulfilled.match(result)) navigate(redirectTo, { replace: true });
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-vault-700 bg-vault-800 p-8 shadow-xl">
      <h1 className="text-2xl font-bold">Welcome back</h1>
      <p className="mt-1 text-sm text-slate-400">Log in to review games and manage your backlog.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        {error && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-vault-accent px-4 py-2 font-medium hover:bg-vault-accent-hover disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        New here?{" "}
        <Link to="/register" className="text-vault-accent hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}

export default LoginPage;
