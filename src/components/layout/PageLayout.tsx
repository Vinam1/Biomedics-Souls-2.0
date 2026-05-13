import { ReactNode, useState } from 'react';
import { Bot } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { Header } from './Header';
import { Footer } from './Footer';
import { AIChatBubble } from '../../views/components/AIChatBubble';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-[var(--color-text-primary)]">
      <Header />
      <main className="flex-grow">
        {children}
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
