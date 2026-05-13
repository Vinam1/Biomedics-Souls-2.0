import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { Brain, Zap, Moon, Activity, ShieldCheck, Dumbbell, ArrowRight, ArrowLeft, CheckCircle2, MessageCircle, RotateCcw, Sparkles, ShoppingCart, Plus, ShoppingBag } from 'lucide-react';
import { ProductController } from '../../controllers/productController';
import { Product } from '../../models/types';
import { GoogleGenAI } from "@google/genai";
import { PageLayout } from '../../components/layout/PageLayout';
import { useCart } from '../../controllers/context/CartContext';

export function Quiz() {
  const { addItem } = useCart();
  const [step, setStep] = useState(0); // 0 is the intro
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<{
    rec1Id: string;
    reason1: string;
    rec2Id: string;
    reason2: string;
    personalizedIntro: string;
  } | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await ProductController.getAll();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products for quiz:", error);
      }
    };
    fetchProducts();
  }, []);

  const questions = [
    {
      id: 1,
      title: "¿Cuál es tu objetivo principal de salud hoy?",
      options: [
        { id: 'focus', label: 'Enfoque y Claridad', icon: <Brain className="w-8 h-8" />, desc: 'Mejorar la concentración y la memoria.' },
        { id: 'energy', label: 'Energía Sostenida', icon: <Zap className="w-8 h-8" />, desc: 'Combatir la fatiga sin picos ni bajones.' },
        { id: 'sleep', label: 'Descanso Profundo', icon: <Moon className="w-8 h-8" />, desc: 'Optimizar la calidad del sueño y recuperación.' },
        { id: 'immunity', label: 'Inmunidad Fuerte', icon: <ShieldCheck className="w-8 h-8" />, desc: 'Reforzar las defensas naturales del cuerpo.' }
      ]
    },
    {
      id: 2,
      title: "¿En qué momento del día sientes mayor fatiga?",
      options: [
        { id: 'morning', label: 'Al despertar', icon: <Activity className="w-8 h-8" />, desc: 'Me cuesta arrancar el día.' },
        { id: 'afternoon', label: 'Media tarde', icon: <Zap className="w-8 h-8" />, desc: 'Siento un "bajón" después de comer.' },
        { id: 'night', label: 'Noche', icon: <Moon className="w-8 h-8" />, desc: 'Cansancio extremo al final del día.' },
        { id: 'allday', label: 'Todo el día', icon: <Activity className="w-8 h-8" />, desc: 'Fatiga constante y pesadez.' }
      ]
    },
    {
      id: 3,
      title: "¿Cómo describirías la calidad de tu sueño?",
      options: [
        { id: 'deep', label: 'Profundo', icon: <CheckCircle2 className="w-8 h-8" />, desc: 'Despierto descansado y con energía.' },
        { id: 'interrupted', label: 'Interrumpido', icon: <Activity className="w-8 h-8 text-yellow-500" />, desc: 'Me despierto varias veces en la noche.' },
        { id: 'insomnia', label: 'Cuesta conciliar', icon: <Moon className="w-8 h-8 text-blue-400" />, desc: 'Doy muchas vueltas antes de dormir.' }
      ]
    },
    {
      id: 4,
      title: "¿Cómo calificarías tu concentración mental?",
      options: [
        { id: 'sharp', label: 'Excelente', icon: <ShieldCheck className="w-8 h-8" />, desc: 'Mantengo el enfoque por horas.' },
        { id: 'distracted', label: 'Dispersa', icon: <Brain className="w-8 h-8 opacity-70" />, desc: 'Me distraigo con facilidad.' },
        { id: 'foggy', label: 'Neblina mental', icon: <Sparkles className="w-8 h-8" />, desc: 'Me cuesta pensar con claridad a veces.' }
      ]
    },
    {
      id: 5,
      title: "¿Presentas inflamación o pesadez digestiva?",
      options: [
        { id: 'rarely_dig', label: 'Casi nunca', icon: <CheckCircle2 className="w-8 h-8" />, desc: 'Mi digestión es muy ligera.' },
        { id: 'sometimes_dig', label: 'Ocasionalmente', icon: <Activity className="w-8 h-8" />, desc: 'Ciertas comidas me caen pesadas.' },
        { id: 'often_dig', label: 'Muy seguido', icon: <Zap className="w-8 h-8 text-orange-400" />, desc: 'Suelo sentirme inflamado después de comer.' }
      ]
    },
    {
      id: 6,
      title: "¿Cómo es tu nivel de actividad física?",
      options: [
        { id: 'sedentary', label: 'Sedentario', icon: <Activity className="w-8 h-8 opacity-50" />, desc: 'Poco o ningún ejercicio regular.' },
        { id: 'moderate', label: 'Moderado', icon: <Activity className="w-8 h-8" />, desc: 'Ejercicio 2-3 veces por semana.' },
        { id: 'active', label: 'Activo', icon: <Dumbbell className="w-8 h-8" />, desc: 'Entrenamiento intenso 4+ veces por semana.' }
      ]
    },
    {
      id: 7,
      title: "¿Cuánto tardas en recuperarte tras entrenar?",
      options: [
        { id: 'fast', label: 'Rápido', icon: <Zap className="w-8 h-8 text-emerald-500" />, desc: 'Al día siguiente estoy al 100%.' },
        { id: 'normal', label: '1-2 días', icon: <Activity className="w-8 h-8" />, desc: 'Recuperación estándar.' },
        { id: 'slow', label: 'Lento', icon: <Dumbbell className="w-8 h-8 text-red-400" />, desc: 'Siento dolor muscular por varios días.' }
      ]
    },
    {
      id: 8,
      title: "¿Experimentas estrés con frecuencia?",
      options: [
        { id: 'rarely_stress', label: 'Raramente', icon: <CheckCircle2 className="w-8 h-8" />, desc: 'Relajado la mayor parte del tiempo.' },
        { id: 'sometimes_stress', label: 'A veces', icon: <Activity className="w-8 h-8" />, desc: 'Picos ocasionales por trabajo o vida.' },
        { id: 'often_stress', label: 'Frecuentemente', icon: <Zap className="w-8 h-8 text-yellow-500" />, desc: 'Estrés crónico o ansiedad recurrente.' }
      ]
    },
    {
      id: 9,
      title: "¿Cómo es tu alimentación diaria?",
      options: [
        { id: 'balanced', label: 'Equilibrada', icon: <ShieldCheck className="w-8 h-8" />, desc: 'Como frutas, verduras y proteína.' },
        { id: 'unbalanced', label: 'Alta en azúcares', icon: <Zap className="w-8 h-8 text-red-500" />, desc: 'Consumo procesados frecuentemente.' },
        { id: 'skip', label: 'Me salto comidas', icon: <Activity className="w-8 h-8" />, desc: 'Por falta de tiempo no como bien.' }
      ]
    }
  ];

  const handleSelect = async (optionId: string) => {
    const newAnswers = { ...answers, [step]: optionId };
    setAnswers(newAnswers);
    
    if (step < questions.length) {
      setTimeout(() => setStep(step + 1), 300);
    } else {
      setIsSubmitting(true);
      setStep(step + 1);
      
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
        const model = "gemini-3-flash-preview"; 
        
        const userProfile = {
          goal: questions[0].options.find(o => o.id === newAnswers[1])?.label,
          fatigueMoment: questions[1].options.find(o => o.id === newAnswers[2])?.label,
          sleepQuality: questions[2].options.find(o => o.id === newAnswers[3])?.label,
          focusLevel: questions[3].options.find(o => o.id === newAnswers[4])?.label,
          digestion: questions[4].options.find(o => o.id === newAnswers[5])?.label,
          activity: questions[5].options.find(o => o.id === newAnswers[6])?.label,
          recovery: questions[6].options.find(o => o.id === newAnswers[7])?.label,
          stress: questions[7].options.find(o => o.id === newAnswers[8])?.label,
          diet: questions[8].options.find(o => o.id === newAnswers[9])?.label
        };

        const prompt = `Como experto en biorritmos y biohacking de Biomedics Souls, analiza este perfil profundo:
        - Objetivo Principal: ${userProfile.goal}
        - Punto de Fatiga: ${userProfile.fatigueMoment}
        - Calidad de Sueño: ${userProfile.sleepQuality}
        - Estado Cognitivo: ${userProfile.focusLevel}
        - Salud Digestiva: ${userProfile.digestion}
        - Actividad Física: ${userProfile.activity}
        - Recuperación: ${userProfile.recovery}
        - Nivel de Estrés: ${userProfile.stress}
        - Alimentación: ${userProfile.diet}

        Basado en nuestro catálogo de suplementos de alta pureza:
        ${products.map(p => `- ${p.id}: ${p.name} (${p.shortDesc || p.desc}).`).join('\n')}

        Genera una recomendación de protocolo en JSON:
        1. rec1Id: ID del producto pilar (debe atacar el problema raíz).
        2. reason1: Por qué es el pilar de su protocolo basándote en sus síntomas específicos (máx 2 frases).
        3. rec2Id: ID del optimizador (complementa el pilar).
        4. reason2: Cómo este segundo producto sinergiza con el primero para sus metas (máx 2 frases).
        5. personalizedIntro: Un resumen empático y profesional de su estado actual.

        Responde SOLO el JSON.`;

        const result = await ai.models.generateContent({
          model,
          contents: [{ parts: [{ text: prompt }] }]
        });
        const text = result.text || '';
        
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        const finalJson = jsonMatch ? jsonMatch[0] : text;
        
        const recResult = JSON.parse(finalJson || '{}');
        setAiRecommendation(recResult);
      } catch (error) {
        console.error("Error generating AI recommendation:", error);
        setAiRecommendation(null);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const getFallbackRecommendations = () => {
    const mainGoal = answers[1];
    const activity = answers[2];
    
    let rec1 = products.find(p => p.name.toLowerCase().includes('ashwagandha')) || products[0];
    let reason1 = "Lo seleccionamos porque mencionaste que buscas mejorar tu claridad mental y manejar el estrés. La Ashwagandha es excelente para equilibrar el cortisol y mejorar el enfoque.";
    
    if (mainGoal === 'energy') { 
      rec1 = products.find(p => p.name.toLowerCase().includes('cordyboost')) || products[0];
      reason1 = "Ideal para combatir la fatiga que mencionaste. Cordyboost te proporcionará energía celular sostenida para tus actividades diarias."; 
    }
    if (mainGoal === 'sleep') { 
      rec1 = products.find(p => p.name.toLowerCase().includes('glicinato')) || products[0];
      reason1 = "Perfecto para optimizar tu descanso y relajación muscular nocturna, ayudándote a despertar con vitalidad."; 
    }
    if (mainGoal === 'immunity') { 
      rec1 = products.find(p => p.name.toLowerCase().includes('camu camu')) || products[0];
      reason1 = "Refuerza tus defensas naturales con la vitamina C natural del Camu Camu para protegerte contra factores externos."; 
    }

    let rec2 = products.find(p => p.name.toLowerCase().includes('vinagre')) || products[1];
    let reason2 = "Es el complemento perfecto para tu metabolismo y salud digestiva, apoyando el bienestar general desde el interior.";
    
    if (activity === 'active') { 
      rec2 = products.find(p => p.name.toLowerCase().includes('citrato')) || products[0];
      reason2 = "Ayuda a la recuperación muscular y el equilibrio electrolítico después de tus entrenamientos intensos."; 
    }
    else if (activity === 'sedentary') { 
      rec2 = products.find(p => p.name.toLowerCase().includes('flora')) || products[0];
      reason2 = "Mejora tu salud intestinal y absorción de nutrientes, ideal para mantener un sistema digestivo saludable."; 
    }

    return { 
      rec1, 
      reason1, 
      rec2, 
      reason2,
      personalizedIntro: "Basándonos en tu nivel de actividad y tus metas actuales, estos son los aliados perfectos para tu día a día:"
    };
  };

  const currentRecs = aiRecommendation ? {
    rec1: products.find(p => p.id === aiRecommendation.rec1Id) || products[0],
    reason1: aiRecommendation.reason1,
    rec2: products.find(p => p.id === aiRecommendation.rec2Id) || products[1],
    reason2: aiRecommendation.reason2,
    personalizedIntro: aiRecommendation.personalizedIntro
  } : getFallbackRecommendations();

  const progress = (step / questions.length) * 100;

  return (
    <PageLayout>
      <div className="bg-[var(--color-bg-light)] min-h-screen py-12 flex flex-col">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex-grow flex flex-col">
          
          {step === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h1 className="text-4xl font-extrabold text-[var(--color-text-primary)] mb-4">Diagnóstico de Bienestar Inteligente</h1>
              <p className="text-lg text-[var(--color-text-secondary)] max-w-2xl mx-auto">
                Responde 9 preguntas rápidas para que nuestra IA analice tus biorritmos y diseñe un protocolo de suplementación exacta para tus necesidades únicas.
              </p>
              <button 
                onClick={() => setStep(1)}
                className="mt-8 px-10 py-4 bg-[var(--color-brand)] text-white font-bold rounded-2xl hover:bg-[var(--color-brand-hover)] transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Comenzar Diagnóstico
              </button>
            </motion.div>
          )}

          {step > 0 && step <= questions.length && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <button 
                  onClick={() => setStep(Math.max(1, step - 1))}
                  className={`flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-brand)] transition-colors font-bold ${step === 1 ? 'invisible' : ''}`}
                >
                  <ArrowLeft className="w-5 h-5" /> Atrás
                </button>
                <span className="text-sm font-bold text-[var(--color-text-secondary)]">Paso {step} de {questions.length}</span>
              </div>
              
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[var(--color-brand)] rounded-full"
                  initial={{ width: `${((step - 1) / questions.length) * 100}%` }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          )}

          <div className="flex-grow flex flex-col justify-center">
            <AnimatePresence mode="wait">
              {step > 0 && step <= questions.length ? (
                <motion.div 
                  key={`step-${step}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm"
                >
                  <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-8 text-center leading-tight">
                    {questions[step - 1].title}
                  </h2>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {questions[step - 1].options.map((option) => (
                      <button
                        key={option.id}
                        onClick={() => handleSelect(option.id)}
                        className={`flex flex-col items-center text-center p-6 rounded-2xl border-2 transition-all group ${
                          answers[step] === option.id 
                            ? 'border-[var(--color-brand)] bg-[var(--color-brand)]/5 shadow-md' 
                            : 'border-gray-100 hover:border-[var(--color-brand)] hover:shadow-md bg-white'
                        }`}
                      >
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-colors ${
                          answers[step] === option.id 
                            ? 'bg-[var(--color-brand)] text-white' 
                            : 'bg-gray-50 text-[var(--color-text-secondary)] group-hover:bg-[var(--color-brand)]/10 group-hover:text-[var(--color-brand)]'
                        }`}>
                          {option.icon}
                        </div>
                        <h3 className={`font-bold text-lg mb-2 ${
                          answers[step] === option.id ? 'text-[var(--color-brand)]' : 'text-[var(--color-text-primary)]'
                        }`}>
                          {option.label}
                        </h3>
                        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                          {option.desc}
                        </p>
                      </button>
                    ))}
                  </div>
                </motion.div>
              ) : step > questions.length ? (
                <motion.div 
                  key="results"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm"
                >
                  {isSubmitting ? (
                    <div className="py-12 flex flex-col items-center text-center">
                      <div className="w-16 h-16 border-4 border-gray-200 border-t-[var(--color-brand)] rounded-full animate-spin mb-6"></div>
                      <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">Analizando tus respuestas...</h2>
                      <p className="text-[var(--color-text-secondary)]">Nuestra IA está formulando tu protocolo ideal.</p>
                    </div>
                  ) : (
                    <div className="py-4">
                      <div className="text-center mb-10">
                        <div className="w-20 h-20 bg-[var(--color-support)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                          <CheckCircle2 className="w-10 h-10 text-[var(--color-support)]" />
                        </div>
                        <div className="flex items-center justify-center gap-2 mb-2">
                          <Sparkles className="w-5 h-5 text-[var(--color-brand)]" />
                          <span className="text-xs font-bold uppercase tracking-widest text-[var(--color-brand)]">Análisis IA Completado</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-[var(--color-text-primary)] mb-4">Tu Plan de Bienestar Sugerido</h2>
                        <p className="text-lg text-[var(--color-text-secondary)] max-w-lg mx-auto italic">
                          "{currentRecs.personalizedIntro}"
                        </p>
                      </div>
                      
                      <div className="space-y-8 mb-10">
                        {[currentRecs.rec1, currentRecs.rec2].filter(Boolean).map((p, idx) => (
                          <div key={p?.id || idx} className="bg-[var(--color-bg-light)] rounded-2xl p-6 border border-gray-100 flex flex-col md:flex-row gap-6 items-center relative group">
                            <img src={p?.img} alt={p?.name} className="w-32 h-32 rounded-xl object-cover shadow-sm" referrerPolicy="no-referrer" />
                            <div className="flex-grow text-center md:text-left">
                              <h3 className="text-2xl font-bold text-[var(--color-text-primary)] mb-2">{p?.name}</h3>
                              <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                <span className="font-bold text-[var(--color-text-primary)]">¿Por qué es ideal para ti?</span> "{idx === 0 ? currentRecs.reason1 : currentRecs.reason2}"
                              </p>
                              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                                <Link to={`/product/${p?.id}`} className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-[var(--color-text-primary)] font-bold rounded-xl hover:border-[var(--color-brand)] hover:text-[var(--color-brand)] transition-all text-sm group/btn">
                                  Ver detalles <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                                </Link>
                              </div>
                            </div>
                            
                            {/* Individual Add to Cart Button */}
                            <button 
                              onClick={() => p && addItem(p)}
                              className="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 w-10 h-10 bg-[var(--color-brand)] text-white rounded-xl flex items-center justify-center shadow-lg hover:bg-[var(--color-brand-hover)] hover:scale-110 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="Añadir al carrito"
                            >
                              <Plus className="w-5 h-5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-col items-center gap-4 mb-12">
                        <button 
                          onClick={() => {
                            if (currentRecs.rec1) addItem(currentRecs.rec1);
                            if (currentRecs.rec2) addItem(currentRecs.rec2);
                          }}
                          className="w-full sm:w-auto px-10 py-5 bg-[var(--color-brand)] text-white font-black rounded-2xl hover:bg-[var(--color-brand-hover)] transition-all shadow-[0_10px_20px_-10px_rgba(var(--color-brand-rgb),0.5)] hover:shadow-[0_15px_25px_-10px_rgba(var(--color-brand-rgb),0.6)] transform hover:-translate-y-1 flex items-center justify-center gap-3"
                        >
                          <ShoppingBag className="w-6 h-6" />
                          Agregar todos al carrito
                        </button>
                        <p className="text-[10px] uppercase tracking-widest font-black text-gray-400">Simplifica tu rutina de bienestar</p>
                      </div>

                      <div className="border-t border-gray-100 pt-10 mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="text-center md:text-left">
                          <h4 className="font-bold text-[var(--color-text-primary)] mb-2">¿Quieres probar con otros objetivos?</h4>
                          <button 
                            onClick={() => {
                              setStep(0);
                              setAnswers({});
                            }}
                            className="flex items-center gap-2 text-[var(--color-brand)] font-bold hover:underline mx-auto md:mx-0"
                          >
                            Reiniciar diagnóstico <RotateCcw className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="text-center md:text-right">
                          <h4 className="font-bold text-[var(--color-text-primary)] mb-2">¿Tienes dudas sobre las dosis?</h4>
                          <p className="text-sm text-[var(--color-text-secondary)] mb-3">Habla con un asesor por WhatsApp para una recomendación más detallada y personalizada.</p>
                          <a 
                            href="https://wa.me/525647969316" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-[#25D366] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#128C7E] transition-colors"
                          >
                            <MessageCircle className="w-5 h-5" /> Contactar Asesor
                          </a>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
