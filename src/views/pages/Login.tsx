import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../firebase';
import { Mail, Lock, LogIn, ArrowRight, X } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';

export function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      navigate('/account');
    } catch (err: any) {
      console.error("Login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Correo o contraseña incorrectos');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Demasiados intentos. Inténtalo más tarde.');
      } else {
        setError('Error al iniciar sesión. Inténtalo de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setResetSent(true);
      setTimeout(() => {
        setShowResetModal(false);
        setResetSent(false);
        setResetEmail('');
      }, 3000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      setError('Error al enviar el correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageLayout>
      <div className="min-h-screen bg-[var(--color-bg-light)] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-[var(--color-brand)] rounded-2xl flex items-center justify-center text-white shadow-lg">
              <LogIn className="w-8 h-8" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
            Bienvenido de nuevo
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="font-bold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors">
              Regístrate aquí
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-[2rem] sm:px-10 border border-gray-100"
          >
            <form className="space-y-6" onSubmit={handleLogin}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Correo Electrónico</label>
                <div className="relative">
                  <input 
                    name="email"
                    type="email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                    placeholder="juan@ejemplo.com" 
                  />
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-bold text-[var(--color-text-secondary)]">Contraseña</label>
                  <button 
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-xs font-bold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <input 
                    name="password"
                    type="password" 
                    required 
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                    placeholder="••••••••" 
                  />
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Iniciando...' : (
                    <>
                      Iniciar Sesión <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>

        <AnimatePresence>
          {showResetModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowResetModal(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[2rem] shadow-2xl p-8 w-full max-w-md border border-gray-100"
              >
                <button 
                  onClick={() => setShowResetModal(false)}
                  className="absolute top-6 right-6 p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>

                <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">Recuperar contraseña</h3>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.
                </p>

                {resetSent ? (
                  <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-4 rounded-2xl text-center font-medium">
                    ¡Correo enviado con éxito!
                  </div>
                ) : (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="relative">
                      <input 
                        type="email" 
                        required 
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                        placeholder="tu@correo.com" 
                      />
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 px-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl shadow-lg hover:bg-[var(--color-brand-hover)] transition-all disabled:opacity-50"
                    >
                      {loading ? 'Enviando...' : 'Enviar enlace'}
                    </button>
                  </form>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
