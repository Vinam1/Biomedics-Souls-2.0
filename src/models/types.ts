/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'cliente' | 'admin' | 'superadmin';
export type OrderStatus = 'pendiente' | 'pagado' | 'en_preparacion' | 'enviado' | 'entregado' | 'cancelado';
export type CartStatus = 'active' | 'converted' | 'abandoned';
export type ReviewStatus = 'publicada' | 'eliminada';

export interface User {
  uid: string;
  name: string;
  lastName: string;
  email: string;
  role: UserRole;
  phone?: string;
  createdAt: any;
  updatedAt: any;
  deletedAt?: any;
}

export interface Address {
  id: string;
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  country: string;
  zipCode: string;
  isMain: boolean;
  references?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  createdAt: any;
  updatedAt: any;
}

export interface ProductFormat {
  id: string;
  name: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  color?: string;
}

export interface Product {
  id: string;
  categoryId: string;
  formatId: string;
  name: string;
  slug: string;
  sku: string;
  price: number;
  discountPrice?: number;
  img: string; // Main image URL
  images?: string[]; // Additional image URLs or array of IDs
  shortDesc: string; // UI uses shortDesc
  shortDescription?: string; // Fallback
  desc: string; // UI uses desc for long description
  longDescription?: string; // Fallback
  usageInstructions?: string; // Specifically requested by user
  usageMode?: string;
  uses?: string;
  benefits?: string[];
  applications?: string;
  netContent: string;
  containerQuantity?: string;
  unit?: string; // Added for AdminProductForm
  quantity?: number; // Added for AdminProductForm
  weightPerUnit?: number; // Added for AdminProductForm
  container?: string; // Added for AdminProductForm
  isFeatured: boolean;
  status: string;
  rating: number; // AdminDashboard uses rating
  averageRating?: number;
  totalReviews: number;
  tagIds: string[];
  salesCount?: number; // Used in AdminDashboard
  createdAt: any;
  updatedAt: any;
}

export interface ProductImage {
  id: string;
  url: string;
  altText?: string;
  isMain: boolean;
  order: number;
}

export interface Review {
  id: string;
  clientId: string;
  productId: string;
  rating: number;
  title?: string;
  comment: string;
  status: ReviewStatus;
  createdAt: any;
}

export interface Cart {
  id: string;
  clientId?: string;
  sessionId?: string;
  status: CartStatus;
  expiresAt: any;
  createdAt: any;
  updatedAt: any;
}

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  priceSnapshot: number;
  createdAt: any;
}

export interface PaymentMethod {
  id: string;
  type: string;
  brand?: string;
  cardBrand?: string; // Used in PaymentMethodForm
  lastFour?: string;
  last4?: string; // Used in UI
  expMonth?: number;
  expYear?: number;
  nickname?: string;
  isDefault: boolean;
  isActive: boolean;
  token?: string;
  createdAt: any;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  shippingAddressId?: string;
  paymentMethodId?: string;
  status: OrderStatus;
  subtotal: number;
  shippingCost: number;
  total: number;
  finalTotal: number; // Used in AdminDashboard
  addressSnapshot?: Partial<Address>;
  paymentSnapshot?: Partial<PaymentMethod>;
  mercadoPago?: any;
  createdAt: any;
  updatedAt: any;
}

export interface OrderDetail {
  id: string;
  productId: string;
  productName: string;
  productSku: string;
  quantity: number;
  originalPrice: number;
  discountPrice?: number;
  unitPrice: number;
  subtotal: number;
}

export interface PaymentTransaction {
  id: string;
  gateway: string;
  reference?: string;
  status: string;
  amount: number;
  currency: string;
  responsePayload?: any;
  createdAt: any;
}

export interface OrderHistory {
  id: string;
  previousStatus?: OrderStatus;
  newStatus: OrderStatus;
  changeDate: any;
  changedBy: string;
}
