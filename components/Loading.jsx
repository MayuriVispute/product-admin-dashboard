export default function Loading({ text = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />
        <p className="text-sm text-slate-500">{text}</p>
      </div>
    </div>
  );
}