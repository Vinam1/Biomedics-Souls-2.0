import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Search, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ProductController } from '../../controllers/productController';
import { Product } from '../../models/types';

const PLACEHOLDERS = [
  "¿Qué suplemento necesitas hoy?",
  "Busca 'Vinagre de Manzana' para digestión...",
  "Busca 'Camu Camu' para inmunidad...",
  "Busca 'Cordyboost' para energía...",
  "Busca 'Ashwagandha' para relajación...",
  "Busca 'Magnesio' para bienestar..."
];

export function SearchBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Dynamic placeholder logic
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Sync query with URL if we are on catalog page
  useEffect(() => {
    if (location.pathname === '/catalog') {
      const params = new URLSearchParams(location.search);
      const q = params.get('q');
      if (q) setQuery(q);
    }
  }, [location.pathname, location.search]);

  const [allProducts, setAllProducts] = useState<Product[]>([]);

  // Load products for searching
  useEffect(() => {
    ProductController.getAll().then(setAllProducts);
  }, []);

  // Suggestions logic
  useEffect(() => {
    if (query.trim().length >= 2) {
      const filtered = allProducts.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        (p.tagIds && p.tagIds.some(t => t.toLowerCase().includes(query.toLowerCase())))
      ).slice(0, 5);
      setSuggestions(filtered as any[]);
    } else {
      setSuggestions([]);
    }
  }, [query, allProducts]);

  // Handle click outside to collapse/close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsExpanded(false);
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (query.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(query.trim())}`);
      setIsExpanded(false);
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const highlightMatch = (text: string, match: string) => {
    if (!match) return text;
    const parts = text.split(new RegExp(`(${match})`, 'gi'));
    return (
      <span>
        {parts.map((part, i) => 
          part.toLowerCase() === match.toLowerCase() 
            ? <b key={i} className="text-[var(--color-brand)]">{part}</b> 
            : part
        )}
      </span>
    );
  };

  return (
    <div ref={containerRef} className="relative flex items-center">
      {/* Desktop Version */}
      <div className="hidden md:block relative">
        <form 
          onSubmit={handleSearch}
          className={`relative flex items-center transition-all duration-300 ${
            isFocused ? 'w-96' : 'w-64'
          }`}
        >
          <div className={`absolute left-4 z-10 transition-colors duration-300 ${
            isFocused ? 'text-[var(--color-brand)]' : 'text-gray-400'
          }`}>
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={PLACEHOLDERS[placeholderIndex]}
            className={`w-full bg-gray-50 border-2 rounded-full pl-11 pr-12 py-2.5 text-sm font-medium transition-all duration-300 focus:outline-none focus:bg-white ${
              isFocused 
                ? 'border-[var(--color-brand)] shadow-lg shadow-[var(--color-brand)]/5' 
                : 'border-transparent hover:border-gray-200'
            }`}
          />
          <AnimatePresence>
            {query && (
              <motion.button
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                type="submit"
                className="absolute right-2 p-1.5 bg-[var(--color-brand)] text-white rounded-full hover:bg-[var(--color-brand-hover)] transition-colors"
              >
                <ArrowRight className="w-3.5 h-3.5" />
              </motion.button>
            )}
          </AnimatePresence>
        </form>

        {/* Suggestions Dropdown */}
        <AnimatePresence>
          {isFocused && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-[60]"
            >
              <div className="p-2">
                {suggestions.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => {
                      setQuery(product.name);
                      navigate(`/catalog?q=${encodeURIComponent(product.name)}`);
                      setIsFocused(false);
                    }}
                    className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-xl transition-colors text-left"
                  >
                    <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                      <img 
                        src={product.img} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-grow min-w-0">
                      <div className="text-sm text-[var(--color-text-primary)] truncate">
                        {highlightMatch(product.name, query)}
                      </div>
                      <div className="text-xs text-[var(--color-text-secondary)]">
                        Categoría: {(product as any).category_name || 'General'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="bg-gray-50 p-3 border-t border-gray-100">
                <button 
                  onClick={handleSearch}
                  className="text-xs font-bold text-[var(--color-brand)] hover:underline flex items-center gap-1"
                >
                  Ver todos los resultados para "{query}" <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile Version */}
      <div className="md:hidden flex items-center">
        <AnimatePresence>
          {isExpanded ? (
            <div className="fixed inset-0 z-[100] bg-white/95 backdrop-blur-sm p-4">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex flex-col h-full"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="flex-grow relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <form onSubmit={handleSearch}>
                      <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={PLACEHOLDERS[placeholderIndex]}
                        className="w-full bg-gray-100 border-none rounded-xl pl-10 pr-4 py-3 text-base font-medium focus:ring-2 focus:ring-[var(--color-brand)]"
                        autoFocus
                      />
                    </form>
                  </div>
                  <button 
                    onClick={() => setIsExpanded(false)} 
                    className="p-2 text-gray-500 hover:text-gray-700"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <div className="flex-grow overflow-y-auto">
                  {suggestions.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Sugerencias</p>
                      {suggestions.map((product) => (
                        <button
                          key={product.id}
                          onClick={() => {
                            setQuery(product.name);
                            navigate(`/catalog?q=${encodeURIComponent(product.name)}`);
                            setIsExpanded(false);
                          }}
                          className="w-full flex items-center gap-4 p-3 hover:bg-gray-50 rounded-2xl transition-colors text-left border border-gray-50"
                        >
                          <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                            <img 
                              src={product.img} 
                              alt={product.name} 
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-sm font-bold text-[var(--color-text-primary)] truncate">
                              {highlightMatch(product.name, query)}
                            </div>
                            <div className="text-xs text-[var(--color-text-secondary)]">
                              {product.tagIds && product.tagIds.length > 0 ? product.tagIds[0] : 'General'}
                            </div>
                          </div>
                        </button>
                      ))}
                      <button 
                        onClick={handleSearch}
                        className="w-full p-4 text-center text-[var(--color-brand)] font-bold text-sm hover:bg-gray-50 rounded-xl transition-colors mt-4"
                      >
                        Ver todos los resultados para "{query}"
                      </button>
                    </div>
                  ) : query.length >= 2 ? (
                    <div className="text-center py-12">
                      <p className="text-gray-400">No se encontraron resultados para "{query}"</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-1">Búsquedas populares</p>
                      <div className="flex flex-wrap gap-2">
                        {["Vinagre de Manzana", "Camu Camu", "Cordyboost", "Ashwagandha", "Magnesio"].map(term => (
                          <button 
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-gray-200 transition-colors"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          ) : (
            <motion.button
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              onClick={toggleExpand}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Search className="w-5 h-5 text-[var(--color-text-primary)]" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
