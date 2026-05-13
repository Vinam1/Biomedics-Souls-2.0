import { motion } from 'motion/react';
import { MessageCircle, Mail, MapPin, Phone, ArrowRight, Activity } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';

export function Contact() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="py-20 bg-[var(--color-bg-light)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-6xl font-extrabold text-[var(--color-text-primary)] mb-6 tracking-tight">
                Hablemos de <span className="text-[var(--color-brand)]">Salud y Soluciones</span>
              </h1>
              <p className="text-xl text-[var(--color-text-secondary)] max-w-3xl mx-auto leading-relaxed">
                En Biomedics Soul, priorizamos la atención personalizada. Elige la vía de comunicación que prefieras para recibir asesoría técnica o comercial.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Options */}
        <section className="py-24">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* WhatsApp Option */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-[#25D366]/10 rounded-2xl flex items-center justify-center text-[#25D366] mb-8 group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Atención Inmediata vía WhatsApp</h2>
                <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                  ¿Necesitas una respuesta rápida? Inicia un chat con uno de nuestros especialistas para resolver dudas sobre productos o pedidos en tiempo real.
                </p>
                <a 
                  href="https://wa.me/525647969316" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-full px-8 py-4 bg-[#25D366] hover:bg-[#128C7E] text-white font-bold rounded-xl transition-all shadow-md hover:shadow-lg"
                >
                  Iniciar Chat en WhatsApp
                  <ArrowRight className="ml-2 w-5 h-5" />
                </a>
              </motion.div>

              {/* Email Option */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="bg-white p-10 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
              >
                <div className="w-16 h-16 bg-[var(--color-brand)]/10 rounded-2xl flex items-center justify-center text-[var(--color-brand)] mb-8 group-hover:scale-110 transition-transform">
                  <Mail className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">Consultas Formales por Correo</h2>
                <p className="text-[var(--color-text-secondary)] mb-8 leading-relaxed">
                  Para cotizaciones detalladas, propuestas de consultoría o temas administrativos, escríbenos y nuestro equipo te contactará a la brevedad.
                </p>
                <a 
                  href="mailto:soulsbiomedics@gmail.com" 
                  className="inline-flex items-center justify-center w-full px-8 py-4 border-2 border-[var(--color-brand)] text-[var(--color-brand)] hover:bg-[var(--color-brand)] hover:text-white font-bold rounded-xl transition-all"
                >
                  soulsbiomedics@gmail.com
                </a>
              </motion.div>
            </div>

            {/* Additional Info */}
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <MapPin className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Ubicación</h3>
                <p className="text-gray-500 text-sm">Ciudad de México, México</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Phone className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Teléfono</h3>
                <p className="text-gray-500 text-sm">+52 56 4796 9316</p>
              </div>
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4">
                  <Activity className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Horario</h3>
                <p className="text-gray-500 text-sm">Lun - Vie: 9:00 - 18:00</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
