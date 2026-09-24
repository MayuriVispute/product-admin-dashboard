"use client";

import Link from "next/link";

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}) {
  return (
    <table className="w-full border-collapse">
      <thead>
        <tr className="border-b border-slate-200 bg-slate-50">
          <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            Product
          </th>

          <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            Category
          </th>

          <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            Price
          </th>

          <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            Rating
          </th>

          <th className="px-4 py-4 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
            Stock
          </th>

          <th className="px-4 py-4 text-right text-xs font-bold uppercase tracking-wide text-slate-500">
            Actions
          </th>
        </tr>
      </thead>

      <tbody>
        {products.map(
          (product) => (
            <tr
              key={product.id}
              className="border-b border-slate-100 transition hover:bg-slate-50"
            >
              <td className="px-5 py-4">
                <div className="flex items-center gap-3">
                  {product.thumbnail ? (
                    <img
                      src={
                        product.thumbnail
                      }
                      alt={
                        product.title
                      }
                      className="h-14 w-14 rounded-xl border border-slate-200 bg-slate-50 object-cover"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-slate-100 text-xs text-slate-400">
                      No image
                    </div>
                  )}

                  <div className="min-w-0">
                    <p className="max-w-[220px] truncate font-semibold text-slate-900">
                      {product.title}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      ID #{product.id}
                    </p>
                  </div>
                </div>
              </td>

              <td className="px-4 py-4">
                <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold capitalize text-indigo-700">
                  {product.category}
                </span>
              </td>

              <td className="px-4 py-4 font-bold text-slate-900">
                ${Number(product.price).toFixed(2)}
              </td>

              <td className="px-4 py-4">
                <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2.5 py-1.5 text-sm font-semibold text-amber-700">
                  ★ {product.rating ?? "N/A"}
                </span>
              </td>

              <td className="px-4 py-4">
                <span
                  className={`font-semibold ${
                    Number(
                      product.stock
                    ) > 20
                      ? "text-emerald-600"
                      : "text-orange-600"
                  }`}
                >
                  {product.stock}
                </span>
              </td>

              <td className="px-4 py-4">
                <div className="flex justify-end gap-2">
                  <Link
                    href={`/products/${product.id}`}
                    className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                  >
                    View
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      onEdit(product)
                    }
                    className="rounded-lg bg-blue-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-blue-700"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      onDelete(
                        product.id
                      )
                    }
                    className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          )
        )}
      </tbody>
    </table>
  );
}