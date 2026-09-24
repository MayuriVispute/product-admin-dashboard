"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import ErrorState from "../../../components/ErrorState";
import Loading from "../../../components/Loading";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { getProduct } from "../../../lib/productApi";

export default function ProductDetailsPage() {
  return (
    <ProtectedRoute>
      <ProductDetails />
    </ProtectedRoute>
  );
}

function ProductDetails() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const id = Number(params.id);

    if (!Number.isInteger(id) || id <= 0) {
      setError("Product not found.");
      setLoading(false);
      return;
    }

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProduct(id);

        setProduct(data);
      } catch (error) {
        setError(error.message || "Product not found.");
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [params.id]);

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    router.replace("/login");
  }

  if (loading) {
    return <Loading text="Loading product..." />;
  }

  if (error || !product) {
    return (
      <main className="min-h-screen bg-slate-100 p-6">
        <div className="mx-auto max-w-3xl">
          <ErrorState
            message="Product not found."
            onRetry={() => router.push("/dashboard")}
          />

          <div className="mt-4 text-center">
            <Link
              href="/dashboard"
              className="text-blue-600 hover:underline"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-6xl justify-between px-4 py-4">
          <Link
            href="/dashboard"
            className="font-semibold text-blue-600"
          >
            ← Dashboard
          </Link>

          <button
            onClick={logout}
            className="rounded-lg border px-4 py-2 text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-6xl p-4 md:p-8">
        <div className="grid gap-8 rounded-xl border bg-white p-6 shadow-sm md:grid-cols-2">
          <div>
            <img
              src={product.images?.[0] || product.thumbnail}
              alt={product.title}
              className="h-[400px] w-full rounded-xl object-contain"
            />

            {product.images?.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto">
                {product.images.map((image) => (
                  <img
                    key={image}
                    src={image}
                    alt={product.title}
                    className="h-20 w-20 rounded-lg border object-cover"
                  />
                ))}
              </div>
            )}
          </div>

          <div>
            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-600">
              {product.category}
            </span>

            <h1 className="mt-4 text-3xl font-bold">
              {product.title}
            </h1>

            <p className="mt-4 text-slate-600">
              {product.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Price</p>
                <p className="text-xl font-bold">
                  ${product.price}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Rating</p>
                <p className="text-xl font-bold">
                  ⭐ {product.rating}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Stock</p>
                <p className="text-xl font-bold">
                  {product.stock}
                </p>
              </div>

              <div className="rounded-lg bg-slate-50 p-4">
                <p className="text-xs text-slate-500">Brand</p>
                <p className="font-bold">
                  {product.brand || "N/A"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">Reviews</h2>

          <div className="mt-4 space-y-4">
            {product.reviews?.length ? (
              product.reviews.map((review, index) => (
                <div
                  key={`${review.reviewerEmail}-${index}`}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between">
                    <p className="font-semibold">
                      {review.reviewerName}
                    </p>

                    <p>⭐ {review.rating}</p>
                  </div>

                  <p className="mt-1 text-sm text-slate-600">
                    {review.comment}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">
                No reviews available.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}