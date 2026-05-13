import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Check, CreditCard, MapPin, Truck, ShieldCheck, ChevronRight, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../../controllers/context/CartContext';
import { useAuth } from '../../controllers/context/AuthContext';
import { PaymentMethodForm } from '../components/PaymentMethodForm';
import { Order, PaymentMethod } from '../../models/types';
import { OrderController } from '../../controllers/orderController';
import { UserController } from '../../controllers/userController';
import { PageLayout } from '../../components/layout/PageLayout';

export function Checkout() {
  const { total, clearCart, items } = useCart();
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal'>('card');
  const [useSavedCard, setUseSavedCard] = useState(false);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [shippingMethod, setShippingMethod] = useState('standard');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [shippingData, setShippingData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    zipCode: ''
  });

  useEffect(() => {
    if (userProfile) {
      setShippingData({
        fullName: `${userProfile.name} ${userProfile.paternalLastName} ${userProfile.maternalLastName}`,
        phone: userProfile.phoneNumber || '',
        address: '',
        city: '',
        zipCode: ''
      });
    }
  }, [userProfile]);

  useEffect(() => {
    if (!user) return;
    const unsubscribe = UserController.getPaymentMethods(user.uid, (methods) => {
      setPaymentMethods(methods);
      if (methods.length > 0) {
        const defaultCard = methods.find(m => m.isDefault) || methods[0];
        setSelectedCardId(defaultCard.id);
        setUseSavedCard(true);
      }
    });
    return () => unsubscribe();
  }, [user]);

  const shippingCosts = {
    standard: 5.99,
    express: 12.99,
    same_day: 19.99
  };

  const finalTotal = total + shippingCosts[shippingMethod as keyof typeof shippingCosts];

  const nextStep = () => setStep(Math.min(3, step + 1));
  const prevStep = () => setStep(Math.max(1, step - 1));

  const handleConfirmOrder = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);
    try {
      const orderItems = items.map(item => ({
        productId: item.id,
        productName: item.name,
        productSku: 'SKU-' + item.id,
        originalPrice: item.price,
        unitPrice: item.price,
        quantity: item.quantity,
        subtotal: item.price * item.quantity
      }));

      const orderData: Omit<Order, 'id' | 'createdAt' | 'updatedAt'> = {
        orderNumber: '',
        clientId: user.uid,
        status: 'pendiente',
        subtotal: total,
        shippingCost: shippingCosts[shippingMethod as keyof typeof shippingCosts],
        total: finalTotal,
        finalTotal: finalTotal,
        shippingAddressId: '',
        paymentMethodId: useSavedCard ? selectedCardId : '',
        addressSnapshot: shippingData as any,
        paymentSnapshot: {
          type: paymentMethod,
          last4: '****' 
        }
      };

      await OrderController.create(orderData, orderItems);
      
      setIsSuccess(true);
      setTimeout(() => {
        clearCart();
      }, 500);
    } catch (err) {
      console.error("Error creating order:", err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0 && !isSuccess) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-bg-light)]">
          <div className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center max-w-md w-full border border-gray-100">
            <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="w-12 h-12 text-[var(--color-brand)]" />
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-tight">Tu carrito está vacío</h2>
            <p className="text-[var(--color-text-secondary)] mb-10 text-lg leading-relaxed">No tienes productos para procesar el pago.</p>
            <Link 
              to="/catalog" 
              className="inline-flex items-center justify-center gap-2 bg-[var(--color-brand)] text-white font-bold px-10 py-5 rounded-2xl hover:bg-[var(--color-brand-hover)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full text-lg"
            >
              Ir al Catálogo
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  if (isSuccess) {
    return (
      <PageLayout>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[var(--color-bg-light)]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-12 rounded-[2.5rem] shadow-xl text-center max-w-md w-full border border-gray-100"
          >
            <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8">
              <Check className="w-12 h-12 text-emerald-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-4 tracking-tight">¡Pedido Confirmado!</h2>
            <p className="text-[var(--color-text-secondary)] mb-10 text-lg leading-relaxed">Tu pedido ha sido registrado con éxito. Recibirás un correo con los detalles.</p>
            <div className="space-y-4">
              <Link 
                to="/account" 
                className="inline-flex items-center justify-center gap-2 bg-[var(--color-brand)] text-white font-bold px-10 py-5 rounded-2xl hover:bg-[var(--color-brand-hover)] transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full text-lg"
              >
                Ver mis pedidos
              </Link>
              <Link 
                to="/" 
                className="inline-flex items-center justify-center gap-2 text-[var(--color-text-secondary)] font-bold px-10 py-5 rounded-2xl hover:bg-gray-50 transition-all w-full text-lg"
              >
                Volver al inicio
              </Link>
            </div>
          </motion.div>
        </div>
      </PageLayout>
    );
  }

  const steps = [
    { id: 1, title: "Dirección", icon: <MapPin className="w-5 h-5" /> },
    { id: 2, title: "Envío", icon: <Truck className="w-5 h-5" /> },
    { id: 3, title: "Pago", icon: <CreditCard className="w-5 h-5" /> }
  ];

  return (
    <PageLayout>
      <div className="bg-[var(--color-bg-light)] min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-8">Checkout Seguro</h1>

          {/* Progress Bar */}
          <div className="mb-12">
            <div className="flex justify-between items-center relative">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-200 rounded-full z-0"></div>
              <div 
                className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[var(--color-brand)] rounded-full z-0 transition-all duration-500"
                style={{ width: `${((step - 1) / 2) * 100}%` }}
              ></div>
              
              {steps.map((s) => (
                <div key={s.id} className="relative z-10 flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-colors ${
                    step >= s.id 
                      ? 'bg-[var(--color-brand)] text-white shadow-md' 
                      : 'bg-white text-gray-400 border-2 border-gray-200'
                  }`}>
                    {step > s.id ? <Check className="w-5 h-5" /> : s.icon}
                  </div>
                  <span className={`text-sm font-bold ${step >= s.id ? 'text-[var(--color-brand)]' : 'text-gray-400'}`}>
                    {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Dirección de Envío</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Nombre Completo</label>
                      <input 
                        type="text" 
                        value={shippingData.fullName}
                        onChange={(e) => setShippingData({...shippingData, fullName: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                        placeholder="Juan Pérez" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Teléfono</label>
                      <input 
                        type="tel" 
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({...shippingData, phone: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                        placeholder="+1 (555) 000-0000" 
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Dirección</label>
                      <input 
                        type="text" 
                        value={shippingData.address}
                        onChange={(e) => setShippingData({...shippingData, address: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                        placeholder="Calle Principal 123, Apt 4B" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Ciudad</label>
                      <input 
                        type="text" 
                        value={shippingData.city}
                        onChange={(e) => setShippingData({...shippingData, city: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                        placeholder="Ciudad de México" 
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Código Postal</label>
                      <input 
                        type="text" 
                        value={shippingData.zipCode}
                        onChange={(e) => setShippingData({...shippingData, zipCode: e.target.value})}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                        placeholder="00000" 
                      />
                    </div>
                  </div>
                  <div className="pt-6 flex justify-end">
                    <button onClick={nextStep} className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                      Continuar a Envío <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Método de Envío</h2>
                  <div className="space-y-4">
                    {[
                      { id: 'standard', title: 'Estándar', desc: '3-5 días hábiles', price: '$5.99' },
                      { id: 'express', title: 'Express', desc: '1-2 días hábiles', price: '$12.99' },
                      { id: 'same_day', title: 'Mismo Día', desc: 'Entregado hoy antes de las 9PM', price: '$19.99' }
                    ].map((method) => (
                      <label 
                        key={method.id} 
                        className={`flex items-center justify-between p-4 border-2 rounded-2xl cursor-pointer transition-all group ${
                          shippingMethod === method.id 
                            ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5' 
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`relative flex items-center justify-center w-6 h-6 border-2 rounded-full bg-white transition-colors ${
                            shippingMethod === method.id ? 'border-[var(--color-brand)]' : 'border-gray-300'
                          }`}>
                            <input 
                              type="radio" 
                              name="shipping" 
                              className="sr-only" 
                              checked={shippingMethod === method.id}
                              onChange={() => setShippingMethod(method.id)}
                            />
                            {shippingMethod === method.id && <div className="w-3 h-3 bg-[var(--color-brand)] rounded-full"></div>}
                          </div>
                          <div>
                            <h4 className="font-bold text-[var(--color-text-primary)]">{method.title}</h4>
                            <p className="text-sm text-[var(--color-text-secondary)]">{method.desc}</p>
                          </div>
                        </div>
                        <span className="font-bold text-[var(--color-text-primary)]">{method.price}</span>
                      </label>
                    ))}
                  </div>
                  <div className="pt-6 flex justify-between">
                    <button onClick={prevStep} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-bold px-6 py-4 rounded-xl transition-colors">
                      Volver
                    </button>
                    <button onClick={nextStep} className="bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg">
                      Continuar a Pago <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-6">Método de Pago</h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    {[
                      { id: 'card', title: 'Tarjeta', icon: <CreditCard className="w-5 h-5" /> },
                      { id: 'paypal', title: 'PayPal', icon: <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="w-8" /> }
                    ].map((method) => (
                      <button
                        key={method.id}
                        onClick={() => setPaymentMethod(method.id as any)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all gap-2 ${
                          paymentMethod === method.id 
                            ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5 shadow-sm' 
                            : 'border-gray-100 hover:border-gray-200 bg-white'
                        }`}
                      >
                        <div className={paymentMethod === method.id ? 'text-[var(--color-brand)]' : 'text-gray-400'}>
                          {method.icon}
                        </div>
                        <span className={`text-sm font-bold ${paymentMethod === method.id ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-secondary)]'}`}>
                          {method.title}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mb-6">
                    {paymentMethod === 'card' && (
                      <div className="space-y-6">
                        {paymentMethods.length > 0 && (
                          <label className="flex items-center gap-3 cursor-pointer group mb-4">
                            <div className="relative flex items-center justify-center w-5 h-5 border border-gray-300 rounded bg-white group-hover:border-[var(--color-brand)] transition-colors">
                              <input 
                                type="checkbox" 
                                className="peer sr-only" 
                                checked={useSavedCard}
                                onChange={(e) => setUseSavedCard(e.target.checked)}
                              />
                              <div className="hidden peer-checked:block w-3 h-3 bg-[var(--color-brand)] rounded-sm"></div>
                            </div>
                            <span className="font-bold text-[var(--color-text-primary)]">Usar tarjeta guardada</span>
                          </label>
                        )}

                        {useSavedCard && paymentMethods.length > 0 ? (
                          <div className="space-y-4">
                            {paymentMethods.map((pm) => (
                              <div 
                                key={pm.id} 
                                onClick={() => setSelectedCardId(pm.id)}
                                className={`p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${
                                  selectedCardId === pm.id ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5' : 'border-gray-100 hover:border-gray-200'
                                }`}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-8 bg-gray-800 rounded flex items-center justify-center text-white text-[10px] font-bold uppercase">{pm.brand}</div>
                                  <div>
                                    <p className="font-bold text-[var(--color-text-primary)] uppercase">**** **** **** {pm.last4}</p>
                                    <p className="text-sm text-[var(--color-text-secondary)]">Expira {pm.expMonth}/{pm.expYear}</p>
                                  </div>
                                </div>
                                {selectedCardId === pm.id && <Check className="w-6 h-6 text-[var(--color-brand)]" />}
                              </div>
                            ))}
                          </div>
                        ) : (
                          <PaymentMethodForm 
                            onSuccess={() => {
                              setUseSavedCard(true);
                            }}
                            onCancel={() => setUseSavedCard(paymentMethods.length > 0)}
                          />
                        )}
                      </div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className="p-8 border-2 border-dashed border-gray-200 rounded-3xl text-center">
                        <img src="https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_37x23.jpg" alt="PayPal" className="w-20 mx-auto mb-4" />
                        <p className="text-[var(--color-text-secondary)] mb-6">Serás redirigido a PayPal para completar tu compra de forma segura (Simulado).</p>
                        <div className="bg-[#0070ba] text-white font-bold py-3 px-6 rounded-xl inline-block cursor-pointer">
                          Pagar con PayPal
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[var(--color-text-secondary)]">Subtotal</span>
                      <span className="font-bold text-[var(--color-text-primary)]">${total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[var(--color-text-secondary)]">Envío ({shippingMethod})</span>
                      <span className="font-bold text-[var(--color-text-primary)]">${shippingCosts[shippingMethod as keyof typeof shippingCosts].toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-200 mt-4">
                      <span className="text-lg font-bold text-[var(--color-text-primary)]">Total a pagar</span>
                      <span className="text-2xl font-extrabold text-[var(--color-brand)]">${finalTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-support)] font-medium mt-4">
                      <ShieldCheck className="w-4 h-4" />
                      Transacción encriptada de extremo a extremo
                    </div>
                  </div>

                  <div className="pt-6 flex justify-between">
                    <button onClick={prevStep} className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] font-bold px-6 py-4 rounded-xl transition-colors">
                      Volver
                    </button>
                    <button 
                      onClick={handleConfirmOrder}
                      disabled={isProcessing}
                      className="bg-[var(--color-support)] hover:bg-emerald-600 text-white font-bold px-8 py-4 rounded-xl flex items-center gap-2 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Procesando...
                        </>
                      ) : (
                        <>
                          Confirmar Pago <Check className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
