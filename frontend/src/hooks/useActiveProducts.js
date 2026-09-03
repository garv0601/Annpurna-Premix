/**
 * useActiveProducts
 *
 * Fetches only active (is_active = true) products from Supabase.
 * Maps DB column names to the shape that ShopPage / ShopProductCard expects.
 *
 * Field mapping:
 *   DB             → UI
 *   image_url      → image
 *   short_description → shortDescription
 *   categories.name → category
 *   is_bestseller  → badge ('Bestseller' | null, merged with is_featured → 'New')
 *   (no packSize / currency in DB — use sensible defaults)
 */

import { useState, useEffect, useCallback } from 'react';
import supabase from '../lib/supabase';

/**
 * Derive a simple badge string from product flags.
 * Keeps parity with the static mock data badge field.
 */
function deriveBadge(row) {
  if (row.is_bestseller) return 'Bestseller';
  if (row.is_featured)   return 'New';
  return null;
}

/**
 * Map a raw Supabase products row → the shape ShopProductCard expects.
 */
function mapProductForShop(row) {
  const categoryData = row.categories; // { id, name, slug }
  return {
    // Identity
    id:               row.id,
    slug:             row.slug,
    // Display
    name:             row.name,
    shortDescription: row.short_description || '',
    category:         categoryData?.name || '',
    image:            row.image_url || '',
    // Pricing
    price:            Number(row.price) || 0,
    currency:         '₹',
    packSize:         row.servings ? `${row.weight || ''} (${row.servings})`.trim() : (row.weight || ''),
    // Badges
    badge:            deriveBadge(row),
    // Inventory — used for sold-out detection
    stock_quantity:   row.stock_quantity ?? 0,
    // Visibility (already guaranteed true by the query, but kept for safety)
    is_active:        row.is_active,
    // Extra
    is_featured:      row.is_featured,
    is_bestseller:    row.is_bestseller,
  };
}

/**
 * Hook: returns only active products from the DB.
 * Falls back to an empty array if Supabase is not configured.
 */
export function useActiveProducts() {
  const [products, setProducts]   = useState([]);
  const [loading,  setLoading]    = useState(true);
  const [error,    setError]      = useState(null);

  const fetchActive = useCallback(async () => {
    // Guard: Supabase client may be null when env vars are missing
    if (!supabase) {
      console.warn('[useActiveProducts] Supabase not configured — returning empty list.');
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: sbError } = await supabase
        .from('products')
        .select(`
          id,
          slug,
          name,
          short_description,
          price,
          weight,
          servings,
          image_url,
          stock_quantity,
          is_active,
          is_featured,
          is_bestseller,
          categories ( id, name, slug )
        `)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;

      setProducts((data || []).map(mapProductForShop));
    } catch (err) {
      console.error('[useActiveProducts] fetch error:', err);
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  return { products, loading, error, refetch: fetchActive };
}

/**
 * Hook: returns active + featured products for the Home page Featured section.
 *
 * Filters: is_active = true AND is_featured = true
 *
 * Reuses mapProductForShop so product shape is identical to ShopPage cards.
 * Falls back to an empty array if Supabase is not configured.
 */
export function useFeaturedProducts() {
  const [products, setProducts] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const fetchFeatured = useCallback(async () => {
    if (!supabase) {
      console.warn('[useFeaturedProducts] Supabase not configured — returning empty list.');
      setProducts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const { data, error: sbError } = await supabase
        .from('products')
        .select(`
          id,
          slug,
          name,
          short_description,
          price,
          weight,
          servings,
          image_url,
          stock_quantity,
          is_active,
          is_featured,
          is_bestseller,
          categories ( id, name, slug )
        `)
        .eq('is_active',  true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (sbError) throw sbError;

      setProducts((data || []).map(mapProductForShop));
    } catch (err) {
      console.error('[useFeaturedProducts] fetch error:', err);
      setError(err.message || 'Failed to load featured products');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeatured();
  }, [fetchFeatured]);

  return { products, loading, error, refetch: fetchFeatured };
}
