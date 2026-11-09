import { GENRES, PLATFORMS } from "../utils/constants";

interface GameFiltersProps {
  search: string;
  genre: string;
  platform: string;
  onSearchChange: (value: string) => void;
  onGenreChange: (value: string) => void;
  onPlatformChange: (value: string) => void;
  onClear: () => void;
}

const fieldClass =
  "rounded-lg border border-vault-700 bg-vault-900 px-3 py-2 text-sm outline-none focus:border-vault-accent";

function GameFilters(props: GameFiltersProps) {
  const hasFilters = props.search || props.genre || props.platform;

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <input
        type="search"
        aria-label="Search games"
        placeholder="Search by title..."
        value={props.search}
        onChange={(e) => props.onSearchChange(e.target.value)}
        className={`${fieldClass} sm:flex-1`}
      />
      <select
        aria-label="Filter by genre"
        value={props.genre}
        onChange={(e) => props.onGenreChange(e.target.value)}
        className={fieldClass}
      >
        <option value="">All genres</option>
        {GENRES.map((genre) => (
          <option key={genre} value={genre}>{genre}</option>
        ))}
      </select>
      <select
        aria-label="Filter by platform"
        value={props.platform}
        onChange={(e) => props.onPlatformChange(e.target.value)}
        className={fieldClass}
      >
        <option value="">All platforms</option>
        {PLATFORMS.map((platform) => (
          <option key={platform} value={platform}>{platform}</option>
        ))}
      </select>
      {hasFilters && (
        <button
          type="button"
          onClick={props.onClear}
          className="rounded-lg border border-vault-700 px-3 py-2 text-sm hover:bg-vault-800"
        >
          Clear
        </button>
      )}
    </div>
  );
}

export default GameFilters;
