/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Order, OrderDetail, PaymentTransaction, OrderHistory } from '../models/types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { 
  collection, doc, getDoc, getDocs, setDoc, 
  query, where, orderBy, limit 
} from 'firebase/firestore';

export const OrderController = {
  async create(orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>, items: Omit<OrderDetail, 'id'>[]): Promise<string> {
    const id = `ORD-${Date.now()}`;
    const path = `pedidos/${id}`;
    try {
      const orderRef = doc(db, 'pedidos', id);
      const newOrder = {
        ...orderData,
        id,
        items,
        orderNumber: id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await setDoc(orderRef, newOrder);
      return id;
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, path);
      throw error;
    }
  },

  getUserOrders(userId: string, callback: (orders: Order[]) => void) {
    const q = query(collection(db, 'pedidos'), where('clientId', '==', userId), orderBy('createdAt', 'desc'));
    
    getDocs(q).then(snapshot => {
      callback(snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order)));
    }).catch(error => {
      console.error("Error fetching user orders:", error);
      callback([]);
    });

    return () => {};
  },

  async getById(id: string): Promise<Order | null> {
    const path = `pedidos/${id}`;
    try {
      const docSnap = await getDoc(doc(db, 'pedidos', id));
      if (!docSnap.exists()) return null;
      return { id: docSnap.id, ...docSnap.data() } as Order;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  getOrderDetails(orderId: string, callback: (details: OrderDetail[]) => void) {
    this.getById(orderId).then(order => {
      if (order && (order as any).items) {
        callback((order as any).items);
      } else {
        callback([]);
      }
    });
    return () => {};
  },

  async getAll(): Promise<Order[]> {
    try {
      const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
       console.error('Error fetching all orders:', error);
       return [];
    }
  },

  async getRecent(count: number = 5): Promise<Order[]> {
    try {
      const q = query(collection(db, 'pedidos'), orderBy('createdAt', 'desc'), limit(count));
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Order));
    } catch (error) {
       console.error('Error fetching recent orders:', error);
       return [];
    }
  }
};
