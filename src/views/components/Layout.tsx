import { Outlet } from 'react-router-dom';
import { Bot } from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { AIChatBubble } from './AIChatBubble';
import { Header } from '../../components/layout/Header';
import { Footer } from '../../components/layout/Footer';

export function Layout() {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[var(--color-text-primary)]">
      <Header />

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      <Footer />

      {/* Interactive Bubbles */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4">
        <AnimatePresence>
          {isAIChatOpen && (
            <AIChatBubble isOpen={true} onClose={() => setIsAIChatOpen(false)} />
          )}
        </AnimatePresence>

        <button 
          onClick={() => setIsAIChatOpen(!isAIChatOpen)}
          className="w-14 h-14 bg-gradient-to-tr from-[var(--color-purple)] to-[var(--color-dark-blue)] text-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition-transform"
        >
          <Bot className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
