"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  Suspense,
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  deleteProduct,
  getCategories,
  getProducts,
} from "../../lib/productApi";

import ConfirmModal from "../../components/ConfirmModal";
import ErrorState from "../../components/ErrorState";
import Loading from "../../components/Loading";
import Pagination from "../../components/Pagination";
import ProductCard from "../../components/ProductCard";
import ProductForm from "../../components/ProductForm";
import ProductTable from "../../components/ProductTable";

function DashboardContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageParam = Number(searchParams.get("page"));
  const limitParam = Number(searchParams.get("limit"));

  const page =
    Number.isInteger(pageParam) && pageParam > 0
      ? pageParam
      : 1;

  const limit = [10, 20, 50].includes(limitParam)
    ? limitParam
    : 10;

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sortBy = searchParams.get("sortBy") || "";
  const order = searchParams.get("order") || "asc";

  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);

  const [categories, setCategories] = useState([]);
  const [searchInput, setSearchInput] = useState(search);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [deleteProductId, setDeleteProductId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const totalPages = Math.max(
    1,
    Math.ceil(total / limit)
  );

  function updateUrl(values) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    Object.entries(values).forEach(([key, value]) => {
      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });

    router.push(
      `${pathname}?${params.toString()}`
    );
  }

  const loadProducts = useCallback(
    async (signal) => {
      try {
        setLoading(true);
        setError("");

        const result = await getProducts({
          page,
          limit,
          search,
          category,
          sortBy,
          order,
          signal,
        });

        setProducts(result.products || []);
        setTotal(result.total || 0);
      } catch (err) {
        if (
          err.name === "CanceledError" ||
          err.name === "AbortError"
        ) {
          return;
        }

        setError(
          err.message ||
            "Unable to load products."
        );
      } finally {
        setLoading(false);
      }
    },
    [
      page,
      limit,
      search,
      category,
      sortBy,
      order,
    ]
  );

  useEffect(() => {
    const controller =
      new AbortController();

    loadProducts(controller.signal);

    return () => {
      controller.abort();
    };
  }, [loadProducts]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const result = await getCategories();

        setCategories(result || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadCategories();
  }, []);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = searchInput.trim();

      if (value !== search) {
        updateUrl({
          search: value,
          page: 1,
        });
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput, search]);

  useEffect(() => {
    if (
      total > 0 &&
      page > totalPages
    ) {
      updateUrl({
        page: totalPages,
      });
    }
  }, [page, totalPages, total]);

  function handleCategoryChange(event) {
    updateUrl({
      category: event.target.value,
      search: "",
      page: 1,
    });
  }

  function handleSortChange(event) {
    const value = event.target.value;

    updateUrl({
      sortBy: value,
      order: value ? "asc" : "",
      page: 1,
    });
  }

  function handleOrderChange(event) {
    updateUrl({
      order: event.target.value,
      page: 1,
    });
  }

  function handleLimitChange(newLimit) {
    updateUrl({
      limit: newLimit,
      page: 1,
    });
  }

  function handlePageChange(newPage) {
    if (
      newPage < 1 ||
      newPage > totalPages
    ) {
      return;
    }

    updateUrl({
      page: newPage,
    });
  }

  function handleAddClick() {
    setEditingProduct(null);
    setShowForm(true);
  }

  function handleEditClick(product) {
    setEditingProduct(product);
    setShowForm(true);
  }

  function handleFormSuccess(result) {
    if (editingProduct) {
      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          Number(product.id) ===
          Number(result.id)
            ? {
                ...product,
                ...result,
              }
            : product
        )
      );
    } else {
      const newProduct = {
        ...result,
        id: result.id || Date.now(),
      };

      setProducts((currentProducts) => [
        newProduct,
        ...currentProducts,
      ]);

      setTotal(
        (currentTotal) =>
          currentTotal + 1
      );
    }

    setShowForm(false);
    setEditingProduct(null);
  }

  function handleDeleteClick(productId) {
    setDeleteProductId(productId);
  }

  async function handleDeleteConfirm() {
    if (deleteProductId === null) {
      return;
    }

    try {
      setDeleteLoading(true);
      setError("");

      await deleteProduct(
        deleteProductId
      );

      setProducts((currentProducts) =>
        currentProducts.filter(
          (product) =>
            Number(product.id) !==
            Number(deleteProductId)
        )
      );

      setTotal((currentTotal) =>
        Math.max(
          0,
          currentTotal - 1
        )
      );

      setDeleteProductId(null);
    } catch (err) {
      setError(
        err.message ||
          "Unable to delete product."
      );
    } finally {
      setDeleteLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem(
      "accessToken"
    );
    localStorage.removeItem("user");

    router.replace("/login");
  }

  const showingStart =
    total === 0
      ? 0
      : (page - 1) * limit + 1;

  const showingEnd =
    total === 0
      ? 0
      : Math.min(
          page * limit,
          total
        );

  return (
    <main className="min-h-screen bg-slate-50">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-lg font-bold text-white shadow-md">
              P
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                Product Admin
              </h1>

              <p className="text-xs text-slate-500">
                Dashboard
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:py-8">
        {/* PAGE INTRO */}
        <div className="mb-7 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-1 text-sm font-semibold text-blue-600">
              ADMIN PANEL
            </p>

            <h2 className="text-3xl font-bold tracking-tight text-slate-900">
              Products
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              View, search, edit and manage your products.
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddClick}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <span className="text-lg">+</span>
            Add Product
          </button>
        </div>

        {/* STAT CARDS */}
        <div className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Products
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {total}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                📦
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Current Page
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {page}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-xl">
                📄
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Showing
                </p>

                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {showingStart}-{showingEnd}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-xl">
                ✓
              </div>
            </div>
          </div>
        </div>

        {/* FILTER PANEL */}
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4">
            <h3 className="text-sm font-bold text-slate-900">
              Search & Filters
            </h3>

            <p className="text-xs text-slate-500">
              Find and sort products quickly.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
            {/* SEARCH */}
            <div className="xl:col-span-2">
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Search
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                  🔍
                </span>

                <input
                  type="text"
                  value={searchInput}
                  onChange={(event) =>
                    setSearchInput(
                      event.target.value
                    )
                  }
                  placeholder="Search products..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>

            {/* CATEGORY */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Category
              </label>

              <select
                value={category}
                onChange={handleCategoryChange}
                disabled={Boolean(search)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">
                  All Categories
                </option>

                {categories.map(
                  (item) => (
                    <option
                      key={
                        item.slug ||
                        item
                      }
                      value={
                        item.slug ||
                        item
                      }
                    >
                      {item.name ||
                        item}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* SORT */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Sort By
              </label>

              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value="">
                  Default
                </option>

                <option value="title">
                  Title
                </option>

                <option value="price">
                  Price
                </option>

                <option value="rating">
                  Rating
                </option>
              </select>
            </div>

            {/* PAGE SIZE */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Page Size
              </label>

              <select
                value={limit}
                onChange={(event) =>
                  handleLimitChange(
                    Number(
                      event.target.value
                    )
                  )
                }
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
              >
                <option value={10}>
                  10 per page
                </option>

                <option value={20}>
                  20 per page
                </option>

                <option value={50}>
                  50 per page
                </option>
              </select>
            </div>
          </div>

          {/* ORDER */}
          {sortBy && (
            <div className="mt-3 flex justify-end">
              <select
                value={order}
                onChange={handleOrderChange}
                className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              >
                <option value="asc">
                  ↑ Ascending
                </option>

                <option value="desc">
                  ↓ Descending
                </option>
              </select>
            </div>
          )}
        </div>

        {/* ACTIVE SEARCH */}
        {(search || category) && (
          <div className="mb-5 flex flex-wrap items-center gap-2">
            {search && (
              <span className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700">
                Search: {search}
              </span>
            )}

            {category && (
              <span className="rounded-full bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                Category: {category}
              </span>
            )}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="mb-5">
            <ErrorState
              message={error}
              onRetry={() =>
                loadProducts()
              }
            />
          </div>
        )}

        {/* CONTENT */}
        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 shadow-sm">
            <Loading />
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl">
              🔍
            </div>

            <h3 className="mt-5 text-lg font-bold text-slate-900">
              No products found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Try another search term or change the category and sorting filters.
            </p>
          </div>
        ) : (
          <>
            {/* DESKTOP */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
              <ProductTable
                products={products}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            </div>

            {/* MOBILE */}
            <div className="grid gap-4 md:hidden">
              {products.map(
                (product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onEdit={
                      handleEditClick
                    }
                    onDelete={
                      handleDeleteClick
                    }
                  />
                )
              )}
            </div>

            {/* FOOTER */}
            <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-4 flex flex-col gap-2 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Showing{" "}
                  <span className="font-bold text-slate-900">
                    {showingStart}
                  </span>
                  -
                  <span className="font-bold text-slate-900">
                    {showingEnd}
                  </span>{" "}
                  of{" "}
                  <span className="font-bold text-slate-900">
                    {total}
                  </span>
                </p>

                <p className="text-xs text-slate-400">
                  Page {page} of{" "}
                  {totalPages}
                </p>
              </div>

              <Pagination
                page={page}
                totalPages={totalPages}
                limit={limit}
                onPageChange={
                  handlePageChange
                }
                onLimitChange={
                  handleLimitChange
                }
              />
            </div>
          </>
        )}
      </div>

      {/* ADD / EDIT */}
      {showForm && (
        <ProductForm
          product={editingProduct}
          onSuccess={
            handleFormSuccess
          }
          onCancel={() => {
            setShowForm(false);
            setEditingProduct(null);
          }}
        />
      )}

      {/* DELETE */}
      {deleteProductId !== null && (
        <ConfirmModal
          title="Delete Product"
          message="Are you sure you want to delete this product? This action cannot be undone."
          loading={deleteLoading}
          onConfirm={
            handleDeleteConfirm
          }
          onCancel={() =>
            setDeleteProductId(null)
          }
        />
      )}
    </main>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<Loading />}>
      <DashboardContent />
    </Suspense>
  );
}