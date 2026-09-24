"use client";

import Link from "next/link";

export default function ProductCard({
  product,
  onEdit,
  onDelete,
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="relative bg-slate-50">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-52 w-full object-cover"
          />
        ) : (
          <div className="flex h-52 items-center justify-center text-sm text-slate-400">
            No Image
          </div>
        )}

        <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold capitalize text-indigo-700 shadow-sm">
          {product.category}
        </span>
      </div>

      <div className="p-4">
        <h2 className="line-clamp-1 text-lg font-bold text-slate-900">
          {product.title}
        </h2>

        <div className="mt-3 grid grid-cols-3 gap-2">
          <div className="rounded-xl bg-slate-50 p-3">
            <p className="text-xs text-slate-400">
              Price
            </p>

            <p className="mt-1 font-bold text-slate-900">
              ${Number(product.price).toFixed(2)}
            </p>
          </div>

          <div className="rounded-xl bg-amber-50 p-3">
            <p className="text-xs text-amber-600">
              Rating
            </p>

            <p className="mt-1 font-bold text-amber-700">
              ★ {product.rating}
            </p>
          </div>

          <div className="rounded-xl bg-emerald-50 p-3">
            <p className="text-xs text-emerald-600">
              Stock
            </p>

            <p className="mt-1 font-bold text-emerald-700">
              {product.stock}
            </p>
          </div>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
          {product.description ||
            "No description available."}
        </p>

        <div className="mt-5 flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View
          </Link>

          <button
            type="button"
            onClick={() =>
              onEdit(product)
            }
            className="flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Edit
          </button>

          <button
            type="button"
            onClick={() =>
              onDelete(product.id)
            }
            className="flex-1 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}