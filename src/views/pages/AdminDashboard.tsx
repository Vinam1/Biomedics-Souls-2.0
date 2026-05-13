import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  LayoutDashboard, Package, ShoppingBag, Users, Star, 
  TrendingUp, ArrowUpRight, ArrowDownRight, Clock,
  Plus, Edit, Trash2, Search, Filter, ChevronRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../controllers/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { 
  collection, getDocs
} from 'firebase/firestore';
import { db } from '../../firebase';
import { Product, Order } from '../../models/types';
import { ProductController } from '../../controllers/productController';
import { OrderController } from '../../controllers/orderController';
import { PageLayout } from '../../components/layout/PageLayout';

export function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    avgRating: 0
  });
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [topProducts, setTopProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchDashboardData = async () => {
      try {
        const [orders, products] = await Promise.all([
          OrderController.getAll(),
          ProductController.getAll()
        ]);
        
        const usersSnap = await getDocs(collection(db, 'users'));

        const totalSales = orders.reduce((acc, o) => acc + (o.finalTotal || 0), 0);
        const totalOrders = orders.length;
        const totalUsers = usersSnap.size;
        
        const ratings = products.map(p => p.rating || 0);
        const avgRating = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;

        setStats({
          totalSales,
          totalOrders,
          totalUsers,
          avgRating
        });

        const recent = await OrderController.getRecent(5);
        setRecentOrders(recent);

        const top = await ProductController.getTopSelling(5);
        setTopProducts(top);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAdmin]);

  if (loading) return (
    <PageLayout>
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)]" />
      </div>
    </PageLayout>
  );
  
  if (!isAdmin) return <Navigate to="/login" />;

  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
            <div>
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Panel de Administración</h1>
              <p className="text-gray-500 font-medium">Gestiona tu tienda y visualiza el rendimiento en tiempo real.</p>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/admin/users" 
                className="bg-white border border-gray-200 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                Usuarios
              </Link>
              <Link 
                to="/admin/products" 
                className="bg-white border border-gray-200 text-gray-900 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-all shadow-sm flex items-center gap-2"
              >
                <Package className="w-5 h-5" />
                Productos
              </Link>
              <Link 
                to="/admin/products/new" 
                className="bg-[var(--color-brand)] text-white font-bold px-6 py-3 rounded-xl hover:bg-[var(--color-brand-hover)] transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nuevo Producto
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {[
              { label: 'Ventas Totales', value: `$${stats.totalSales.toFixed(2)}`, icon: <TrendingUp className="w-6 h-6" />, color: 'bg-emerald-50 text-emerald-600', trend: '+12.5%' },
              { label: 'Pedidos', value: stats.totalOrders, icon: <ShoppingBag className="w-6 h-6" />, color: 'bg-blue-50 text-blue-600', trend: '+8.2%' },
              { label: 'Usuarios', value: stats.totalUsers, icon: <Users className="w-6 h-6" />, color: 'bg-purple-50 text-purple-600', trend: '+5.1%' },
              { label: 'Rating Promedio', value: stats.avgRating.toFixed(1), icon: <Star className="w-6 h-6" />, color: 'bg-amber-50 text-amber-600', trend: '+0.3' }
            ].map((stat, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl ${stat.color}`}>
                    {stat.icon}
                  </div>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-bold bg-emerald-50 px-2 py-1 rounded-lg">
                    <ArrowUpRight className="w-3 h-3" />
                    {stat.trend}
                  </div>
                </div>
                <p className="text-gray-500 text-sm font-bold uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-gray-900">{stat.value}</h3>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900">Últimos Pedidos</h2>
                  <Link to="/admin/orders" className="text-[var(--color-brand)] font-bold text-sm hover:underline flex items-center gap-1">
                    Ver todos <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                        <th className="px-6 py-4">ID Pedido</th>
                        <th className="px-6 py-4">Cliente</th>
                        <th className="px-6 py-4">Estado</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Fecha</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {recentOrders.length > 0 ? recentOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 text-xs text-gray-500">#{order.id.slice(0, 8)}</td>
                          <td className="px-6 py-4">
                            <p className="font-bold text-gray-900 text-sm">{order.addressSnapshot?.street || 'Usuario'}</p>
                            <p className="text-xs text-gray-500">{order.clientId.slice(0, 8)}</p>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                              order.status === 'entregado' ? 'bg-emerald-50 text-emerald-600' :
                              order.status === 'pendiente' ? 'bg-amber-50 text-amber-600' :
                              'bg-blue-50 text-blue-600'
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 font-black text-gray-900">${order.finalTotal.toFixed(2)}</td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {order.createdAt?.toDate ? order.createdAt.toDate().toLocaleDateString() : 'Reciente'}
                          </td>
                        </tr>
                      )) : (
                        <tr>
                          <td colSpan={5} className="px-6 py-12 text-center text-gray-400 font-medium">No hay pedidos recientes.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-50">
                  <h2 className="text-xl font-black text-gray-900">Productos Más Vendidos</h2>
                </div>
                <div className="p-6 space-y-6">
                  {topProducts.length > 0 ? topProducts.map((product, i) => (
                    <div key={product.id} className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                        <img src={product.img} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{product.name}</h4>
                        <p className="text-xs text-gray-500">{product.categoryId} • {product.salesCount || 0} ventas</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-gray-900 text-sm">${product.price.toFixed(2)}</p>
                        <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {product.rating}
                        </div>
                      </div>
                    </div>
                  )) : (
                    <p className="text-center text-gray-400 font-medium py-8">No hay datos de productos.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
