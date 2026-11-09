import { useState } from "react";

interface GameCoverProps {
  src: string;
  title: string;
  className?: string;
}

function GameCover({ src, title, className = "" }: GameCoverProps) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={`flex items-center justify-center bg-linear-to-br from-vault-700 to-vault-900 text-4xl font-bold text-vault-accent ${className}`}
        aria-label={title}
      >
        {title.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={title}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}

export default GameCover;
