/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Layout } from './views/components/Layout';
import { ScrollToTop } from './views/components/ScrollToTop';
import { CartProvider } from './controllers/context/CartContext';
import { AuthProvider } from './controllers/context/AuthContext';
import { useProductSeeder } from './controllers/initController';

// Lazy load pages for better performance
const Home = lazy(() => import('./views/pages/Home').then(m => ({ default: m.Home })));
const Catalog = lazy(() => import('./views/pages/Catalog').then(m => ({ default: m.Catalog })));
const ProductDetails = lazy(() => import('./views/pages/ProductDetails').then(m => ({ default: m.ProductDetails })));
const Cart = lazy(() => import('./views/pages/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('./views/pages/Checkout').then(m => ({ default: m.Checkout })));
const Account = lazy(() => import('./views/pages/Account').then(m => ({ default: m.Account })));
const Science = lazy(() => import('./views/pages/Science').then(m => ({ default: m.Science })));
const FAQ = lazy(() => import('./views/pages/FAQ').then(m => ({ default: m.FAQ })));
const Quiz = lazy(() => import('./views/pages/Quiz').then(m => ({ default: m.Quiz })));
const Contact = lazy(() => import('./views/pages/Contact').then(m => ({ default: m.Contact })));
const Privacy = lazy(() => import('./views/pages/Privacy').then(m => ({ default: m.Privacy })));
const Login = lazy(() => import('./views/pages/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./views/pages/Register').then(m => ({ default: m.Register })));
const AdminDashboard = lazy(() => import('./views/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })));
const AdminProducts = lazy(() => import('./views/pages/AdminProducts').then(m => ({ default: m.AdminProducts })));
const AdminProductForm = lazy(() => import('./views/pages/AdminProductForm').then(m => ({ default: m.AdminProductForm })));
const AdminUsers = lazy(() => import('./views/pages/AdminUsers').then(m => ({ default: m.AdminUsers })));

// Loading component
const PageLoader = () => (
  <div className="min-h-[60vh] flex items-center justify-center">
    <div className="w-12 h-12 border-4 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin"></div>
  </div>
);

function Initializer() {
  useProductSeeder();
  return null;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Initializer />
        <Router>
          <ScrollToTop />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="catalog" element={<Catalog />} />
              <Route path="product/:id" element={<ProductDetails />} />
              <Route path="cart" element={<Cart />} />
              <Route path="checkout" element={<Checkout />} />
              <Route path="account" element={<Account />} />
              <Route path="login" element={<Login />} />
              <Route path="register" element={<Register />} />
              <Route path="science" element={<Science />} />
              <Route path="faq" element={<FAQ />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="contact" element={<Contact />} />
              <Route path="privacy" element={<Privacy />} />
              <Route path="admin" element={<AdminDashboard />} />
              <Route path="admin/products" element={<AdminProducts />} />
              <Route path="admin/products/new" element={<AdminProductForm />} />
              <Route path="admin/products/edit/:id" element={<AdminProductForm />} />
              <Route path="admin/users" element={<AdminUsers />} />
            </Routes>
          </Suspense>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}
