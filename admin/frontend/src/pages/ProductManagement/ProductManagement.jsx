import React from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import { useProducts } from '../../hooks/useProducts';
import ProductFilters from '../../components/products/ProductFilters';
import ProductList from '../../components/products/ProductList';
import ProductDetails from '../../components/products/ProductDetails';
import AddProductModal from '../../components/products/AddProductModal';
import EditProductModal from '../../components/products/EditProductModal';
import DeleteProductDialog from '../../components/products/DeleteProductDialog';
import './ProductManagement.css';

export default function ProductManagement() {
  const {
    products,
    loading,
    error,
    categories,
    search,
    setSearch,
    categoryFilter,
    setCategoryFilter,
    statusFilter,
    setStatusFilter,
    selectedProduct,
    detailOpen,
    openDetail,
    closeDetail,
    addOpen,
    setAddOpen,
    handleAdd,
    productToEdit,
    editOpen,
    openEdit,
    closeEdit,
    handleEdit,
    productToDelete,
    deleteOpen,
    openDeleteConfirm,
    closeDelete,
    handleDelete,
    handleToggleVisibility,
  } = useProducts();

  if (loading && products.length === 0) {
    return (
      <div className="pm-loading">
        <div className="loading-spinner" />
        <p>Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pm-error">
        <p>Something went wrong: {error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className="product-management-page"
      id="admin-products"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
    >
      {/* ── Page Header ── */}
      <div className="pm-header">
        <div className="pm-header-left">
          <h1 className="pm-title">Product Management</h1>
          <p className="pm-subtitle">Manage your premix inventory and catalog.</p>
        </div>
        <div className="pm-header-actions">
          <motion.button
            className="pm-add-btn"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setAddOpen(true)}
          >
            <Plus size={16} /> Add New Product
          </motion.button>
        </div>
      </div>

      {/* ── Filters ── */}
      <ProductFilters
        search={search}
        onSearchChange={setSearch}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        categories={categories}
      />

      {/* ── Product List ── */}
      <ProductList
        products={products}
        onView={openDetail}
        onEdit={openEdit}
        onDelete={openDeleteConfirm}
        onToggleVisibility={handleToggleVisibility}
      />

      {/* ── Modals & Drawers ── */}
      <ProductDetails
        product={selectedProduct}
        isOpen={detailOpen}
        onClose={closeDetail}
      />

      <AddProductModal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        onSubmit={handleAdd}
        categories={categories}
      />

      <EditProductModal
        product={productToEdit}
        isOpen={editOpen}
        onClose={closeEdit}
        onSubmit={handleEdit}
        categories={categories}
      />

      <DeleteProductDialog
        product={productToDelete}
        isOpen={deleteOpen}
        onClose={closeDelete}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
