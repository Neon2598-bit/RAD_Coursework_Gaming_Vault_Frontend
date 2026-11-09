interface PaginationProps {
  page: number;
  pages: number;
  onChange: (page: number) => void;
}

function Pagination({ page, pages, onChange }: PaginationProps) {
  if (pages <= 1) return null;

  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const end = Math.min(pages, start + 4);
  const numbers: number[] = [];
  for (let i = start; i <= end; i++) numbers.push(i);

  const base = "rounded-lg border px-3 py-1.5 text-sm transition disabled:cursor-not-allowed disabled:opacity-40";

  return (
    <nav aria-label="Pagination" className="mt-8 flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className={`${base} border-vault-700 hover:bg-vault-800`}
      >
        Previous
      </button>
      {numbers.map((number) => (
        <button
          key={number}
          type="button"
          aria-current={number === page ? "page" : undefined}
          onClick={() => onChange(number)}
          className={`${base} ${
            number === page
              ? "border-vault-accent bg-vault-accent"
              : "border-vault-700 hover:bg-vault-800"
          }`}
        >
          {number}
        </button>
      ))}
      <button
        type="button"
        disabled={page >= pages}
        onClick={() => onChange(page + 1)}
        className={`${base} border-vault-700 hover:bg-vault-800`}
      >
        Next
      </button>
    </nav>
  );
}

export default Pagination;
