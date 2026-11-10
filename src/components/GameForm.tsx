import { useState, type FormEvent } from "react";
import type { Game, GamePayload, Genre, Platform } from "../types";
import { GENRES, PLATFORMS } from "../utils/constants";
import { getErrorMessage } from "../utils/getErrorMessage";
import FormInput from "./FormInput";
import GameCover from "./GameCover";

interface GameFormProps {
  game?: Game;
  submitLabel: string;
  onSubmit: (payload: GamePayload) => Promise<void>;
  onCancel: () => void;
}

interface FormErrors {
  title?: string;
  genre?: string;
  platform?: string;
  releaseYear?: string;
  description?: string;
  coverImage?: string;
}

const MIN_YEAR = 1970;
const MAX_TITLE = 100;
const MAX_DESCRIPTION = 1000;

const fieldClass =
  "w-full rounded-lg border bg-vault-900 px-3 py-2 outline-none focus:border-vault-accent";

function GameForm({ game, submitLabel, onSubmit, onCancel }: GameFormProps) {
  const [title, setTitle] = useState(game?.title ?? "");
  const [genre, setGenre] = useState<Genre | "">(game?.genre ?? "");
  const [platform, setPlatform] = useState<Platform | "">(game?.platform ?? "");
  const [releaseYear, setReleaseYear] = useState(game ? String(game.releaseYear) : "");
  const [coverImage, setCoverImage] = useState(game?.coverImage ?? "");
  const [description, setDescription] = useState(game?.description ?? "");
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const validate = () => {
    const maxYear = new Date().getFullYear() + 2;
    const year = Number(releaseYear);
    const next: FormErrors = {};

    if (!title.trim()) next.title = "Title is required";
    else if (title.trim().length > MAX_TITLE) next.title = `Title cannot be longer than ${MAX_TITLE} characters`;
    if (!genre) next.genre = "Please choose a genre";
    if (!platform) next.platform = "Please choose a platform";
    if (!releaseYear || !Number.isInteger(year) || year < MIN_YEAR || year > maxYear) {
      next.releaseYear = `Enter a year between ${MIN_YEAR} and ${maxYear}`;
    }
    if (!description.trim()) next.description = "Description is required";
    if (coverImage.trim() && !/^https?:\/\/\S+$/i.test(coverImage.trim())) {
      next.coverImage = "Cover image must be a link starting with http:// or https://";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validate() || !genre || !platform) return;

    setSubmitting(true);
    setSubmitError(null);
    try {
      await onSubmit({
        title: title.trim(),
        genre,
        platform,
        releaseYear: Number(releaseYear),
        description: description.trim(),
        coverImage: coverImage.trim(),
      });
    } catch (err) {
      setSubmitError(typeof err === "string" ? err : getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="grid gap-8 md:grid-cols-[1fr_220px]">
      <div className="space-y-4">
        <FormInput
          id="title"
          label="Title"
          maxLength={MAX_TITLE}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={errors.title}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="genre" className="mb-1 block text-sm font-medium text-slate-300">Genre</label>
            <select
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value as Genre | "")}
              className={`${fieldClass} ${errors.genre ? "border-red-500" : "border-vault-700"}`}
            >
              <option value="">Select genre</option>
              {GENRES.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            {errors.genre && <p className="mt-1 text-sm text-red-400">{errors.genre}</p>}
          </div>

          <div>
            <label htmlFor="platform" className="mb-1 block text-sm font-medium text-slate-300">Platform</label>
            <select
              id="platform"
              value={platform}
              onChange={(e) => setPlatform(e.target.value as Platform | "")}
              className={`${fieldClass} ${errors.platform ? "border-red-500" : "border-vault-700"}`}
            >
              <option value="">Select platform</option>
              {PLATFORMS.map((value) => (
                <option key={value} value={value}>{value}</option>
              ))}
            </select>
            {errors.platform && <p className="mt-1 text-sm text-red-400">{errors.platform}</p>}
          </div>
        </div>

        <FormInput
          id="releaseYear"
          label="Release year"
          type="number"
          value={releaseYear}
          onChange={(e) => setReleaseYear(e.target.value)}
          error={errors.releaseYear}
        />

        <FormInput
          id="coverImage"
          label="Cover image URL (optional)"
          type="url"
          placeholder="https://..."
          value={coverImage}
          onChange={(e) => setCoverImage(e.target.value)}
          error={errors.coverImage}
        />

        <div>
          <label htmlFor="description" className="mb-1 block text-sm font-medium text-slate-300">Description</label>
          <textarea
            id="description"
            rows={5}
            maxLength={MAX_DESCRIPTION}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className={`${fieldClass} ${errors.description ? "border-red-500" : "border-vault-700"}`}
          />
          <div className="flex justify-between text-xs">
            <span className="text-red-400">{errors.description}</span>
            <span className="text-slate-500">{description.length}/{MAX_DESCRIPTION}</span>
          </div>
        </div>

        {submitError && (
          <p role="alert" className="rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {submitError}
          </p>
        )}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-vault-accent px-5 py-2 font-medium hover:bg-vault-accent-hover disabled:opacity-50"
          >
            {submitting ? "Saving..." : submitLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-vault-700 px-5 py-2 hover:bg-vault-800"
          >
            Cancel
          </button>
        </div>
      </div>

      <div>
        <p className="mb-1 text-sm font-medium text-slate-300">Cover preview</p>
        <GameCover
          key={coverImage}
          src={coverImage.trim()}
          title={title || "?"}
          className="aspect-3/4 w-full rounded-xl border border-vault-700"
        />
      </div>
    </form>
  );
}

export default GameForm;
