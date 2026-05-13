import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Mail, Send } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[var(--color-footer)] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-6 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full p-[1px] bg-gradient-to-tr from-[var(--color-celeste)] via-[var(--color-purple)] to-[var(--color-dark-blue)]">
                  <div className="w-full h-full rounded-full bg-[var(--color-footer)]"></div>
                </div>
                <span className="relative z-10 font-serif text-xl font-bold text-white tracking-tighter">
                  BS
                </span>
              </div>
              <span className="font-bold text-xl tracking-tight">Biomedics Souls</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Suplementos de grado científico diseñados para optimizar tu cuerpo y mente.
            </p>
            <div className="flex gap-4">
              <a href="https://www.facebook.com/profile.php?id=61582038100912" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-brand)] hover:scale-110 transition-all text-gray-400 hover:text-white">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="https://www.instagram.com/sensea.mx?igsh=MXhrcG9jc3cxMjNnNQ%3D%3D" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-brand)] hover:scale-110 transition-all text-gray-400 hover:text-white">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="https://wa.me/525647969316" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-brand)] hover:scale-110 transition-all text-gray-400 hover:text-white">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="mailto:soulsbiomedics@gmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-brand)] hover:scale-110 transition-all text-gray-400 hover:text-white">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Explorar</h3>
            <ul className="flex flex-col gap-4 text-gray-400 text-sm">
              <li><Link to="/catalog" className="hover:text-white hover:translate-x-1 transition-all inline-block">Catálogo</Link></li>
              <li><Link to="/quiz" className="hover:text-white hover:translate-x-1 transition-all inline-block">Quiz de Nutrición</Link></li>
              <li><Link to="/science" className="hover:text-white hover:translate-x-1 transition-all inline-block">Ciencia y Evidencia</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-6">Nosotros</h3>
            <ul className="flex flex-col gap-4 text-gray-400 text-sm">
              <li><Link to="/#about" className="hover:text-white hover:translate-x-1 transition-all inline-block">Sobre Biomedics</Link></li>
              <li><Link to="/faq" className="hover:text-white hover:translate-x-1 transition-all inline-block">Preguntas Frecuentes (FAQ)</Link></li>
              <li><Link to="/contact" className="hover:text-white hover:translate-x-1 transition-all inline-block">Contacto</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-6">Nuestra App</h3>
            <div className="flex flex-col items-start gap-4">
              <div className="bg-white p-2 rounded-xl">
                <img 
                  src="https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://play.google.com/store/apps" 
                  alt="QR PlayStore" 
                  className="w-24 h-24"
                />
              </div>
              <p className="text-gray-400 text-sm font-bold">Prueba nuestra app</p>
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Biomedics Souls. Todos los derechos reservados.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-white transition-colors">Privacidad</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
