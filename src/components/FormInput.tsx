import type { InputHTMLAttributes } from "react";

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function FormInput({ label, error, id, ...rest }: FormInputProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-slate-300">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        className={`w-full rounded-lg border bg-vault-900 px-3 py-2 outline-none focus:border-vault-accent ${
          error ? "border-red-500" : "border-vault-700"
        }`}
        {...rest}
      />
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
    </div>
  );
}

export default FormInput;
