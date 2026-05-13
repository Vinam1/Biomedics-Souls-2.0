import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Plus, Edit, Trash2, Search, Filter, 
  Star, Loader2
} from 'lucide-react';
import { useAuth } from '../../controllers/context/AuthContext';
import { Navigate, Link } from 'react-router-dom';
import { Product } from '../../models/types';
import { ProductController } from '../../controllers/productController';
import { PageLayout } from '../../components/layout/PageLayout';

export function AdminProducts() {
  const { isAdmin, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isAdmin) return;
    fetchProducts();
  }, [isAdmin]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const data = await ProductController.getAll();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de eliminar este producto?")) return;
    setIsLoading(true);
    try {
      await ProductController.delete(id);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error al eliminar el producto.");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (p.categoryId?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

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
              <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Gestión de Productos</h1>
              <p className="text-gray-500 font-medium">Añade, edita o elimina productos del catálogo.</p>
            </div>
            <div className="flex gap-3">
              <Link 
                to="/admin/products/new"
                className="bg-[var(--color-brand)] text-white font-bold px-6 py-3 rounded-xl hover:bg-[var(--color-brand-hover)] transition-all shadow-lg flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Nuevo Producto
              </Link>
            </div>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm mb-8 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                placeholder="Buscar productos por nombre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[var(--color-brand)] transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-500 hover:text-gray-900 transition-colors">
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-6 py-4">Producto</th>
                    <th className="px-6 py-4">Categoría</th>
                    <th className="px-6 py-4">Precio</th>
                    <th className="px-6 py-4">Rating</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">Cargando productos...</td>
                    </tr>
                  ) : filteredProducts.length > 0 ? filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-50 overflow-hidden flex-shrink-0">
                            <img src={product.img} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.categoryId || 'General'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{product.categoryId || 'General'}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className={`font-black ${product.discountPrice ? 'text-red-600' : 'text-gray-900'}`}>
                            ${(product.discountPrice || product.price).toFixed(2)}
                          </span>
                          {product.discountPrice && (
                            <span className="text-[10px] text-gray-400 line-through">${product.price.toFixed(2)}</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                          <Star className="w-3 h-3 fill-current" />
                          {product.rating}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link 
                            to={`/admin/products/edit/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button 
                            onClick={() => handleDelete(product.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center text-gray-400 font-medium">No se encontraron productos.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
