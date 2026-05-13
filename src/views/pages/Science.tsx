import { motion } from 'motion/react';
import { Microscope, FileText, Download, ShieldCheck, Award, FlaskConical, CheckCircle2, Quote } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';

const articles = [
  {
    id: 'ala',
    name: "Ácido Alfa Lipoico: Resumen de Acciones",
    benefits: "Potente antioxidante universal (acuoso y lipídico). Mejora la respuesta a la insulina y protege contra la neuropatía diabética.",
    pdfLink: "/articles/ALA.pdf"
  },
  {
    id: 'ashwagandha',
    name: "Ashwagandha (Withania somnifera) y Sueño",
    benefits: "Revisión sobre la inducción al sueño, reducción de niveles de cortisol y mejora en la calidad del sueño mediante modulación de GABA.",
    pdfLink: "/articles/ashwagandha.pdf"
  },
  {
    id: 'astaxantina',
    name: "Efecto de la Astaxantina en la Salud",
    benefits: "Recopilación sobre su rol como antioxidante y antiinflamatorio contra el cáncer, enfermedades cardiovasculares y oculares.",
    pdfLink: "/articles/astaxantina.pdf"
  },
  {
    id: 'flavonoides',
    name: "Flavonoides: Aplicaciones Medicinales",
    benefits: "Características fisicoquímicas y beneficios en la salud humana, incluyendo efectos antibacteriales y anticancerígenos.",
    pdfLink: "/articles/flavonoides_aplicaciones.pdf"
  },
  {
    id: 'glisanato',
    name: "Glicinato de Magnesio",
    benefits: "Estudio sobre la solubilidad y absorción superior de los metales quelados con glicina en suplementos nutricionales.",
    pdfLink: "/articles/glisanato-de-magnesio.pdf"
  },
  {
    id: 'glucosamina',
    name: "Glucosamina en Dolor Lumbar",
    benefits: "Análisis Estructurado sobre la eficacia de la glucosamina en el tratamiento de la osteoartrosis y reparación del cartílago.",
    pdfLink: "/articles/glucosamina.pdf"
  },
  {
    id: 'inulina',
    name: "Inulina de Achicoria",
    benefits: "Estudio sobre cómo la inulina de achicoria favorece el crecimiento de bacterias probióticas esenciales para la salud intestinal.",
    pdfLink: "/articles/Inulina-de-achicoria.pdf"
  },
  {
    id: 'centella',
    name: "Gel de Centella Asiática",
    benefits: "Propiedades regeneradoras, cicatrizantes y antioxidantes con especial énfasis en su uso tópico y dermatológico.",
    pdfLink: "/articles/gel-centella-asiatica.pdf"
  },
  {
    id: 'resveratrol',
    name: "Resveratrol y Terapia Farmacológica",
    benefits: "Análisis de sus efectos como agente antienvejecimiento, protector cardiovascular, neuroprotector y antidiabético.",
    pdfLink: "/articles/Resveratrol.pdf"
  },
  {
    id: 'serum_facial',
    name: "Serum Facial Hidratante",
    benefits: "Formulación y caracterización de sueros para la homeóstasis cutánea y cuidado de la piel.",
    pdfLink: "/articles/serum-facial.pdf"
  },
  {
    id: 'vitamina_c',
    name: "Vitamina C: Datos y Beneficios",
    benefits: "Información técnica sobre el ácido ascórbico, producción de colágeno y su rol vital en el sistema inmunitario.",
    pdfLink: "/articles/VitaminaC.pdf"
  },
  {
    id: 'vitex',
    name: "Sauzgatillo (Vitex) y Alivio Premenstrual",
    benefits: "Revisión sobre el mecanismo de acción dopaminérgico para el alivio natural del síndrome premenstrual y dismenorrea.",
    pdfLink: "/articles/vitex.pdf"
  },
  {
    id: 'proflora',
    name: "Pro-flora: Salud Intestinal",
    benefits: "Análisis sobre el uso de probióticos para mejorar la calidad de vida en pacientes con enfermedades inflamatorias.",
    pdfLink: "/articles/Pro-flora.pdf"
  },
  {
    id: 'colageno',
    name: "Colágeno y Salud Articular",
    benefits: "Beneficios del colágeno en la regeneración de tejidos y mantenimiento de la salud de las articulaciones.",
    pdfLink: "/articles/colageno.pdf"
  },
  {
    id: 'nad',
    name: "NAD: Energía Celular",
    benefits: "Estudio sobre el papel del NAD en el metabolismo energético y la reparación celular.",
    pdfLink: "/articles/NAD.pdf"
  }
];

export function Science() {
  return (
    <PageLayout>
      <div className="bg-white min-h-screen">
        {/* Hero Section - Trust Introduction */}
        <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 opacity-20">
            <img 
              src="https://images.unsplash.com/photo-1579154204601-01588f351167?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80" 
              alt="Laboratorio de investigación" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-900/80 mix-blend-multiply"></div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="flex flex-wrap gap-3 mb-6">
                  <span className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-white text-sm font-bold tracking-wide border border-white/20 backdrop-blur-md">
                    <ShieldCheck className="w-4 h-4" /> Aviso de Funcionamiento COFEPRIS: 2515115018X00403
                  </span>
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
                  Ciencia, Calidad y <br/><span className="text-[var(--color-brand)]">Transparencia Absoluta</span>
                </h1>
                <p className="text-xl text-gray-300 mb-10 leading-relaxed font-medium">
                  En Biomedics Souls, no formulamos basándonos en tendencias. Nuestro compromiso es con la investigación rigurosa, la pureza de los ingredientes y la eficacia clínica comprobada.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Visual Trust Section - Images */}
        <section className="py-20 bg-gray-50 border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Estándares de Clase Mundial</h2>
              <p className="text-lg text-slate-600">
                Controlamos cada paso del proceso, desde la selección de la materia prima hasta el encapsulado final, garantizando que lo que dice la etiqueta es exactamente lo que recibe tu cuerpo.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Procesos de Producción" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-6 left-6 text-white font-bold text-xl">Producción Certificada</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-sm leading-relaxed">Instalaciones con certificación cGMP (Buenas Prácticas de Manufactura) y control de calidad en cada lote de producción.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img 
                    src="https://images.unsplash.com/photo-1576086213369-97a306d36557?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
                    alt="Laboratorios de Alta Tecnología" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-6 left-6 text-white font-bold text-xl">Análisis de Terceros</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-sm leading-relaxed">Cada fórmula es sometida a rigurosas pruebas de laboratorios independientes para verificar pureza, potencia y ausencia de metales pesados.</p>
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 group"
              >
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Equipo Científico" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <h3 className="absolute bottom-6 left-6 text-white font-bold text-xl">Equipo Multidisciplinario</h3>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-sm leading-relaxed">Médicos, bioquímicos y nutricionistas colaboran para diseñar fórmulas sinérgicas basadas en la evidencia clínica más reciente.</p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Corporate Messages & Differentiation */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
                  Nuestra Diferencia: <br/><span className="text-[var(--color-brand)]">Innovación y Responsabilidad</span>
                </h2>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-brand)]/10 rounded-2xl flex items-center justify-center">
                      <FlaskConical className="w-6 h-6 text-[var(--color-brand)]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Dosis Clínicas Exactas</h4>
                      <p className="text-slate-600 leading-relaxed">No utilizamos "mezclas patentadas" (proprietary blends) para ocultar cantidades. Mostramos exactamente la dosis de cada ingrediente, coincidiendo con los estudios clínicos que demuestran su eficacia.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-brand)]/10 rounded-2xl flex items-center justify-center">
                      <CheckCircle2 className="w-6 h-6 text-[var(--color-brand)]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Cero Rellenos Innecesarios</h4>
                      <p className="text-slate-600 leading-relaxed">Nuestras fórmulas están libres de estearato de magnesio, dióxido de titanio, colorantes artificiales y conservantes. Solo pura eficacia biológica.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-[var(--color-brand)]/10 rounded-2xl flex items-center justify-center">
                      <Award className="w-6 h-6 text-[var(--color-brand)]" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-slate-900 mb-2">Ingredientes Patentados</h4>
                      <p className="text-slate-600 leading-relaxed">Invertimos en materias primas de marca registrada que han sido objeto de ensayos clínicos en humanos, garantizando una absorción y biodisponibilidad superior.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-50 p-10 md:p-14 rounded-[2.5rem] border border-gray-100 relative">
                <Quote className="absolute top-8 left-8 w-16 h-16 text-gray-200 -z-0" />
                <div className="relative z-10">
                  <p className="text-2xl md:text-3xl font-medium text-slate-800 leading-snug mb-8 italic">
                    "Nuestra misión no es simplemente crear suplementos, es formular soluciones biológicas respaldadas por la evidencia más rigurosa disponible. La salud de nuestros usuarios es una responsabilidad que tomamos con absoluta seriedad científica."
                  </p>
                  <div className="flex items-center gap-4">
                    <img src="https://cdn-icons-png.flaticon.com/512/6660/6660254.png" alt="Dr. Director Científico" className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md" referrerPolicy="no-referrer" />
                    <div>
                      <h5 className="font-bold text-slate-900 text-lg">Dra. Invonne</h5>
                      <p className="text-[var(--color-brand)] font-medium">Director Científico en Biomedics Souls</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scientific Papers Grid */}
        <section className="py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-2 py-1 px-3 rounded-full bg-[var(--color-brand)]/20 text-[var(--color-brand)] text-sm font-bold tracking-wide mb-4 border border-[var(--color-brand)]/30">
                <FileText className="w-4 h-4" /> EVIDENCIA POR PRODUCTO
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">Artículos Científicos</h2>
              <p className="text-xl text-gray-400">
                Accede directamente a la literatura científica, ensayos clínicos y estudios que avalan las propiedades de nuestros componentes naturales.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, i) => (
                <motion.div 
                  key={article.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-3xl p-8 border border-slate-700 hover:border-[var(--color-brand)]/50 hover:bg-slate-800 transition-all group flex flex-col h-full"
                >
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-extrabold text-white group-hover:text-[var(--color-brand)] transition-colors">
                      {article.name}
                    </h3>
                    <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center group-hover:bg-[var(--color-brand)]/20 transition-colors flex-shrink-0">
                      <Microscope className="w-5 h-5 text-gray-300 group-hover:text-[var(--color-brand)] transition-colors" />
                    </div>
                  </div>
                  
                  <div className="mb-8 flex-grow">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Hallazgos Clínicos</h4>
                    <p className="text-gray-300 leading-relaxed text-sm">
                      {article.benefits}
                    </p>
                  </div>

                  <a 
                    href={article.pdfLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto flex items-center justify-center gap-2 w-full py-3 px-4 bg-slate-700 hover:bg-[var(--color-brand)] text-white font-bold rounded-xl transition-colors duration-300"
                  >
                    <Download className="w-4 h-4" />
                    <span>Ver Artículo (PDF)</span>
                  </a>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
