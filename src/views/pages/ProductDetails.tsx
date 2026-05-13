import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, Star, Check, ShieldCheck, Activity, ChevronDown, ChevronUp, Minus, Plus, Info, Package, Scale, Pill, X } from 'lucide-react';
import { useCart } from '../../controllers/context/CartContext';
import { useAuth } from '../../controllers/context/AuthContext';
import { ProductController } from '../../controllers/productController';
import { Product, Review } from '../../models/types';
import { PageLayout } from '../../components/layout/PageLayout';

export function ProductDetails() {
  const { addItem } = useCart();
  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'nutri' | 'reviews'>('desc');
  const [activeImage, setActiveImage] = useState(0);
  const [toast, setToast] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({ rating: 5, comment: '' });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    const fetchProductData = async () => {
      setIsLoading(true);
      const data = await ProductController.getById(id);
      setProduct(data);
      
      if (data) {
        const allProducts = await ProductController.getAll();
        setRelatedProducts(
          allProducts
            .filter(p => p.categoryId === data.categoryId && p.id !== id)
            .slice(0, 4)
        );
      }
      setIsLoading(false);
    };

    fetchProductData();
    
    const unsubscribe = ProductController.getReviews(id, (fetchedReviews) => {
      setReviews(fetchedReviews);
    });
    
    return () => unsubscribe();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      showToast("Debes iniciar sesión para dejar una reseña");
      return;
    }
    
    setIsSubmittingReview(true);
    try {
      if (!id) return;
      await ProductController.addReview(id, {
        productId: id,
        userId: user.uid,
        userName: user.displayName || 'Usuario',
        rating: reviewFormData.rating,
        comment: reviewFormData.comment,
        status: 'publicada'
      } as any);
      
      setIsReviewModalOpen(false);
      setReviewFormData({ rating: 5, comment: '' });
      showToast("¡Gracias por tu reseña!");
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Error al enviar la reseña");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = () => {
    if (!product) return;
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
    showToast(`${product.name} (${quantity}) añadido al carrito`);
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[var(--color-brand)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </PageLayout>
    );
  }

  if (!product) {
    return <Navigate to="/catalog" replace />;
  }

  const presentation = product.formatId ? (
    product.formatId === 'capsule' ? 'Cápsulas' :
    product.formatId === 'pill' ? 'Píldoras' :
    product.formatId === 'tablet' ? 'Comprimidos' :
    product.formatId === 'liquid' ? 'Líquido' :
    product.formatId === 'powder' ? 'Polvo' : 'Otro'
  ) : (product.categoryId === 'Cosmética' ? 'Frasco' : 'Cápsulas vegetales');
  
  const weight = product.netContent;
  const usage = product.usageInstructions || "Consulte la etiqueta del producto para instrucciones específicas de uso. Generalmente se recomienda tomar con agua y preferiblemente con alimentos.";
  
  const images = product.images && product.images.length > 0 ? product.images : [product.img];

  return (
    <PageLayout>
      <div className="bg-white min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Breadcrumbs */}
          <nav className="flex text-sm text-[var(--color-text-secondary)] mb-8 font-medium">
            <Link to="/" className="hover:text-[var(--color-brand)] transition-colors">Inicio</Link>
            <span className="mx-2">/</span>
            <Link to="/catalog" className="hover:text-[var(--color-brand)] transition-colors">Catálogo</Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-text-primary)]">{product.name}</span>
          </nav>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            {/* Image Gallery */}
            <div className="flex flex-col-reverse md:flex-row gap-4">
              <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-visible">
                {images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === idx ? 'border-[var(--color-brand)] shadow-md' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </button>
                ))}
              </div>
              <div className="flex-1 bg-[var(--color-bg-light)] rounded-3xl overflow-hidden aspect-square relative border border-gray-100 shadow-sm">
                {product.tagIds && product.tagIds.length > 0 && (
                  <span className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full text-sm font-bold text-[var(--color-text-primary)] shadow-sm">
                    {product.tagIds[0]}
                  </span>
                )}
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={activeImage}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    src={images[activeImage]} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </AnimatePresence>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="text-sm font-bold text-[var(--color-text-primary)]">{product.rating || 0}</span>
                <span className="text-sm text-[var(--color-text-secondary)] underline cursor-pointer hover:text-[var(--color-brand)] transition-colors">({product.totalReviews || 0} reseñas)</span>
              </div>

              <h1 className="text-4xl md:text-5xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-2">{product.name}</h1>
              {product.shortDesc && (
                <p className="text-xl font-bold text-[var(--color-brand)] mb-4">{product.shortDesc}</p>
              )}
              <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">{product.desc}</p>

              <div className="flex items-baseline gap-4 mb-6">
                <span className={`text-4xl font-extrabold ${product.discountPrice ? 'text-red-600' : 'text-[var(--color-text-primary)]'}`}>
                  ${(product.discountPrice || product.price).toFixed(2)}
                </span>
                {product.discountPrice && (
                  <span className="text-xl text-gray-400 line-through font-bold">${product.price.toFixed(2)}</span>
                )}
              </div>

              {/* Especificaciones */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <Package className="w-5 h-5 text-gray-400 mb-2" />
                  <span className="block text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Presentación</span>
                  <span className="font-bold text-[var(--color-text-primary)] text-sm">{presentation}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <Scale className="w-5 h-5 text-gray-400 mb-2" />
                  <span className="block text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Contenido</span>
                  <span className="font-bold text-[var(--color-text-primary)] text-sm">{weight}</span>
                </div>
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex flex-col items-center text-center">
                  <Pill className="w-5 h-5 text-gray-400 mb-2" />
                  <span className="block text-[10px] text-[var(--color-text-secondary)] uppercase tracking-wider mb-1">Categoría</span>
                  <span className="font-bold text-[var(--color-text-primary)] text-sm">{product.categoryId}</span>
                </div>
              </div>

              <div className="bg-[var(--color-bg-light)] rounded-2xl p-6 border border-gray-100 mb-8">
                <h3 className="font-bold text-[var(--color-text-primary)] mb-4">Beneficios Clave</h3>
                <ul className="space-y-3">
                  {product.benefits.map((benefit, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div className="mt-1 w-5 h-5 rounded-full bg-[var(--color-support)]/20 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[var(--color-support)] font-bold" />
                      </div>
                      <span className="text-[var(--color-text-secondary)] leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <div className="flex items-center justify-between bg-[var(--color-bg-light)] border border-gray-200 rounded-xl px-4 py-3 sm:w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <span className="font-bold text-lg text-[var(--color-text-primary)] w-8 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors p-1"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white font-bold text-lg rounded-xl py-4 flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Añadir al Carrito - ${((product.discountPrice || product.price) * quantity).toFixed(2)}
                </button>
              </div>
              
              <div className="mt-6 flex items-center gap-6 text-sm text-[var(--color-text-secondary)] font-medium">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[var(--color-support)]" />
                  Garantía de 30 días
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[var(--color-brand)]" />
                  Testeado por terceros
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-16 pt-12 border-t border-gray-100">
            <div className="flex justify-center mb-12">
              <div className="inline-flex bg-gray-50/80 backdrop-blur-sm p-1.5 rounded-2xl border border-gray-100 shadow-sm overflow-x-auto max-w-full [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                {[
                  { id: 'desc', label: 'Descripción' },
                  { id: 'nutri', label: 'Info Nutricional' },
                  { id: 'reviews', label: `Reseñas (${reviews.length})` }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`relative px-6 sm:px-8 py-3 text-sm sm:text-base font-bold rounded-xl whitespace-nowrap transition-all duration-300 ${
                      activeTab === tab.id 
                        ? 'text-white' 
                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]'
                    }`}
                  >
                    {activeTab === tab.id && (
                      <motion.div 
                        layoutId="activeTabPill" 
                        className="absolute inset-0 bg-[var(--color-brand)] rounded-xl shadow-md"
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className="relative z-10">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="py-4 min-h-[400px]">
              <AnimatePresence mode="wait">
                {activeTab === 'desc' && (
                  <motion.div 
                    key="desc"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start"
                  >
                    <div className="lg:col-span-2 space-y-6 text-[var(--color-text-secondary)] leading-relaxed text-lg">
                      <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-6">Nuestra Filosofía de Calidad</h3>
                      <p>
                        {product.name} es el resultado de años de investigación en nutrición y bienestar. Diseñado para ofrecer resultados óptimos utilizando ingredientes de la más alta calidad y pureza.
                      </p>
                      <p>
                        Nuestra fórmula sinérgica combina extractos naturales con compuestos avanzados para asegurar que tu cuerpo reciba exactamente lo que necesita para funcionar a su máximo potencial.
                      </p>
                      <p>
                        Cada lote es sometido a rigurosas pruebas de laboratorio para garantizar la potencia y seguridad, cumpliendo con los estándares más exigentes de la industria.
                      </p>
                    </div>
                    
                    <div className="lg:col-span-1 bg-gradient-to-br from-[var(--color-brand)]/10 to-transparent p-8 rounded-3xl border border-[var(--color-brand)]/20 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-brand)]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                      <h3 className="font-bold text-[var(--color-brand)] mb-4 flex items-center gap-3 text-lg">
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Info className="w-5 h-5" />
                        </div>
                        Instrucciones de Uso
                      </h3>
                      <p className="text-[var(--color-text-primary)] font-medium leading-relaxed relative z-10">
                        {usage}
                      </p>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'nutri' && (
                  <motion.div 
                    key="nutri"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-center"
                  >
                    <div className="w-full max-w-2xl bg-white rounded-3xl p-6 sm:p-10 border border-gray-100 shadow-xl shadow-gray-200/50">
                      <div className="border-4 border-black p-6 sm:p-8 bg-white">
                        <h2 className="text-4xl font-black border-b-[12px] border-black pb-2 mb-4 tracking-tighter">Supplement Facts</h2>
                        <div className="flex justify-between font-bold border-b-2 border-black pb-2 mb-4 text-sm sm:text-base">
                          <span>Serving Size: 1 Unit</span>
                          <span>Servings Per Container: Variable</span>
                        </div>
                        
                        <div className="flex justify-between font-black border-b-8 border-black pb-2 mb-4 text-sm sm:text-base">
                          <span>Amount Per Serving</span>
                          <span>% Daily Value</span>
                        </div>

                        <div className="space-y-0 text-sm sm:text-base">
                          <div className="flex justify-between border-b border-gray-300 py-3">
                            <span className="font-bold text-gray-800">{product.name} Extract</span>
                            <div className="flex gap-4 sm:gap-8 text-right">
                              <span className="w-16 sm:w-20">Proprietary</span>
                              <span className="w-12 sm:w-16 font-black">**</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="mt-6 text-xs sm:text-sm text-gray-600">
                          <p className="mb-2 font-medium">** Daily Value (DV) not established.</p>
                          <p><span className="font-bold text-black">Other Ingredients:</span> Hypromellose (Vegetable Capsule), Rice Flour, Magnesium Stearate.</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'reviews' && (
                  <motion.div 
                    key="reviews"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-8"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h3 className="text-2xl font-extrabold text-[var(--color-text-primary)] mb-2">Opiniones de Clientes</h3>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-current' : 'text-gray-200'}`} />
                            ))}
                          </div>
                          <span className="text-lg font-bold text-[var(--color-text-primary)]">{product.rating} de 5</span>
                          <span className="text-sm text-[var(--color-text-secondary)]">Basado en {reviews.length} reseñas</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => setIsReviewModalOpen(true)}
                        className="px-6 py-3 bg-white border border-gray-200 text-[var(--color-text-primary)] font-bold rounded-xl hover:bg-gray-50 transition-all shadow-sm"
                      >
                        Escribir una reseña
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                      {reviews.length > 0 ? reviews.map((review) => (
                        <div key={review.id} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <p className="font-bold text-[var(--color-text-primary)]">{(review as any).userName || review.clientId.slice(0, 8)}</p>
                              <div className="flex items-center text-amber-500 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-gray-200'}`} />
                                ))}
                              </div>
                            </div>
                            <span className="text-xs text-[var(--color-text-secondary)]">
                              {new Date(review.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          <p className="text-[var(--color-text-secondary)] leading-relaxed italic">"{review.comment}"</p>
                        </div>
                      )) : (
                        <div className="text-center py-12 bg-gray-50/30 rounded-3xl border border-dashed border-gray-200">
                          <p className="text-gray-400 font-medium">Aún no hay reseñas para este producto. ¡Sé el primero en opinar!</p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Related Products Carousel */}
          <div className="mt-24 border-t border-gray-200 pt-16">
            <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8 tracking-tight">También te podría interesar</h2>
            <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {relatedProducts.map((product, i) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="min-w-[280px] sm:min-w-[320px] max-w-[320px] bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group flex flex-col snap-start"
                >
                  <Link to={`/product/${product.id}`} className="block relative aspect-square bg-gray-50 overflow-hidden">
                    {product.tagIds && product.tagIds.length > 0 && (
                      <span className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-[var(--color-text-primary)] shadow-sm">
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
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-bold text-[var(--color-text-primary)]">{product.rating || 0}</span>
                      <span className="text-xs text-[var(--color-text-secondary)]">({product.totalReviews || 0})</span>
                    </div>
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-lg font-bold text-[var(--color-text-primary)] mb-1 group-hover:text-[var(--color-brand)] transition-colors">{product.name}</h3>
                    </Link>
                    <p className="text-sm text-[var(--color-text-secondary)] mb-4 flex-grow line-clamp-2">{product.desc}</p>
                    <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                      <span className="text-xl font-extrabold text-[var(--color-text-primary)]">${product.price.toFixed(2)}</span>
                      <button 
                        onClick={() => {
                          addItem(product);
                          showToast(`${product.name} añadido al carrito`);
                        }}
                        className="w-10 h-10 rounded-full bg-[var(--color-brand)] text-white flex items-center justify-center hover:bg-[var(--color-brand-hover)] transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Review Modal */}
        <AnimatePresence>
          {isReviewModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsReviewModalOpen(false)}
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden"
              >
                <div className="p-8">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black text-gray-900">Escribir Reseña</h2>
                    <button 
                      onClick={() => setIsReviewModalOpen(false)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-400" />
                    </button>
                  </div>

                  <form onSubmit={handleReviewSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-4 text-center">Calificación</label>
                      <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setReviewFormData({...reviewFormData, rating: star})}
                            className={`p-2 transition-all ${star <= reviewFormData.rating ? 'text-amber-500 scale-110' : 'text-gray-200 hover:text-amber-200'}`}
                          >
                            <Star className={`w-10 h-10 ${star <= reviewFormData.rating ? 'fill-current' : ''}`} />
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-500 mb-2">Tu comentario</label>
                      <textarea 
                        required
                        value={reviewFormData.comment}
                        onChange={(e) => setReviewFormData({...reviewFormData, comment: e.target.value})}
                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:border-[var(--color-brand)] transition-all h-32 resize-none"
                        placeholder="Cuéntanos tu experiencia con el producto..."
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmittingReview}
                      className="w-full py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl hover:bg-[var(--color-brand-hover)] transition-all shadow-lg shadow-[var(--color-brand)]/20 disabled:opacity-50"
                    >
                      {isSubmittingReview ? 'Enviando...' : 'Publicar Reseña'}
                    </button>
                  </form>
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
