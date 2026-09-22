interface SearchEmptyStateProps {
  searchQuery: string;
  onClear: () => void;
}

export function SearchEmptyState({
  searchQuery,
  onClear,
}: SearchEmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
        <span aria-hidden="true" className="text-xl text-slate-400">
          ?
        </span>
      </div>

      <h2 className="mt-4 text-lg font-semibold text-slate-900">
        No results found
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
        No keywords or translations match{" "}
        <span className="font-medium text-slate-700">"{searchQuery}"</span>.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2"
      >
        Clear Search
      </button>
    </div>
  );
}
