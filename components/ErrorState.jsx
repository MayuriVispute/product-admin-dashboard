export default function ErrorState({ message, onRetry }) {
  return (
    <div className="rounded-xl bg-red-50 p-8 text-center">
      <h2 className="mb-2 text-lg font-semibold text-red-700">
        Something went wrong
      </h2>

      <p className="mb-4 text-sm text-red-600">
        {message || "Unable to load data."}
      </p>

      <button
        onClick={onRetry}
        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
      >
        Retry
      </button>
    </div>
  );
}