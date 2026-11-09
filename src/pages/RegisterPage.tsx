import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormInput from "../components/FormInput";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { clearError, registerUser } from "../store/authSlice";

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

function RegisterPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { loading, error } = useAppSelector((state) => state.auth);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleChange = (field: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const validate = () => {
    const next: FormErrors = {};
    if (!form.name.trim()) next.name = "Name is required";
    if (!EMAIL_REGEX.test(form.email.trim())) next.email = "Please enter a valid email";
    if (form.password.length < 6) next.password = "Password must be at least 6 characters";
    if (form.confirmPassword !== form.password) next.confirmPassword = "Passwords do not match";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const result = await dispatch(
      registerUser({ name: form.name.trim(), email: form.email.trim(), password: form.password })
    );
    if (registerUser.fulfilled.match(result)) navigate("/", { replace: true });
  };

  return (
    <div className="mx-auto max-w-md rounded-2xl border border-vault-700 bg-vault-800 p-8 shadow-xl">
      <h1 className="text-2xl font-bold">Create your account</h1>
      <p className="mt-1 text-sm text-slate-400">Join GameVault and start tracking your games.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <FormInput
          id="name"
          label="Name"
          autoComplete="name"
          value={form.name}
          onChange={handleChange("name")}
          error={errors.name}
        />
        <FormInput
          id="email"
          label="Email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={handleChange("email")}
          error={errors.email}
        />
        <FormInput
          id="password"
          label="Password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange("password")}
          error={errors.password}
        />
        <FormInput
          id="confirmPassword"
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={handleChange("confirmPassword")}
          error={errors.confirmPassword}
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
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link to="/login" className="text-vault-accent hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
