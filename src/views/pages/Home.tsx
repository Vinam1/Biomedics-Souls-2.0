import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, ShieldCheck, Zap, Brain, Activity, ShoppingCart, Check } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useCart } from '../../controllers/context/CartContext';
import { ProductController } from '../../controllers/productController';
import { Product } from '../../models/types';
import { PageLayout } from '../../components/layout/PageLayout';

export function Home() {
  const { addItem } = useCart();
  const { hash } = useLocation();
  const [toast, setToast] = useState<string | null>(null);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleAddToCart = (product: any) => {
    addItem(product);
    showToast(`${product.name} añadido al carrito`);
  };

  useEffect(() => {
    const fetchFeatured = async () => {
      const all = await ProductController.getAll();
      setFeaturedProducts(all.slice(0, 4));
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (hash === '#about') {
      const element = document.getElementById('about');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <PageLayout>
      <div className="flex flex-col">
        {/* Hero Section */}
        <section className="relative bg-[var(--color-bg-light)] overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1590439471364-192aa70c0b53?q=80&w=2000&auto=format&fit=crop" 
              alt="Bienestar y belleza" 
              className="w-full h-full object-cover opacity-40"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="py-24 md:py-32 lg:py-40 max-w-2xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="inline-block py-1 px-3 rounded-full bg-[var(--color-brand)]/10 text-[var(--color-brand)] text-sm font-bold tracking-wide mb-6">
                  TU BIENESTAR, NUESTRA PRIORIDAD
                </span>
                <h1 className="text-5xl md:text-6xl font-extrabold text-[var(--color-text-primary)] leading-tight mb-6 tracking-tight">
                  Optimiza tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand)] to-[var(--color-accent)]">cuerpo y mente</span>
                </h1>
                <p className="text-lg md:text-xl text-[var(--color-text-secondary)] mb-10 leading-relaxed">
                  Suplementos formulados con ingredientes de alta calidad para potenciar tu rendimiento diario, enfoque y recuperación.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/catalog" 
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-white bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
                  >
                    Explorar Catálogo
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Link>
                  <Link 
                    to="/quiz" 
                    className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-lg text-[var(--color-text-primary)] bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all shadow-sm"
                  >
                    Descubre tu fórmula
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 tracking-tight">
                El estándar Biomedics Souls
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg">
                No hacemos suposiciones. Cada fórmula está diseñada para máxima biodisponibilidad y efectividad.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  icon: <ShieldCheck className="w-8 h-8 text-[var(--color-brand)]" />,
                  title: "Pureza Garantizada",
                  desc: "Ingredientes de la más alta calidad, testeados para asegurar cero contaminantes y máxima seguridad."
                },
                {
                  icon: <Brain className="w-8 h-8 text-[var(--color-accent)]" />,
                  title: "Fórmulas Sinérgicas",
                  desc: "Combinamos compuestos que trabajan juntos para multiplicar sus efectos en el organismo."
                },
                {
                  icon: <Activity className="w-8 h-8 text-[var(--color-support)]" />,
                  title: "Alta Biodisponibilidad",
                  desc: "Utilizamos formas moleculares que tu cuerpo realmente puede absorber y utilizar."
                }
              ].map((benefit, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-[var(--color-bg-light)] p-8 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow"
                >
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-sm mb-6">
                    {benefit.icon}
                  </div>
                  <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-3">{benefit.title}</h3>
                  <p className="text-[var(--color-text-secondary)] leading-relaxed">{benefit.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* About Us Section */}
        <section id="about" className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <h2 className="text-3xl md:text-5xl font-extrabold text-[var(--color-text-primary)] mb-8 leading-tight tracking-tight">
                  Biomedics Soul: <span className="text-[var(--color-brand)]">Transformando el Sector Salud</span> con Ética e Innovación
                </h2>
                <p className="text-lg text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                  En Biomedics Soul, nos dedicamos a elevar los estándares del sector salud a través de soluciones integrales, éticas y de alta calidad. Nos especializamos en la consultoría y distribución de insumos médicos, con el firme propósito de mejorar el bienestar de los pacientes y facilitar la labor de los profesionales que los atienden.
                </p>
                
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--color-brand)]/10 flex items-center justify-center text-[var(--color-brand)]">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Misión</h3>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        Proveer soluciones médicas efectivas y confiables que garanticen seguridad, eficiencia y la total satisfacción de nuestros clientes. Nuestra excelencia operativa nos convierte en el aliado estratégico de hospitales, clínicas y laboratorios en todo México.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="shrink-0 w-12 h-12 rounded-xl bg-[var(--color-accent)]/10 flex items-center justify-center text-[var(--color-accent)]">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">Visión</h3>
                      <p className="text-[var(--color-text-secondary)] leading-relaxed">
                        Consolidarnos como líderes globales en el sector salud, siendo reconocidos por impulsar la certificación y competitividad de las instituciones médicas. Buscamos llevar nuestros estándares de calidad a mercados internacionales, transformando la salud a nivel mundial.
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative z-10">
                  <img 
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=1000&auto=format&fit=crop" 
                    alt="Equipo médico profesional" 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-[var(--color-brand)]/10 rounded-full blur-3xl -z-10"></div>
                <div className="absolute -top-6 -left-6 w-64 h-64 bg-[var(--color-accent)]/10 rounded-full blur-3xl -z-10"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 tracking-tight">
                Lo que dicen nuestros clientes
              </h2>
              <p className="text-[var(--color-text-secondary)] text-lg">
                Miles de personas ya están transformando su vida con Biomedics Soul.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Dra. Elena Rodríguez",
                  role: "Nutrióloga Clínica",
                  content: "Como profesional, busco pureza y evidencia. Las fórmulas de Biomedics Soul son las únicas que recomiendo a mis pacientes por su alta biodisponibilidad.",
                  img: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop"
                },
                {
                  name: "Carlos Méndez",
                  role: "Atleta de Alto Rendimiento",
                  content: "El enfoque y la recuperación que he logrado con Ashwagandha y Magnesio de esta marca han marcado un antes y un después en mi entrenamiento.",
                  img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"
                },
                {
                  name: "Sofía Valenzuela",
                  role: "Emprendedora",
                  content: "Buscaba algo para el estrés y la claridad mental. El servicio al cliente me guió perfectamente y los resultados fueron casi inmediatos.",
                  img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop"
                }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="bg-[var(--color-bg-light)] p-8 rounded-[2rem] border border-gray-100 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-6 border-4 border-white shadow-md">
                    <img 
                      src={testimonial.img} 
                      alt={testimonial.name} 
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Check key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                  <p className="text-[var(--color-text-secondary)] italic mb-6 leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  <div>
                    <h4 className="font-bold text-[var(--color-text-primary)]">{testimonial.name}</h4>
                    <p className="text-sm text-[var(--color-brand)] font-medium">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Products */}
        <section className="py-20 bg-[var(--color-bg-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4 tracking-tight">
                  Fórmulas Destacadas
                </h2>
                <p className="text-[var(--color-text-secondary)] text-lg">
                  Nuestros suplementos más avanzados para objetivos específicos.
                </p>
              </div>
              <Link to="/catalog" className="hidden md:flex items-center text-[var(--color-brand)] font-bold hover:text-[var(--color-brand-hover)] transition-colors">
                Ver todos <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {featuredProducts.map((product, i) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
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
                  <div className="p-3 sm:p-6 flex flex-col flex-grow">
                    <Link to={`/product/${product.id}`}>
                      <h3 className="text-sm sm:text-lg font-bold text-[var(--color-text-primary)] mb-1 sm:mb-2 group-hover:text-[var(--color-brand)] transition-colors line-clamp-1 sm:line-clamp-none">{product.name}</h3>
                    </Link>
                    <p className="hidden sm:block text-sm text-[var(--color-text-secondary)] mb-4 flex-grow line-clamp-2">{product.shortDesc || product.desc}</p>
                    <div className="flex items-center justify-between mt-auto pt-2 sm:pt-0 border-t border-gray-50 sm:border-0">
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
                        className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[var(--color-bg-light)] text-[var(--color-brand)] flex items-center justify-center hover:bg-[var(--color-brand)] hover:text-white transition-colors"
                      >
                        <ShoppingCart className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-8 text-center md:hidden">
              <Link to="/catalog" className="inline-flex items-center text-[var(--color-brand)] font-bold hover:text-[var(--color-brand-hover)] transition-colors">
                Ver todos los productos <ArrowRight className="ml-1 w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

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
