/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Product, ProductImage, Review, Category, ProductFormat, Tag } from '../models/types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, updateDoc, 
  deleteDoc, query, where, orderBy, limit, serverTimestamp 
} from 'firebase/firestore';

export const ProductController = {
  // Products
  async getAll(): Promise<Product[]> {
    const path = 'productos';
    try {
      const q = query(collection(db, 'productos'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  async getById(id: string | number): Promise<Product | null> {
    const path = `productos/${id}`;
    try {
      const docSnap = await getDoc(doc(db, 'productos', String(id)));
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async save(product: Product): Promise<void> {
    const path = `productos/${product.id}`;
    try {
      const productRef = doc(db, 'productos', product.id);
      const data = { ...product, updatedAt: new Date().toISOString() };
      if (!data.createdAt) data.createdAt = new Date().toISOString();
      await setDoc(productRef, data, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
    }
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const path = 'categorias';
    try {
      const snapshot = await getDocs(collection(db, 'categorias'));
      if (snapshot.empty) {
        // Seed default categories if empty
        const defaults = [
          { name: 'Rendimiento', slug: 'rendimiento' },
          { name: 'Bienestar', slug: 'bienestar' },
          { name: 'Concentración', slug: 'concentracion' }
        ];
        for (const cat of defaults) {
          const id = cat.slug;
          await setDoc(doc(db, 'categorias', id), { 
            ...cat, 
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
        }
        return defaults.map(d => ({ ...d, id: d.slug, createdAt: '', updatedAt: '' } as Category));
      }
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Category));
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return [];
    }
  },

  // Formats
  async getFormats(): Promise<ProductFormat[]> {
    const path = 'formatos';
    try {
      const snapshot = await getDocs(collection(db, 'formatos'));
      if (snapshot.empty) {
        const defaults = [
          { name: 'Cápsulas', slug: 'capsulas' },
          { name: 'Polvo', slug: 'polvo' },
          { name: 'Líquido', slug: 'liquido' },
          { name: 'Comprimidos', slug: 'comprimidos' }
        ];
        for (const f of defaults) {
          await setDoc(doc(db, 'formatos', f.slug), { ...f });
        }
        return defaults.map(d => ({ ...d, id: d.slug } as ProductFormat));
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ProductFormat));
    } catch (error) {
      return [];
    }
  },

  // Tags
  async getTags(): Promise<Tag[]> {
    const path = 'etiquetas';
    try {
      const snapshot = await getDocs(collection(db, 'etiquetas'));
      if (snapshot.empty) {
        const defaults = [
          { name: 'Energía', slug: 'energia' },
          { name: 'Enfoque', slug: 'enfoque' },
          { name: 'Descanso', slug: 'descanso' },
          { name: 'Digestión', slug: 'digestion' }
        ];
        for (const t of defaults) {
          await setDoc(doc(db, 'etiquetas', t.slug), { ...t });
        }
        return defaults.map(d => ({ ...d, id: d.slug } as Tag));
      }
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tag));
    } catch (error) {
      return [];
    }
  },

  // Containers
  async getContainers(): Promise<{id: string, name: string}[]> {
    return []; // For now, handle as needed if API expands
  },

  // Images
  getImages(productId: string, callback: (images: ProductImage[]) => void) {
    // In a production app, we would fetch from API
    // For now we'll do a simple mock or return early
    return () => {};
  },

  // Reviews
  getReviews(productId: string, callback: (reviews: Review[]) => void) {
    return () => {};
  },

  async addReview(productId: string, review: Review): Promise<void> {
    console.log(`Review added for product ${productId}`);
  },

  async delete(id: string | number): Promise<void> {
    const path = `productos/${id}`;
    try {
      await deleteDoc(doc(db, 'productos', String(id)));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, path);
    }
  },

  async getTopSelling(count: number = 5): Promise<Product[]> {
    const path = 'productos';
    try {
      const q = query(collection(db, 'productos'), orderBy('salesCount', 'desc'), limit(count));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Product));
    } catch (error) {
      // If salesCount field doesn't exist yet, return first few
      return this.getAll().then(all => all.slice(0, count));
    }
  }
};
