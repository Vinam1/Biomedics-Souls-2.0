/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import { ProductController } from './productController';
// import { PRODUCTS } from '../data/products';
import { useAuth } from './context/AuthContext';

export function useProductSeeder() {
  const { user, isAdmin, isAuthReady } = useAuth();

  useEffect(() => {
    if (!isAuthReady || !user || !isAdmin) return;

    const seedProducts = async () => {
      try {
        const products = await ProductController.getAll();
        if (products.length === 0) {
          console.log('No products found in DB. Please use the admin panel or DB initialization to add products.');
          /* 
          // Seeding disabled to optmize production build and because static data was removed
          for (const p of PRODUCTS) {
             ...
          }
          */
        }
      } catch (error) {
        console.error('Error checking products:', error);
      }
    };
    seedProducts();
  }, [user, isAdmin, isAuthReady]);
}
