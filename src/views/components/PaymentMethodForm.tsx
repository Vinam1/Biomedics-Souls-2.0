import React, { useState } from 'react';
import { Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import { useAuth } from '../../controllers/context/AuthContext';
import { UserController } from '../../controllers/userController';

interface PaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function PaymentMethodForm({ onSuccess, onCancel }: PaymentMethodFormProps) {
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiry: '',
    cvv: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    // Basic validation
    if (formData.cardNumber.length < 16 || formData.cvv.length < 3) {
      setError('Por favor, ingresa datos de tarjeta válidos.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Save to Firestore using the UserController
      await UserController.addPaymentMethod(user.uid, {
        type: 'card',
        cardBrand: 'Visa', // Simulated
        brand: 'Visa',
        last4: formData.cardNumber.slice(-4),
        lastFour: formData.cardNumber.slice(-4),
        expMonth: parseInt(formData.expiry.split('/')[0]) || 12,
        expYear: parseInt(formData.expiry.split('/')[1]) || 2026,
        isDefault: false,
        isActive: true
      });

      onSuccess();
    } catch (err: any) {
      console.error('Error saving payment method:', err);
      setError(err.message || 'Ocurrió un error al guardar la tarjeta.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-6 rounded-2xl border border-gray-100">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-[var(--color-brand)]/10 rounded-xl flex items-center justify-center text-[var(--color-brand)]">
          <CreditCard className="w-6 h-6" />
        </div>
        <div>
          <h3 className="font-bold text-[var(--color-text-primary)]">Nueva Tarjeta</h3>
          <p className="text-xs text-[var(--color-text-secondary)]">Simulación de pago seguro.</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Número de Tarjeta</label>
          <input
            type="text"
            maxLength={16}
            value={formData.cardNumber}
            onChange={(e) => setFormData({...formData, cardNumber: e.target.value.replace(/\D/g, '')})}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] transition-all"
            placeholder="0000 0000 0000 0000"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Nombre en la Tarjeta</label>
          <input
            type="text"
            value={formData.cardHolder}
            onChange={(e) => setFormData({...formData, cardHolder: e.target.value})}
            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] transition-all"
            placeholder="JUAN PEREZ"
            required
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">Vencimiento (MM/YY)</label>
            <input
              type="text"
              maxLength={5}
              value={formData.expiry}
              onChange={(e) => setFormData({...formData, expiry: e.target.value})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] transition-all"
              placeholder="12/26"
              required
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider">CVV</label>
            <input
              type="password"
              maxLength={4}
              value={formData.cvv}
              onChange={(e) => setFormData({...formData, cvv: e.target.value.replace(/\D/g, '')})}
              className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] transition-all"
              placeholder="***"
              required
            />
          </div>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg flex items-center gap-2">
          <span className="font-bold">!</span> {error}
        </div>
      )}

      <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <ShieldCheck className="w-5 h-5 text-blue-600" />
        <p className="text-xs text-blue-700">
          Tus datos están protegidos por encriptación de grado bancario (Simulado).
        </p>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={isProcessing}
          className="flex-1 py-3 px-4 bg-white border border-gray-200 text-[var(--color-text-primary)] font-bold rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isProcessing}
          className="flex-1 py-3 px-4 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-brand-hover)] transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Procesando...
            </>
          ) : (
            'Guardar Tarjeta'
          )}
        </button>
      </div>
    </form>
  );
}
