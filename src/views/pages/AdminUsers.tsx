import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, Search, User as UserIcon, Mail, Phone, Calendar,
  ShieldAlert, ShieldCheck, MoreVertical, X, Check, Loader2, ArrowLeft
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../../controllers/context/AuthContext';
import { collection, getDocs, doc, updateDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../../firebase';
import { PageLayout } from '../../components/layout/PageLayout';

export function AdminUsers() {
  const { isAdmin, loading: authLoading } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin]);

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const q = query(collection(db, 'users'), orderBy('email', 'asc'));
      const snapshot = await getDocs(q);
      setUsers(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, { role: newRole, updatedAt: new Date().toISOString() });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      showToast(`Rol actualizado a ${newRole}`);
    } catch (error) {
      showToast("Error al actualizar rol");
    }
  };

  const filteredUsers = users.filter(user => 
    (user.email?.toLowerCase().includes(searchQuery.toLowerCase()) || 
     user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
     user.paternalLastName?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (authLoading) return (
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
          
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
            <div className="flex items-center gap-6">
              <Link 
                to="/admin"
                className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-gray-900 transition-all shadow-sm hover:shadow-md"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight mb-2">Gestión de Usuarios</h1>
                <p className="text-gray-500 font-medium">Visualiza los perfiles registrados y gestiona los roles administrativos.</p>
              </div>
            </div>

            <div className="relative w-full md:w-96">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                type="text"
                placeholder="Buscar usuarios por nombre o correo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all shadow-sm"
              />
            </div>
          </div>

          <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50/50 text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                    <th className="px-8 py-5">Usuario</th>
                    <th className="px-8 py-5">Contacto</th>
                    <th className="px-8 py-5">Rol Actual</th>
                    <th className="px-8 py-5">Registro</th>
                    <th className="px-8 py-5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isLoading ? (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <Loader2 className="w-8 h-8 animate-spin text-[var(--color-brand)] mx-auto mb-4" />
                        <p className="text-gray-400">Cargando base de datos de usuarios...</p>
                      </td>
                    </tr>
                  ) : filteredUsers.length > 0 ? filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${
                            user.role === 'admin' ? 'bg-indigo-50 text-indigo-600' : 
                            user.role === 'superadmin' ? 'bg-purple-50 text-purple-600' : 
                            'bg-gray-50 text-gray-400'
                          }`}>
                            {user.name?.charAt(0) || <UserIcon className="w-6 h-6" />}
                          </div>
                          <div>
                            <p className="font-extrabold text-gray-900 text-lg">
                              {user.name} {user.paternalLastName} {user.maternalLastName}
                            </p>
                            <p className="text-sm font-medium text-gray-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Mail className="w-3.5 h-3.5" /> {user.email}
                          </div>
                          {user.phoneNumber && (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Phone className="w-3.5 h-3.5" /> {user.phoneNumber}
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${
                          user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' :
                          user.role === 'superadmin' ? 'bg-purple-100 text-purple-700' :
                          'bg-gray-100 text-gray-600'
                        }`}>
                          {user.role === 'admin' || user.role === 'superadmin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                          {user.role || 'cliente'}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Calendar className="w-3.5 h-3.5" /> 
                          {user.createdAt ? (typeof user.createdAt === 'string' ? new Date(user.createdAt).toLocaleDateString() : user.createdAt.toDate().toLocaleDateString()) : 'N/A'}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select 
                            value={user.role || 'cliente'}
                            onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-600 focus:outline-none focus:border-[var(--color-brand)] appearance-none cursor-pointer"
                          >
                            <option value="cliente">Cliente</option>
                            <option value="admin">Administrador</option>
                            <option value="superadmin">Superadmin</option>
                          </select>
                        </div>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-20 text-center">
                        <Users className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-gray-900 mb-1">No se encontraron usuarios</h3>
                        <p className="text-gray-400">Intenta con otros términos de búsqueda.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="fixed bottom-8 right-8 px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 bg-gray-900 text-white"
            >
              <Check className="w-5 h-5 text-emerald-400" />
              <span className="font-bold">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}
