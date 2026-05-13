import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, ChevronUp, HelpCircle, ShieldCheck, Truck, RotateCcw } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';

export function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [openQuestion, setOpenQuestion] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: 'Todas', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'products', label: 'Productos', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'shipping', label: 'Envío', icon: <Truck className="w-4 h-4" /> },
    { id: 'returns', label: 'Devoluciones', icon: <RotateCcw className="w-4 h-4" /> }
  ];

  const faqs = [
    {
      id: 1,
      category: 'products',
      question: '¿Están sus suplementos testeados por terceros?',
      answer: 'Sí, absolutamente. Cada lote de nuestros productos es sometido a rigurosas pruebas de terceros para verificar pureza, potencia y ausencia de metales pesados o contaminantes. Los certificados de análisis (CoA) están disponibles bajo petición.'
    },
    {
      id: 2,
      category: 'products',
      question: '¿Puedo combinar múltiples fórmulas de Biomedics Souls?',
      answer: 'Nuestras fórmulas están diseñadas para ser sinérgicas. Sin embargo, recomendamos no exceder la dosis diaria recomendada de ingredientes individuales (como la cafeína) si combinas varios productos. Consulta la tabla de compatibilidad en la página de cada producto.'
    },
    {
      id: 3,
      category: 'shipping',
      question: '¿Cuánto tarda el envío estándar?',
      answer: 'El envío estándar nacional suele tardar entre 3 y 5 días hábiles. Los pedidos realizados antes de las 2 PM EST se procesan el mismo día. Recibirás un correo con el número de seguimiento una vez que tu pedido haya sido despachado.'
    },
    {
      id: 4,
      category: 'shipping',
      question: '¿Hacen envíos internacionales?',
      answer: 'Actualmente enviamos a Estados Unidos, Canadá, México y la Unión Europea. Los tiempos y costos de envío internacional varían según el destino y se calcularán en el checkout.'
    },
    {
      id: 5,
      category: 'returns',
      question: '¿Cuál es su política de devolución?',
      answer: 'Ofrecemos una garantía de satisfacción de 30 días. Si no estás completamente satisfecho con tu compra, puedes devolver el producto (incluso si está abierto) dentro de los 30 días posteriores a la recepción para obtener un reembolso completo, menos los gastos de envío.'
    },
    {
      id: 6,
      category: 'products',
      question: '¿Sus productos son aptos para veganos?',
      answer: 'La mayoría de nuestras fórmulas son 100% veganas y utilizamos cápsulas vegetales (HPMC). Las excepciones están claramente marcadas en la etiqueta y en la página del producto (por ejemplo, productos que contienen colágeno marino).'
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <PageLayout>
      <div className="bg-[var(--color-bg-light)] min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)] tracking-tight mb-4">Preguntas Frecuentes</h1>
            <p className="text-[var(--color-text-secondary)] text-lg mb-8">Encuentra respuestas rápidas a tus dudas sobre nuestros productos y servicios.</p>
            
            <div className="relative max-w-2xl mx-auto">
              <input 
                type="text" 
                placeholder="Busca tu pregunta aquí..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border-2 border-gray-100 rounded-2xl pl-14 pr-6 py-4 text-lg focus:outline-none focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)] transition-all shadow-sm"
              />
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-[var(--color-brand)] text-white shadow-md' 
                    : 'bg-white text-[var(--color-text-secondary)] border border-gray-200 hover:border-[var(--color-brand)] hover:text-[var(--color-brand)]'
                }`}
              >
                {cat.icon}
                {cat.label}
              </button>
            ))}
          </div>

          <div className="space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq) => (
                <motion.div 
                  key={faq.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <button 
                    onClick={() => setOpenQuestion(openQuestion === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none group"
                  >
                    <span className="font-bold text-lg text-[var(--color-text-primary)] group-hover:text-[var(--color-brand)] transition-colors pr-8">
                      {faq.question}
                    </span>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${
                      openQuestion === faq.id ? 'bg-[var(--color-brand)]/10 text-[var(--color-brand)]' : 'bg-gray-50 text-gray-400 group-hover:bg-gray-100'
                    }`}>
                      {openQuestion === faq.id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </button>
                  
                  <AnimatePresence>
                    {openQuestion === faq.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="p-6 pt-0 text-[var(--color-text-secondary)] leading-relaxed border-t border-gray-50">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
                <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-2">No encontramos resultados</h3>
                <p className="text-[var(--color-text-secondary)]">Intenta buscar con otras palabras clave o contacta a nuestro soporte.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </PageLayout>
  );
}
