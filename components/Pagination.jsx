"use client";

export default function Pagination({
  page,
  totalPages,
  onPageChange,
}) {
  const pageNumbers = [];

  const start = Math.max(1, page - 2);
  const end = Math.min(
    totalPages,
    page + 2
  );

  for (
    let i = start;
    i <= end;
    i++
  ) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      <button
        type="button"
        disabled={page === 1}
        onClick={() =>
          onPageChange(page - 1)
        }
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        ← Previous
      </button>

      {start > 1 && (
        <>
          <button
            type="button"
            onClick={() =>
              onPageChange(1)
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            1
          </button>

          {start > 2 && (
            <span className="px-1 text-slate-400">
              ...
            </span>
          )}
        </>
      )}

      {pageNumbers.map(
        (pageNumber) => (
          <button
            key={pageNumber}
            type="button"
            onClick={() =>
              onPageChange(
                pageNumber
              )
            }
            className={`h-10 min-w-10 rounded-xl px-3 text-sm font-bold transition ${
              pageNumber === page
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            }`}
          >
            {pageNumber}
          </button>
        )
      )}

      {end < totalPages && (
        <>
          {end < totalPages - 1 && (
            <span className="px-1 text-slate-400">
              ...
            </span>
          )}

          <button
            type="button"
            onClick={() =>
              onPageChange(
                totalPages
              )
            }
            className="rounded-xl border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() =>
          onPageChange(page + 1)
        }
        className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Next →
      </button>
    </div>
  );
}