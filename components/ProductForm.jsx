"use client";

import { useState } from "react";
import { addProduct, updateProduct } from "../lib/productApi";

export default function ProductForm({ product, onSuccess, onCancel }) {
  const isEdit = Boolean(product);

  const [form, setForm] = useState({
    title: product?.title || "",
    price: product?.price || "",
    category: product?.category || "",
    stock: product?.stock || "",
    description: product?.description || "",
    thumbnail: product?.thumbnail || "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function validate() {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = "Title is required.";
    }

    if (!form.category.trim()) {
      newErrors.category = "Category is required.";
    }

    if (form.price === "" || Number(form.price) < 0) {
      newErrors.price = "Enter a valid price.";
    }

    if (form.stock === "" || Number(form.stock) < 0) {
      newErrors.stock = "Enter a valid stock.";
    }

    if (!form.description.trim()) {
      newErrors.description = "Description is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) return;

    if (!validate()) return;

    try {
      setLoading(true);

      const payload = {
        title: form.title.trim(),
        price: Number(form.price),
        category: form.category.trim(),
        stock: Number(form.stock),
        description: form.description.trim(),
        thumbnail: form.thumbnail.trim(),
      };

      let result;

      if (isEdit) {
        result = await updateProduct(product.id, payload);
      } else {
        result = await addProduct(payload);
      }

      onSuccess(result);
    } catch (error) {
      setErrors({
        form: error.message || "Unable to save product.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto bg-black/50 p-4">
      <div className="mx-auto my-8 max-w-2xl rounded-xl bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold">
            {isEdit ? "Edit Product" : "Add Product"}
          </h2>

          <button
            onClick={onCancel}
            className="text-xl text-slate-500"
          >
            ×
          </button>
        </div>

        {errors.form && (
          <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Title
            </label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />

            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Price
              </label>

              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />

              {errors.price && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.price}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Stock
              </label>

              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                className="w-full rounded-lg border px-3 py-2"
              />

              {errors.stock && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.stock}
                </p>
              )}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Category
            </label>

            <input
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />

            {errors.category && (
              <p className="mt-1 text-xs text-red-600">
                {errors.category}
              </p>
            )}
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Image URL
            </label>

            <input
              name="thumbnail"
              value={form.thumbnail}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Description
            </label>

            <textarea
              name="description"
              rows="4"
              value={form.description}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
            />

            {errors.description && (
              <p className="mt-1 text-xs text-red-600">
                {errors.description}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border px-5 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-5 py-2 text-white disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : isEdit
                  ? "Update Product"
                  : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}