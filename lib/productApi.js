import api from "./api";

const CREATED_KEY = "createdProducts";
const UPDATED_KEY = "updatedProducts";
const DELETED_KEY = "deletedProductIds";

function getSessionData(key, fallback) {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    return JSON.parse(sessionStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function setSessionData(key, value) {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(key, JSON.stringify(value));
}

export async function getProducts({
  page = 1,
  limit = 10,
  search = "",
  category = "",
  sortBy = "",
  order = "asc",
  signal,
}) {
  const skip = (page - 1) * limit;

  let url = "/products";

  if (search) {
    url = "/products/search";
  } else if (category) {
    url = `/products/category/${category}`;
  }

  const response = await api.get(url, {
    params: {
      limit,
      skip,
      ...(search ? { q: search } : {}),
      ...(sortBy ? { sortBy, order } : {}),
    },
    signal,
  });

  return response.data;
}

export async function getCategories() {
  const response = await api.get("/products/categories");
  return response.data;
}

export async function getProduct(id) {
  const productId = Number(id);

  const deletedIds = getSessionData(DELETED_KEY, []);

  if (deletedIds.includes(productId)) {
    throw new Error(`Product with id '${productId}' not found`);
  }

  const createdProducts = getSessionData(CREATED_KEY, []);

  const createdProduct = createdProducts.find(
    (product) => Number(product.id) === productId
  );

  if (createdProduct) {
    return createdProduct;
  }

  const updatedProducts = getSessionData(UPDATED_KEY, []);

  const updatedProduct = updatedProducts.find(
    (product) => Number(product.id) === productId
  );

  if (updatedProduct) {
    return updatedProduct;
  }

  const response = await api.get(`/products/${productId}`);

  return response.data;
}

export async function addProduct(product) {
  const response = await api.post("/products/add", product);

  const createdProduct = response.data;

  const createdProducts = getSessionData(CREATED_KEY, []);

  createdProducts.unshift(createdProduct);

  setSessionData(CREATED_KEY, createdProducts);

  return createdProduct;
}

export async function updateProduct(id, product) {
  const productId = Number(id);

  const createdProducts = getSessionData(CREATED_KEY, []);

  const createdIndex = createdProducts.findIndex(
    (item) => Number(item.id) === productId
  );

  if (createdIndex !== -1) {
    const updatedProduct = {
      ...createdProducts[createdIndex],
      ...product,
      id: productId,
    };

    createdProducts[createdIndex] = updatedProduct;

    setSessionData(CREATED_KEY, createdProducts);

    return updatedProduct;
  }

  const response = await api.put(`/products/${productId}`, product);

  const updatedProduct = response.data;

  const updatedProducts = getSessionData(UPDATED_KEY, []);

  const existingIndex = updatedProducts.findIndex(
    (item) => Number(item.id) === productId
  );

  if (existingIndex !== -1) {
    updatedProducts[existingIndex] = updatedProduct;
  } else {
    updatedProducts.push(updatedProduct);
  }

  setSessionData(UPDATED_KEY, updatedProducts);

  return updatedProduct;
}

export async function deleteProduct(id) {
  const productId = Number(id);

  const createdProducts = getSessionData(CREATED_KEY, []);

  const isCreatedProduct = createdProducts.some(
    (item) => Number(item.id) === productId
  );

  if (isCreatedProduct) {
    const remainingProducts = createdProducts.filter(
      (item) => Number(item.id) !== productId
    );

    setSessionData(CREATED_KEY, remainingProducts);

    return {
      id: productId,
      isDeleted: true,
    };
  }

  const response = await api.delete(`/products/${productId}`);

  const deletedIds = getSessionData(DELETED_KEY, []);

  if (!deletedIds.includes(productId)) {
    deletedIds.push(productId);
  }

  setSessionData(DELETED_KEY, deletedIds);

  return response.data;
}