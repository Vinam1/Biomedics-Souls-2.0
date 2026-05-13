import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, LogOut, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SearchBar } from '../../views/components/SearchBar';
import { useAuth } from '../../controllers/context/AuthContext';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';

export function Header() {
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-12 h-12 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-tr from-[var(--color-celeste)] via-[var(--color-purple)] to-[var(--color-dark-blue)] animate-spin-slow group-hover:animate-none">
                <div className="w-full h-full rounded-full bg-white"></div>
              </div>
              <span className="relative z-10 font-serif text-2xl font-bold text-[var(--color-dark-blue)] tracking-tighter">
                BS
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-xl tracking-tight leading-none text-[var(--color-dark-blue)]">Biomedics Souls</span>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--color-text-secondary)] font-bold">Innovation & Life</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-medium text-[var(--color-text-secondary)]">
            {[
              { name: 'Catálogo', path: '/catalog' },
              { name: 'Ciencia', path: '/science' },
              { name: 'FAQ', path: '/faq' },
              { name: 'Quiz', path: '/quiz' },
              { name: 'Contacto', path: '/contact' },
              ...(isAdmin ? [{ name: 'Admin', path: '/admin' }] : [])
            ].map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className="relative group py-2 hover:text-[var(--color-brand)] transition-colors"
              >
                {link.name}
                {location.pathname === link.path ? (
                  <motion.span 
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-[var(--color-brand)]"
                    layoutId="nav-underline"
                  />
                ) : (
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[var(--color-brand)] transition-all group-hover:w-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2 md:gap-5 text-[var(--color-text-primary)]">
            <SearchBar />
            {user ? (
              <Link to="/account" className="hidden md:flex p-2 hover:bg-gray-50 rounded-full transition-colors">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link to="/login" className="hidden md:flex items-center gap-2 px-4 py-2 bg-[var(--color-brand)] text-white font-bold rounded-xl hover:bg-[var(--color-brand-hover)] transition-all text-sm">
                Iniciar Sesión
              </Link>
            )}
            <Link to="/cart" className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
              <ShoppingCart className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-[var(--color-brand)] rounded-full"></span>
            </Link>
          </div>

          <button 
            className="md:hidden p-2 text-[var(--color-text-primary)]"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 bg-white"
          >
            <div className="px-4 py-6 flex flex-col gap-4 font-medium text-[var(--color-text-secondary)]">
              <Link to="/catalog" className="hover:text-[var(--color-brand)] transition-colors">Catálogo</Link>
              <Link to="/science" className="hover:text-[var(--color-brand)] transition-colors">Ciencia</Link>
              <Link to="/faq" className="hover:text-[var(--color-brand)] transition-colors">FAQ</Link>
              <Link to="/quiz" className="hover:text-[var(--color-brand)] transition-colors">Quiz</Link>
              <Link to="/contact" className="hover:text-[var(--color-brand)] transition-colors">Contacto</Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-[var(--color-brand)] transition-colors font-black text-[var(--color-brand)]">Admin Dashboard</Link>
              )}
              <div className="h-px bg-gray-100 my-2"></div>
              {user ? (
                <>
                  <Link to="/account" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition-colors">
                    <User className="w-5 h-5" /> Mi Cuenta
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-red-500 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-5 h-5" /> Cerrar Sesión
                  </button>
                </>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link to="/login" className="flex items-center justify-center py-3 bg-[var(--color-brand)] text-white font-bold rounded-xl">
                    Iniciar Sesión
                  </Link>
                  <Link to="/register" className="flex items-center justify-center py-3 border border-gray-200 text-[var(--color-text-primary)] font-bold rounded-xl">
                    Crear Cuenta
                  </Link>
                </div>
              )}
              <Link to="/cart" className="flex items-center gap-2 hover:text-[var(--color-brand)] transition-colors">
                <ShoppingCart className="w-5 h-5" /> Carrito
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
