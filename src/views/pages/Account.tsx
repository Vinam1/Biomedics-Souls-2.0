import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, Package, Settings, CreditCard, LogOut, FileText, 
  Eye, EyeOff, CheckCircle2, Clock, MapPin, 
  Shield, ShoppingBag, ClipboardList, Plus, 
  Trash2, Check, Loader2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../controllers/context/AuthContext';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { PaymentMethodForm } from '../components/PaymentMethodForm';
import { Order, PaymentMethod } from '../../models/types';
import { OrderController } from '../../controllers/orderController';
import { UserController } from '../../controllers/userController';
import { PageLayout } from '../../components/layout/PageLayout';

export function Account() {
  const { user, userProfile, loading, isAuthReady } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'billing' | 'addresses' | 'settings'>('dashboard');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [editProfile, setEditProfile] = useState({
    name: '',
    paternalLastName: '',
    maternalLastName: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (isAuthReady && !user) {
      navigate('/login');
    }
  }, [isAuthReady, user, navigate]);

  useEffect(() => {
    if (userProfile) {
      setEditProfile({
        name: userProfile.name || '',
        paternalLastName: userProfile.paternalLastName || '',
        maternalLastName: userProfile.maternalLastName || '',
        phoneNumber: userProfile.phoneNumber || ''
      });
    }
  }, [userProfile]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSaving(true);
    try {
      await UserController.updateProfile(user.uid, editProfile as any);
      showToast('Perfil actualizado correctamente');
    } catch (err) {
      console.error("Error updating profile:", err);
    } finally {
      setIsSaving(false);
    }
  };

  const [notifications, setNotifications] = useState({
    promotions: true,
    newsletter: false
  });

  const [addresses, setAddresses] = useState<any[]>([]);
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [isAddingPayment, setIsAddingPayment] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '' });
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = OrderController.getUserOrders(user.uid, (data) => {
      setOrders(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = UserController.getPaymentMethods(user.uid, (data) => {
      setPaymentMethods(data);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = UserController.getAddresses(user.uid, (data) => {
      setAddresses(data);
    });
    return () => unsubscribe();
  }, [user]);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddAddress = async () => {
    if (!user) return;
    if (newAddress.label && newAddress.address) {
      try {
        await UserController.addAddress(user.uid, {
          ...newAddress,
          isMain: addresses.length === 0
        } as any);
        setNewAddress({ label: '', address: '' });
        setIsAddingAddress(false);
        showToast('Dirección añadida correctamente');
      } catch (err) {
        console.error("Error adding address:", err);
      }
    }
  };

  const handleDeleteAddress = async (id: string) => {
    if (!user) return;
    try {
      await UserController.deleteAddress(user.uid, id);
      showToast('Dirección eliminada');
    } catch (err) {
      console.error("Error deleting address:", err);
    }
  };

  const handleSetDefaultAddress = async (id: string) => {
    if (!user) return;
    try {
      await UserController.setDefaultAddress(user.uid, id, addresses.map(a => a.id));
      showToast('Dirección principal actualizada');
    } catch (err) {
      console.error("Error setting default address:", err);
    }
  };

  const handleDeletePayment = async (id: string) => {
    if (!user) return;
    try {
      await UserController.deletePaymentMethod(user.uid, id);
      showToast('Método de pago eliminado');
    } catch (err) {
      console.error("Error deleting payment method:", err);
    }
  };

  const handleSetDefaultPayment = async (id: string) => {
    if (!user) return;
    try {
      await UserController.setDefaultPaymentMethod(user.uid, id, paymentMethods.map(pm => pm.id));
      showToast('Método de pago predeterminado actualizado');
    } catch (err) {
      console.error("Error setting default payment:", err);
    }
  };

  const quickAccessCards = [
    { title: "Comprar de nuevo", icon: <ShoppingBag className="w-6 h-6" />, link: "/catalog", color: "bg-blue-50 text-blue-600" },
    { title: "Resultados de mi Quiz", icon: <ClipboardList className="w-6 h-6" />, link: "/quiz", color: "bg-purple-50 text-purple-600" },
    { title: "Rastrear mi pedido", icon: <Package className="w-6 h-6" />, link: "/orders", color: "bg-emerald-50 text-emerald-600", isTab: true, tabId: 'orders' }
  ];

  return (
    <PageLayout>
      <div className="bg-[var(--color-bg-light)] min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <aside className="w-full lg:w-72 flex-shrink-0">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm sticky top-24">
                <div className="flex items-center gap-4 mb-8 pb-6 border-b border-gray-100">
                  <div className="w-16 h-16 bg-gradient-to-tr from-[#4f46e5] to-[#ec4899] rounded-full flex items-center justify-center text-white font-bold text-2xl shadow-lg uppercase">
                    {userProfile?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                    {userProfile?.paternalLastName?.charAt(0) || ''}
                  </div>
                  <div>
                    <h2 className="font-bold text-[var(--color-text-primary)] text-lg">
                      {userProfile ? `${userProfile.name} ${userProfile.paternalLastName}` : 'Usuario'}
                    </h2>
                    <p className="text-sm text-[var(--color-text-secondary)]">Miembro desde {userProfile?.createdAt?.toDate ? userProfile.createdAt.toDate().getFullYear() : '2024'}</p>
                  </div>
                </div>

                <nav className="space-y-1">
                  {[
                    { id: 'dashboard', label: 'Dashboard', icon: <User className="w-5 h-5" /> },
                    { id: 'orders', label: 'Mis Pedidos', icon: <Package className="w-5 h-5" /> },
                    { id: 'billing', label: 'Métodos de Pago', icon: <CreditCard className="w-5 h-5" /> },
                    { id: 'addresses', label: 'Mis Direcciones', icon: <MapPin className="w-5 h-5" /> },
                    { id: 'settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> }
                  ].map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as any)}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${
                        activeTab === item.id 
                          ? 'bg-[var(--color-brand)] text-white shadow-md translate-x-1' 
                          : 'text-[var(--color-text-secondary)] hover:bg-gray-50 hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {item.icon}
                      {item.label}
                    </button>
                  ))}
                  
                  <div className="h-px bg-gray-100 my-4"></div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Cerrar Sesión
                  </button>
                </nav>
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)]" />
                </div>
              ) : (
              <AnimatePresence mode="wait">
                {activeTab === 'dashboard' && (
                  <motion.div 
                    key="dashboard"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">Hola, {userProfile?.name || 'Usuario'}</h1>
                      <p className="text-[var(--color-text-secondary)]">Bienvenido de nuevo a tu panel de salud.</p>
                    </div>
                    
                    {/* Stats */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 bg-[var(--color-brand)]/10 rounded-2xl flex items-center justify-center text-[var(--color-brand)]">
                          <Package className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-[var(--color-text-secondary)] font-medium mb-1">Pedidos Activos</p>
                          <p className="text-3xl font-extrabold text-[var(--color-text-primary)]">{orders.length}</p>
                        </div>
                      </div>
                      <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                        <div className="w-16 h-16 bg-[var(--color-brand)]/10 rounded-2xl flex items-center justify-center text-[var(--color-brand)] text-emerald-500">
                          <CreditCard className="w-8 h-8" />
                        </div>
                        <div>
                          <p className="text-[var(--color-text-secondary)] font-medium mb-1">Métodos de Pago</p>
                          <p className="text-3xl font-extrabold text-[var(--color-text-primary)]">{paymentMethods.length}</p>
                        </div>
                      </div>
                    </div>

                    <section>
                      <div className="mb-6">
                        <h2 className="text-2xl font-extrabold text-[var(--color-text-primary)]">Mi Panel de Control</h2>
                        <p className="text-[var(--color-text-secondary)]">Accede rápidamente a tus secciones más importantes.</p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                        {quickAccessCards.map((card, idx) => (
                          <motion.div
                            key={idx}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className="group cursor-pointer"
                            onClick={() => card.isTab ? setActiveTab(card.tabId as any) : null}
                          >
                            {card.isTab ? (
                              <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col items-center text-center group-hover:border-[var(--color-brand)]">
                                <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                  {card.icon}
                                </div>
                                <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">{card.title}</h3>
                              </div>
                            ) : (
                              <Link to={card.link} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all h-full flex flex-col items-center text-center group-hover:border-[var(--color-brand)]">
                                <div className={`w-14 h-14 ${card.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                                  {card.icon}
                                </div>
                                <h3 className="font-bold text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors">{card.title}</h3>
                              </Link>
                            )}
                          </motion.div>
                        ))}
                      </div>
                    </section>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Actividad Reciente</h2>
                        <button onClick={() => setActiveTab('orders')} className="text-[var(--color-brand)] font-bold hover:text-[var(--color-brand-hover)] transition-colors text-sm">Ver todo</button>
                      </div>
                      
                      <div className="space-y-4">
                        {orders.slice(0, 2).map((order) => (
                          <button 
                            key={order.id} 
                            onClick={() => setSelectedOrder(order)}
                            className="w-full flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-[var(--color-brand)] transition-colors text-left"
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                                order.status === 'entregado' ? 'bg-[var(--color-support)]/10 text-[var(--color-support)]' : 
                                order.status === 'enviado' ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' : 
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {order.status === 'entregado' ? <CheckCircle2 className="w-6 h-6" /> : <Clock className="w-6 h-6" />}
                              </div>
                              <div>
                                <p className="font-bold text-[var(--color-text-primary)]">{order.orderNumber}</p>
                                <p className="text-sm text-[var(--color-text-secondary)]">{new Date(order.createdAt).toLocaleDateString()} • {order.total} artículos</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-[var(--color-text-primary)]">${order.total.toFixed(2)}</p>
                              <p className={`text-sm font-medium ${
                                order.status === 'entregado' ? 'text-[var(--color-support)]' : 
                                order.status === 'enviado' ? 'text-[var(--color-brand)]' : 
                                'text-yellow-600'
                              }`}>{order.status}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'orders' && (
                  <motion.div 
                    key="orders"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Historial de Pedidos</h1>
                    
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div key={order.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-gray-100 rounded-2xl hover:shadow-md transition-shadow gap-4">
                            <div className="flex items-center gap-4">
                              <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                                order.status === 'entregado' ? 'bg-[var(--color-support)]/10 text-[var(--color-support)]' : 
                                order.status === 'enviado' ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' : 
                                'bg-yellow-100 text-yellow-600'
                              }`}>
                                {order.status === 'entregado' ? <CheckCircle2 className="w-7 h-7" /> : <Clock className="w-7 h-7" />}
                              </div>
                              <div>
                                <div className="flex items-center gap-3 mb-1">
                                  <p className="font-bold text-lg text-[var(--color-text-primary)]">{order.orderNumber}</p>
                                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                    order.status === 'entregado' ? 'bg-[var(--color-support)]/10 text-[var(--color-support)]' : 
                                    order.status === 'enviado' ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' : 
                                    'bg-yellow-100 text-yellow-600'
                                  }`}>{order.status}</span>
                                </div>
                                <p className="text-[var(--color-text-secondary)]">{new Date(order.createdAt).toLocaleDateString()} • {order.total} artículos • <span className="font-bold text-[var(--color-text-primary)]">${order.total.toFixed(2)}</span></p>
                              </div>
                            </div>
                            <div className="flex gap-3 sm:ml-auto">
                              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-[var(--color-text-primary)] font-bold rounded-xl transition-colors border border-gray-200">
                                <FileText className="w-4 h-4" /> Factura
                              </button>
                              <button 
                                onClick={() => setSelectedOrder(order)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold rounded-xl transition-colors shadow-sm"
                              >
                                Detalles
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'billing' && (
                  <motion.div 
                    key="billing"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">Métodos de Pago</h1>
                      <p className="text-[var(--color-text-secondary)]">Administra tus tarjetas y cuentas de forma segura para agilizar tus compras de suplementos.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Tarjetas Guardadas</h2>
                        <button 
                          onClick={() => setIsAddingPayment(!isAddingPayment)}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-brand-hover)] transition-colors shadow-sm text-sm"
                        >
                          <Plus className="w-4 h-4" /> {isAddingPayment ? 'Cancelar' : 'Agregar nuevo método'}
                        </button>
                      </div>

                      {isAddingPayment && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mb-8"
                        >
                          <PaymentMethodForm 
                            onSuccess={() => {
                              setIsAddingPayment(false);
                              showToast('Tarjeta guardada correctamente');
                            }}
                            onCancel={() => setIsAddingPayment(false)}
                          />
                        </motion.div>
                      )}

                      <div className="space-y-4">
                        {paymentMethods.length === 0 && !isAddingPayment && (
                          <div className="text-center py-12 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                            <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 font-medium">No tienes métodos de pago guardados.</p>
                          </div>
                        )}
                        {paymentMethods.map((pm) => (
                          <div key={pm.id} className={`flex items-center justify-between p-6 border-2 rounded-2xl relative overflow-hidden transition-all ${pm.isDefault ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5' : 'border-gray-100'}`}>
                            <div className="flex items-center gap-4 relative z-10">
                              <div className="w-12 h-8 bg-white border border-gray-200 rounded flex items-center justify-center">
                                <span className="text-blue-800 font-bold italic text-xs uppercase">{pm.brand}</span>
                              </div>
                              <div>
                                <p className="font-bold text-[var(--color-text-primary)] uppercase">{pm.brand} terminada en **** {pm.last4}</p>
                                <p className="text-xs text-[var(--color-text-secondary)]">Vence {pm.expMonth}/{pm.expYear}</p>
                                {pm.isDefault ? (
                                  <span className="text-xs px-2 py-0.5 bg-[var(--color-brand)] text-white rounded-full font-bold">Predeterminada</span>
                                ) : (
                                  <button 
                                    onClick={() => handleSetDefaultPayment(pm.id)}
                                    className="text-xs text-[var(--color-brand)] font-bold hover:underline"
                                  >
                                    Establecer como predeterminada
                                  </button>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-2 relative z-10">
                              <button 
                                onClick={() => handleDeletePayment(pm.id)}
                                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </div>
                            <div className="absolute -right-4 -bottom-4 opacity-5 text-[var(--color-brand)]">
                              <CreditCard className="w-24 h-24" />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <Shield className="w-5 h-5 text-[var(--color-support)]" />
                        <p className="text-sm text-[var(--color-text-secondary)]">
                          Tus datos están encriptados y protegidos bajo estándares de seguridad bancaria.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'addresses' && (
                  <motion.div 
                    key="addresses"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <div>
                      <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">Mis Direcciones</h1>
                      <p className="text-[var(--color-text-secondary)]">Guarda tus ubicaciones frecuentes para recibir tus productos donde prefieras.</p>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm">
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)]">Direcciones Guardadas</h2>
                        <button 
                          onClick={() => setIsAddingAddress(!isAddingAddress)}
                          className="flex items-center gap-2 px-4 py-2 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-brand-hover)] transition-colors shadow-sm text-sm"
                        >
                          <Plus className="w-4 h-4" /> {isAddingAddress ? 'Cancelar' : 'Añadir nueva dirección'}
                        </button>
                      </div>

                      {isAddingAddress && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 space-y-4"
                        >
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Etiqueta (Ej: Casa, Oficina)</label>
                              <input 
                                type="text" 
                                placeholder="Casa"
                                value={newAddress.label}
                                onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand)]"
                              />
                            </div>
                            <div>
                              <label className="block text-xs font-bold text-gray-500 mb-1">Dirección Completa</label>
                              <input 
                                type="text" 
                                placeholder="Calle 123, Ciudad..."
                                value={newAddress.address}
                                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-brand)]"
                              />
                            </div>
                          </div>
                          <button 
                            onClick={handleAddAddress}
                            className="w-full py-2 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-brand-hover)]"
                          >
                            Guardar Dirección
                          </button>
                        </motion.div>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {addresses.map((addr) => (
                          <div key={addr.id} className={`p-6 border-2 rounded-2xl transition-all ${addr.isDefault ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                            <div className="flex justify-between items-start mb-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${addr.isDefault ? 'bg-[var(--color-brand)] text-white' : 'bg-gray-100 text-[var(--color-text-secondary)]'}`}>
                                  <MapPin className="w-4 h-4" />
                                </div>
                                <h3 className="font-bold text-[var(--color-text-primary)]">{addr.label}</h3>
                              </div>
                              {addr.isDefault && <span className="text-[10px] uppercase tracking-wider font-bold text-[var(--color-brand)]">Principal</span>}
                            </div>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-6 leading-relaxed h-12 line-clamp-2">
                              {addr.address}
                            </p>
                            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                              <div className="flex gap-4">
                                <button 
                                  onClick={() => handleDeleteAddress(addr.id)}
                                  className="text-xs font-bold text-red-400 hover:text-red-500 transition-colors"
                                >
                                  Eliminar
                                </button>
                              </div>
                              {!addr.isDefault && (
                                <button 
                                  onClick={() => handleSetDefaultAddress(addr.id)}
                                  className="text-xs font-bold text-[var(--color-brand)] hover:underline"
                                >
                                  Establecer como principal
                                </button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'settings' && (
                  <motion.div 
                    key="settings"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="space-y-8"
                  >
                    <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">Configuración</h1>
                    
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm space-y-12">
                      {/* Profile */}
                      <section>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Información Personal</h2>
                        <form onSubmit={handleUpdateProfile}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Nombre</label>
                              <input 
                                type="text" 
                                value={editProfile.name}
                                onChange={(e) => setEditProfile({ ...editProfile, name: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Apellido Paterno</label>
                              <input 
                                type="text" 
                                value={editProfile.paternalLastName}
                                onChange={(e) => setEditProfile({ ...editProfile, paternalLastName: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Apellido Materno</label>
                              <input 
                                type="text" 
                                value={editProfile.maternalLastName}
                                onChange={(e) => setEditProfile({ ...editProfile, maternalLastName: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Número Telefónico</label>
                              <input 
                                type="tel" 
                                value={editProfile.phoneNumber}
                                onChange={(e) => setEditProfile({ ...editProfile, phoneNumber: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Correo Electrónico</label>
                              <input 
                                type="email" 
                                disabled
                                value={user?.email || ''} 
                                className="w-full bg-gray-100 border border-gray-200 rounded-xl px-4 py-3 cursor-not-allowed text-gray-500" 
                              />
                              <p className="text-xs text-gray-400 mt-1">El correo electrónico no se puede cambiar por seguridad.</p>
                            </div>
                          </div>
                          <div className="mt-6 flex justify-end">
                            <button 
                              type="submit"
                              disabled={isSaving}
                              className="px-6 py-3 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
                            >
                              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                              Guardar Cambios
                            </button>
                          </div>
                        </form>
                      </section>

                      <div className="h-px bg-gray-100"></div>

                      {/* Password */}
                      <section>
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-6">Seguridad</h2>
                        <div className="space-y-6 max-w-md">
                          <div>
                            <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Contraseña Actual</label>
                            <div className="relative">
                              <input type={showPassword ? "text" : "password"} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all pr-12" />
                              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[var(--color-brand)]">
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                              </button>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Nueva Contraseña</label>
                            <input type="password" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" />
                          </div>
                        </div>
                        <div className="mt-6">
                          <button className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-[var(--color-text-primary)] font-bold rounded-xl transition-colors border border-gray-200">
                            Actualizar Contraseña
                          </button>
                        </div>
                      </section>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              )}
            </main>
          </div>
        </div>

        {/* Order Details Modal */}
        <AnimatePresence>
          {selectedOrder && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl"
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-[var(--color-text-primary)]">Detalles del Pedido</h3>
                    <p className="text-sm text-[var(--color-text-secondary)]">{selectedOrder.orderNumber} • {new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                  </div>
                  <button 
                    onClick={() => setSelectedOrder(null)}
                    className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>
                
                <div className="p-6 max-h-[60vh] overflow-y-auto">
                  <div className="space-y-4">
                    {/* Items would normally be here if fetched */}
                    <p className="text-gray-500 italic">Cargando detalles de productos...</p>
                  </div>
                </div>

                <div className="p-6 bg-gray-50 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-[var(--color-text-secondary)]">Estado del envío</p>
                      <div className="flex items-center gap-2 mt-1">
                        {selectedOrder.status === 'entregado' ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-amber-500" />
                        )}
                        <span className={`font-bold ${selectedOrder.status === 'entregado' ? 'text-emerald-600' : 'text-amber-600'}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-[var(--color-text-secondary)]">Total pagado</p>
                      <p className="text-2xl font-extrabold text-[var(--color-text-primary)]">${selectedOrder.total.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`fixed bottom-8 right-8 px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 ${
                toast.type === 'success' ? 'bg-[var(--color-support)] text-white' : 'bg-red-500 text-white'
              }`}
            >
              <Check className="w-5 h-5" />
              <span className="font-bold">{toast.message}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
