import { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Filter, ChevronDown, ChevronUp, ShoppingCart, Star, Search, X, Check } from 'lucide-react';
import { useCart } from '../../controllers/context/CartContext';
import { Product } from '../../models/types';
import { ProductController } from '../../controllers/productController';
import { PageLayout } from '../../components/layout/PageLayout';

export function Catalog() {
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(100);
  const [sortBy, setSortBy] = useState('Destacados');
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({
    categoria: false,
    formato: false,
    precio: false
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
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
    fetchProducts();
  }, []);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    showToast(`${product.name} añadido al carrito`);
  };

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const q = params.get('q');
    if (q !== null) {
      setSearchQuery(q);
    }
  }, [location.search]);

  const toggleSection = (section: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const toggleFormat = (format: string) => {
    setSelectedFormats(prev => 
      prev.includes(format) ? prev.filter(f => f !== format) : [...prev, format]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedFormats([]);
    setPriceRange(100);
    setSearchQuery('');
  };

  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (product.shortDesc && product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesCategory = selectedCategories.length === 0 || 
                             selectedCategories.includes(product.categoryId);
      
      const formatMatch = selectedFormats.length === 0 || selectedFormats.some(f => 
        product.netContent.toLowerCase().includes(f.toLowerCase()) || 
        product.name.toLowerCase().includes(f.toLowerCase()) ||
        product.desc.toLowerCase().includes(f.toLowerCase()) ||
        (product.formatId && product.formatId.toLowerCase().includes(f.toLowerCase()))
      );

      const currentPrice = product.discountPrice || product.price;
      const matchesPrice = currentPrice <= priceRange;

      return matchesSearch && matchesCategory && formatMatch && matchesPrice;
    });

    if (sortBy === 'Precio: Menor a Mayor') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'Precio: Mayor a Menor') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'Mejor Valorados') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return result;
  }, [products, searchQuery, selectedCategories, selectedFormats, priceRange, sortBy]);

  return (
    <PageLayout>
      <div className="bg-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-10 gap-6">
            <div className="w-full lg:w-auto">
              <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">Catálogo de Fórmulas</h1>
              <p className="text-[var(--color-text-secondary)] text-lg">Soluciones para cada objetivo biológico.</p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
              <div className="relative w-full sm:w-64">
                <input
                  type="text"
                  placeholder="Buscar fórmulas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2 text-[var(--color-text-primary)] font-medium focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <button 
                  className="md:hidden flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-[var(--color-text-primary)] font-medium"
                  onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
                >
                  <Filter className="w-4 h-4" />
                  Filtros
                </button>
                <div className="relative flex-1 sm:w-48">
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full appearance-none bg-white border border-gray-200 rounded-lg px-4 py-2 pr-10 text-[var(--color-text-primary)] font-medium focus:outline-none focus:border-[var(--color-brand)]"
                  >
                    <option>Destacados</option>
                    <option>Precio: Menor a Mayor</option>
                    <option>Precio: Mayor a Menor</option>
                    <option>Mejor Valorados</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar Filters */}
            <aside className={`w-full md:w-64 flex-shrink-0 ${isMobileFiltersOpen ? 'block' : 'hidden md:block'}`}>
              <div className="sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto pr-4 custom-scrollbar space-y-8">
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                  <h2 className="font-black text-xs uppercase tracking-[0.2em] text-gray-400">Filtros</h2>
                  {(selectedCategories.length > 0 || selectedFormats.length > 0 || priceRange < 100 || searchQuery) && (
                    <button 
                      onClick={clearFilters}
                      className="flex items-center gap-1.5 text-[10px] font-bold text-red-500 hover:text-red-600 transition-colors bg-red-50 px-2 py-1 rounded-lg"
                    >
                      <X className="w-3 h-3" />
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Categoría */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    onClick={() => toggleSection('categoria')}
                    className="flex items-center justify-between w-full font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider text-sm group"
                  >
                    Categoría
                    {collapsedSections.categoria ? <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-brand)]" /> : <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-brand)]" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {!collapsedSections.categoria && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3">
                          {['Herbales', 'Vitaminas', 'Minerales', 'Cosmética'].map((cat) => (
                            <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`relative flex items-center justify-center w-5 h-5 border rounded transition-all ${selectedCategories.includes(cat) ? 'border-[var(--color-brand)] bg-[var(--color-brand)]' : 'border-gray-300 bg-white group-hover:border-[var(--color-brand)]'}`}>
                                <input 
                                  type="checkbox" 
                                  className="sr-only" 
                                  checked={selectedCategories.includes(cat)}
                                  onChange={() => toggleCategory(cat)}
                                />
                                {selectedCategories.includes(cat) && <CheckIcon className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm transition-colors ${selectedCategories.includes(cat) ? 'text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'}`}>{cat}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Formato */}
                <div className="border-b border-gray-100 pb-6">
                  <button 
                    onClick={() => toggleSection('formato')}
                    className="flex items-center justify-between w-full font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider text-sm group"
                  >
                    Formato
                    {collapsedSections.formato ? <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-brand)]" /> : <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-brand)]" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {!collapsedSections.formato && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-3">
                          {['Cápsulas', 'Polvo', 'Líquido', 'Serum', 'Gel'].map((format) => (
                            <label key={format} className="flex items-center gap-3 cursor-pointer group">
                              <div className={`relative flex items-center justify-center w-5 h-5 border rounded transition-all ${selectedFormats.includes(format) ? 'border-[var(--color-brand)] bg-[var(--color-brand)]' : 'border-gray-300 bg-white group-hover:border-[var(--color-brand)]'}`}>
                                <input 
                                  type="checkbox" 
                                  className="sr-only" 
                                  checked={selectedFormats.includes(format)}
                                  onChange={() => toggleFormat(format)}
                                />
                                {selectedFormats.includes(format) && <CheckIcon className="w-3 h-3 text-white" />}
                              </div>
                              <span className={`text-sm transition-colors ${selectedFormats.includes(format) ? 'text-[var(--color-text-primary)] font-bold' : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'}`}>{format}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Precio */}
                <div>
                  <button 
                    onClick={() => toggleSection('precio')}
                    className="flex items-center justify-between w-full font-bold text-[var(--color-text-primary)] mb-4 uppercase tracking-wider text-sm group"
                  >
                    Precio Máximo
                    {collapsedSections.precio ? <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-brand)]" /> : <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[var(--color-brand)]" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {!collapsedSections.precio && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-2">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            step="5"
                            value={priceRange}
                            onChange={(e) => setPriceRange(Number(e.target.value))}
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--color-brand)]" 
                          />
                          <div className="flex justify-between text-xs font-bold text-[var(--color-text-secondary)] mt-3">
                            <span>$0</span>
                            <span className="text-[var(--color-brand)] bg-[var(--color-brand)]/10 px-2 py-0.5 rounded">${priceRange}{priceRange === 100 ? '+' : ''}</span>
                            <span>$100+</span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm text-[var(--color-text-secondary)]">
                  Mostrando <span className="font-bold text-[var(--color-text-primary)]">{filteredProducts.length}</span> productos
                </p>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                  <div className="w-12 h-12 border-4 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : filteredProducts.length > 0 ? (
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {filteredProducts.map((product, i) => (
                    <motion.div 
                      key={product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05, duration: 0.4 }}
                      className="bg-white rounded-xl sm:rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col"
                    >
                      <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
                        {product.tagIds && product.tagIds.length > 0 && (
                          <span className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 bg-white/90 backdrop-blur-sm px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-bold text-[var(--color-text-primary)] shadow-sm">
                            {product.tagIds[0]}
                          </span>
                        )}
                        <img 
                          src={product.img} 
                          alt={product.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </Link>
                      <div className="p-3 sm:p-5 flex flex-col flex-grow">
                        <div className="flex items-center gap-1 mb-1 sm:mb-2">
                          <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs sm:text-sm font-bold text-[var(--color-text-primary)]">{product.rating || 0}</span>
                          <span className="text-[10px] sm:text-xs text-[var(--color-text-secondary)]">({product.totalReviews || 0})</span>
                        </div>
                        <Link to={`/product/${product.id}`}>
                          <h3 className="text-sm sm:text-lg font-bold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-brand)] transition-colors line-clamp-1 sm:line-clamp-none">{product.name}</h3>
                        </Link>
                        <p className="hidden sm:block text-sm text-[var(--color-text-secondary)] mb-4 flex-grow line-clamp-2">{product.shortDesc || product.desc}</p>
                        <div className="flex items-center justify-between mt-auto pt-2 sm:pt-4 border-t border-gray-50">
                          <div className="flex flex-col">
                            <span className={`text-base sm:text-xl font-extrabold ${product.discountPrice ? 'text-red-600' : 'text-[var(--color-text-primary)]'}`}>
                              ${(product.discountPrice || product.price).toFixed(2)}
                            </span>
                            {product.discountPrice && (
                              <span className="text-[10px] sm:text-xs text-gray-400 line-through">${product.price.toFixed(2)}</span>
                            )}
                          </div>
                          <button 
                            onClick={() => handleAddToCart(product)}
                            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center hover:bg-[var(--color-brand-hover)] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
                          >
                            <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm h-full flex flex-col items-center justify-center min-h-[400px]">
                  <Search className="w-12 h-12 text-gray-300 mb-4" />
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No se encontraron productos</h3>
                  <p className="text-[var(--color-text-secondary)] mb-6">Intenta buscar con otros términos o ajusta los filtros.</p>
                  <button 
                    onClick={clearFilters}
                    className="px-6 py-2 bg-[var(--color-brand)] text-white font-bold rounded-lg hover:bg-[var(--color-brand-hover)] transition-colors"
                  >
                    Limpiar todos los filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Toast Notification */}
        <AnimatePresence>
          {toast && (
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-8 right-8 px-6 py-3 rounded-2xl shadow-2xl z-50 flex items-center gap-3 bg-[var(--color-support)] text-white"
            >
              <Check className="w-5 h-5" />
              <span className="font-bold">{toast}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </PageLayout>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor" 
      strokeWidth={4}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
