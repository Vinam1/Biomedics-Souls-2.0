import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Trash2, Minus, Plus, ArrowRight, ShieldCheck, ShoppingCart } from 'lucide-react';
import { useCart } from '../../controllers/context/CartContext';
import { PageLayout } from '../../components/layout/PageLayout';

export function Cart() {
  const { items, updateQuantity, removeItem, subtotal, shipping, total } = useCart();

  return (
    <PageLayout>
      <div className="bg-[var(--color-bg-light)] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-8">Tu Carrito</h1>

          {items.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
              <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingCart className="w-10 h-10 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Tu carrito está vacío</h2>
              <p className="text-[var(--color-text-secondary)] mb-8">Descubre nuestras fórmulas científicas y optimiza tu bienestar.</p>
              <Link to="/catalog" className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5">
                Explorar Catálogo
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="flex-1 space-y-4">
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <motion.div 
                      key={item.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 border border-gray-100 shadow-sm"
                    >
                    <div className="w-24 h-24 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1">{item.name}</h3>
                      <p className="text-[var(--color-text-secondary)] font-medium">${item.price.toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center justify-between bg-[var(--color-bg-light)] border border-gray-200 rounded-xl px-3 py-2 w-28">
                        <button 
                          onClick={() => updateQuantity(item.id, -1)}
                          className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors p-1"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-[var(--color-text-primary)]">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, 1)}
                          className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors p-1"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="text-lg font-extrabold text-[var(--color-text-primary)] w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
                </AnimatePresence>
              </div>

              {/* Order Summary */}
              <div className="w-full lg:w-96">
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm sticky top-28">
                  <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Resumen del Pedido</h2>
                  
                  <div className="space-y-4 mb-6 text-[var(--color-text-secondary)]">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span className="font-medium text-[var(--color-text-primary)]">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Envío</span>
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {shipping === 0 ? <span className="text-[var(--color-support)] font-bold">Gratis</span> : `$${shipping.toFixed(2)}`}
                      </span>
                    </div>
                    {shipping > 0 && (
                      <div className="text-xs text-[var(--color-brand)] bg-[var(--color-brand)]/10 px-3 py-2 rounded-lg">
                        Añade ${(100 - subtotal).toFixed(2)} más para envío gratis.
                      </div>
                    )}
                  </div>

                  <div className="border-t border-gray-100 pt-6 mb-8">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[var(--color-text-primary)]">Total</span>
                      <span className="text-3xl font-extrabold text-[var(--color-text-primary)]">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link 
                    to="/checkout" 
                    className="w-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-lg rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mb-4"
                  >
                    Proceder al Pago
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  
                  <div className="flex items-center justify-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <ShieldCheck className="w-4 h-4 text-[var(--color-support)]" />
                    Pago 100% seguro y encriptado
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
