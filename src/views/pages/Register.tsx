import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../../firebase';
import { User, Mail, Lock, Phone, UserPlus, ArrowRight } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';

export function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    paternalLastName: '',
    maternalLastName: '',
    phoneNumber: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;

      const userProfile = {
        uid: user.uid,
        email: formData.email,
        name: formData.name,
        paternalLastName: formData.paternalLastName,
        maternalLastName: formData.maternalLastName,
        phoneNumber: formData.phoneNumber,
        createdAt: serverTimestamp(),
        role: 'user'
      };

      try {
        await setDoc(doc(db, 'users', user.uid), userProfile);
        navigate('/account');
      } catch (err) {
        handleFirestoreError(err, OperationType.WRITE, `users/${user.uid}`);
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError('El correo ya está en uso');
      } else if (err.code === 'auth/weak-password') {
        setError('La contraseña es muy débil');
      } else {
        setError('Error al registrar usuario. Inténtalo de nuevo.');
      }
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
              <UserPlus className="w-8 h-8" />
            </div>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-[var(--color-text-primary)] tracking-tight">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-center text-sm text-[var(--color-text-secondary)]">
            O{' '}
            <Link to="/login" className="font-bold text-[var(--color-brand)] hover:text-[var(--color-brand-hover)] transition-colors">
              inicia sesión si ya tienes una
            </Link>
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-[2rem] sm:px-10 border border-gray-100"
          >
            <form className="space-y-6" onSubmit={handleRegister}>
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm font-medium">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Nombre</label>
                  <div className="relative">
                    <input 
                      name="name"
                      type="text" 
                      required 
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                      placeholder="Juan" 
                    />
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Apellido Paterno</label>
                  <input 
                    name="paternalLastName"
                    type="text" 
                    required 
                    value={formData.paternalLastName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                    placeholder="Pérez" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Apellido Materno</label>
                  <input 
                    name="maternalLastName"
                    type="text" 
                    required 
                    value={formData.maternalLastName}
                    onChange={handleChange}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                    placeholder="García" 
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Número Telefónico</label>
                  <div className="relative">
                    <input 
                      name="phoneNumber"
                      type="tel" 
                      required 
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                      placeholder="5512345678" 
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Contraseña</label>
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
                  <label className="block text-sm font-bold text-[var(--color-text-secondary)] mb-2">Confirmar Contraseña</label>
                  <div className="relative">
                    <input 
                      name="confirmPassword"
                      type="password" 
                      required 
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-12 pr-4 py-3 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all" 
                      placeholder="••••••••" 
                    />
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-2xl shadow-lg text-lg font-bold text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[var(--color-brand)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Registrando...' : (
                    <>
                      Crear Cuenta <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
