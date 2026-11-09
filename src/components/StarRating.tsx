import { useState } from "react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: string;
}

const STARS = [1, 2, 3, 4, 5];

function StarRating({ value, onChange, size = "text-xl" }: StarRatingProps) {
  const [hover, setHover] = useState(0);

  if (!onChange) {
    const filled = Math.round(value);
    return (
      <span role="img" aria-label={`Rated ${value} out of 5`} className={size}>
        <span className="text-amber-400">{"★".repeat(filled)}</span>
        <span className="text-vault-700">{"★".repeat(5 - filled)}</span>
      </span>
    );
  }

  const active = hover || value;

  return (
    <div role="radiogroup" aria-label="Rating" className="flex" onMouseLeave={() => setHover(0)}>
      {STARS.map((star) => (
        <button
          key={star}
          type="button"
          role="radio"
          aria-checked={value === star}
          aria-label={`${star} star${star > 1 ? "s" : ""}`}
          onClick={() => onChange(star)}
          onMouseEnter={() => setHover(star)}
          className={`${size} transition ${star <= active ? "text-amber-400" : "text-vault-700"}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default StarRating;
