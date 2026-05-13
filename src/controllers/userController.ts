/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { User, Address, PaymentMethod } from '../models/types';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

export const UserController = {
  async getProfile(uid: string): Promise<User | null> {
    const path = `users/${uid}`;
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (!userDoc.exists()) return null;
      
      const data = userDoc.data();
      return {
        uid: userDoc.id,
        name: data.name,
        lastName: data.lastName,
        email: data.email,
        role: data.role,
        phone: data.phone,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt
      } as User;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, path);
      return null;
    }
  },

  async updateProfile(uid: string, data: Partial<User>): Promise<void> {
    const path = `users/${uid}`;
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date().toISOString()
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, path);
    }
  },

  // Addresses - Handled via API if possible
  getAddresses(uid: string, callback: (addresses: Address[]) => void) {
    callback([]); // Placeholder
    return () => {};
  },

  async addAddress(uid: string, address: Omit<Address, 'id'>): Promise<string> {
    return "0"; // Placeholder
  },

  async deleteAddress(uid: string, addressId: string): Promise<void> {
    console.log(`Address ${addressId} deleted for user ${uid}`);
  },

  async setDefaultAddress(uid: string, addressId: string, allAddressIds: string[]): Promise<void> {
    console.log(`Address ${addressId} set as default for user ${uid}`);
  },

  // Payment Methods
  getPaymentMethods(uid: string, callback: (methods: PaymentMethod[]) => void) {
    callback([]); 
    return () => {};
  },

  async addPaymentMethod(uid: string, method: Omit<PaymentMethod, 'id' | 'createdAt'>): Promise<string> {
    return "0";
  },

  async deletePaymentMethod(uid: string, pmId: string): Promise<void> {
    console.log(`Payment method ${pmId} deleted for user ${uid}`);
  },

  async setDefaultPaymentMethod(uid: string, pmId: string, allPmIds: string[]): Promise<void> {
    console.log(`Payment method ${pmId} set as default for user ${uid}`);
  },

  async getNextOrderId(): Promise<string> {
    return "0";
  }
};
