import { useState, useEffect, useCallback } from 'react';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
  updateProductVisibility,
} from '../services/productService';

/**
 * Custom hook for the Product Management page.
 * Manages product list, filters, CRUD, modal states, and categories.
 */
export function useProducts() {
  /* ── Product list ── */
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ── Categories (for form dropdowns) ── */
  const [categories, setCategories] = useState([]);

  /* ── Filters ── */
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  /* ── Modals / detail ── */
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [productToEdit, setProductToEdit] = useState(null);

  /* ── Fetch products ── */
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProducts({ search, category: categoryFilter, status: statusFilter });
      setProducts(data);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, [search, categoryFilter, statusFilter]);

  /* ── Fetch categories once on mount ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const cats = await getCategories();
        if (!cancelled) setCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── Fetch products when filters change ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getProducts({ search, category: categoryFilter, status: statusFilter });
        if (!cancelled) {
          setProducts(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err.message || 'Failed to load products');
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [search, categoryFilter, statusFilter]);

  /* ── View detail ── */
  const openDetail = useCallback(async (id) => {
    try {
      const product = await getProductById(id);
      setSelectedProduct(product);
      setDetailOpen(true);
    } catch (err) {
      console.error('Failed to load product:', err);
    }
  }, []);

  const closeDetail = useCallback(() => {
    setDetailOpen(false);
    setTimeout(() => setSelectedProduct(null), 300);
  }, []);

  /* ── Add product ── */
  const handleAdd = useCallback(async (formData) => {
    try {
      await createProduct(formData);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchProducts]);

  /* ── Edit product ── */
  const openEdit = useCallback(async (id) => {
    try {
      const product = await getProductById(id);
      setProductToEdit(product);
      setEditOpen(true);
    } catch (err) {
      console.error('Failed to load product for editing:', err);
    }
  }, []);

  const closeEdit = useCallback(() => {
    setEditOpen(false);
    setTimeout(() => setProductToEdit(null), 300);
  }, []);

  const handleEdit = useCallback(async (id, updates) => {
    try {
      await updateProduct(id, updates);
      await fetchProducts();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [fetchProducts]);

  /* ── Delete product ── */
  const openDeleteConfirm = useCallback((product) => {
    setProductToDelete(product);
    setDeleteOpen(true);
  }, []);

  const closeDelete = useCallback(() => {
    setDeleteOpen(false);
    setTimeout(() => setProductToDelete(null), 300);
  }, []);

  const handleDelete = useCallback(async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id);
      await fetchProducts();
      closeDelete();
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }, [productToDelete, fetchProducts, closeDelete]);

  /* ── Toggle product visibility (is_active) ── */
  const handleToggleVisibility = useCallback(async (id, newIsActive) => {
    // Optimistic update: flip the toggle immediately in local state
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, is_active: newIsActive, status: newIsActive && p.stock_quantity > 0
              ? (p.stock_quantity <= 10 ? 'low_stock' : 'in_stock')
              : (!newIsActive ? 'inactive' : 'out_of_stock') }
          : p
      )
    );

    try {
      await updateProductVisibility(id, newIsActive);
      return { success: true };
    } catch (err) {
      // Revert on failure
      setProducts((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, is_active: !newIsActive }
            : p
        )
      );
      return { success: false, error: err.message };
    }
  }, []);

  return {
    products,
    loading,
    error,
    categories,
    // Filters
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    // Detail
    selectedProduct,
    detailOpen,
    openDetail,
    closeDetail,
    // Add
    addOpen,
    setAddOpen,
    handleAdd,
    // Edit
    productToEdit,
    editOpen,
    openEdit,
    closeEdit,
    handleEdit,
    // Delete
    productToDelete,
    deleteOpen,
    openDeleteConfirm,
    closeDelete,
    handleDelete,
    // Visibility
    handleToggleVisibility,
  };
}
