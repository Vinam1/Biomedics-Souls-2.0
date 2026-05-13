import { motion } from 'motion/react';
import { Shield, Lock, Eye, FileText, Mail, MapPin } from 'lucide-react';
import { PageLayout } from '../../components/layout/PageLayout';

export function Privacy() {
  return (
    <PageLayout>
      <div className="bg-gray-50 min-h-screen py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[var(--color-brand)] p-8 md:p-12 text-white">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8" />
                <span className="text-sm font-bold tracking-widest uppercase">Seguridad y Confianza</span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold mb-4 tracking-tight">Política de Privacidad</h1>
              <p className="text-white/80 text-lg max-w-2xl">
                Aviso legal de BIOMEDICS SOULS, S.A. de C.V. sobre el tratamiento y protección de sus datos personales.
              </p>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 prose prose-slate max-w-none">
              <div className="mb-12">
                <p className="text-lg text-[var(--color-text-secondary)] leading-relaxed">
                  <strong>BIOMEDICS SOULS, SOCIEDAD ANÓNIMA DE CAPITAL VARIABLE (S.A. de C.V.)</strong>, en lo sucesivo "La Empresa", con domicilio en Paseo Titanio manzana 28, lote 42, casa B, Joyas de Cuautitlán, Cuautitlán México, código postal 54803, es la responsable del tratamiento de sus datos personales.
                </p>
                <p className="text-[var(--color-text-secondary)] leading-relaxed mt-4">
                  En este Aviso, se describe la información que tratamos para proporcionarle nuestros servicios, garantizar la seguridad de nuestras operaciones y mejorar continuamente la experiencia que le ofrecemos a través de nuestros productos, sistemas, sitios web y aplicaciones.
                </p>
              </div>

              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] m-0">I. ¿Qué tipo de información recopilamos?</h2>
                </div>
                <p className="text-[var(--color-text-secondary)] mb-6">
                  A fin de proporcionarle los Productos de La Empresa, debemos tratar información sobre usted. El tipo de información que recopilamos depende de la forma en que usted interactúa y usa nuestros Productos.
                </p>

                <h3 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">Lo que usted y otras personas hacen y proporcionan.</h3>
                <p className="text-[var(--color-text-secondary)] mb-4">
                  <strong>Información de Identificación y Contacto:</strong> Recopilamos el contenido, las comunicaciones y otros datos que proporciona al usar nuestros Productos. Por ejemplo, cuando se registra para crear una cuenta, solicita información o se comunica con nosotros. Esto puede incluir:
                </p>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none p-0">
                  <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="block font-bold text-[var(--color-text-primary)] mb-1">Datos de Identificación</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">Nombre completo, fecha de nacimiento, sexo.</span>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="block font-bold text-[var(--color-text-primary)] mb-1">Datos de Contacto</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">Domicilio, correo electrónico, número de teléfono.</span>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="block font-bold text-[var(--color-text-primary)] mb-1">Datos Laborales</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">Puesto y área de desempeño (en caso de ser un contacto empresarial).</span>
                  </li>
                  <li className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <span className="block font-bold text-[var(--color-text-primary)] mb-1">Datos Patrimoniales y Financieros</span>
                    <span className="text-sm text-[var(--color-text-secondary)]">Información de pago, datos de facturación e información necesaria para completar transacciones comerciales.</span>
                  </li>
                </ul>

                <div className="mt-8 bg-amber-50 border-l-4 border-amber-400 p-6 rounded-r-2xl">
                  <h4 className="text-amber-800 font-bold mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4" /> Datos con protecciones especiales (Sensibles)
                  </h4>
                  <p className="text-amber-900/80 text-sm leading-relaxed">
                    Dada la naturaleza del objeto social de La Empresa, que incluye la realización de análisis clínicos, estudios genéticos, diagnósticos moleculares y pruebas biomédicas avanzadas, y el desarrollo de terapias avanzadas y tecnologías para el tratamiento de enfermedades, podemos requerir y tratar datos sensibles relacionados con la salud, antecedentes médicos, información genética o historial clínico. Siempre solicitaremos su consentimiento expreso y por escrito para el tratamiento de estos datos cuando la ley lo exija.
                  </p>
                </div>
              </section>

              <section className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Eye className="w-5 h-5" />
                  </div>
                  <h2 className="text-2xl font-bold text-[var(--color-text-primary)] m-0">II. ¿Cómo usamos esta información?</h2>
                </div>
                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed mb-6">
                  Administrar servicios de Investigación, Innovación y Desarrollo, Diseño, Fabricación y Comercialización de dispositivos médicos y Servicios Biomédicos Especializados, procesamiento de transacciones, facturación y soporte técnico.
                </p>
              </section>

              <div className="border-t border-gray-100 pt-8 mt-12 text-center">
                <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">
                  Última Actualización: 17 de enero de 2025
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </PageLayout>
  );
}
