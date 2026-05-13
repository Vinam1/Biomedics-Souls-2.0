import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Plus, Camera, Image, Monitor, Loader2, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import { ProductController } from '../../controllers/productController';
import { Product } from '../../models/types';

interface AIChatBubbleProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AIChatBubble({ isOpen, onClose }: AIChatBubbleProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; content: string; image?: string }[]>([
    { role: 'ai', content: '¡Hola! Soy tu asistente de Biomedics Souls. Puedo ayudarte con dudas sobre nuestros suplementos, analizar etiquetas o recomendarte el protocolo ideal. ¿En qué puedo apoyarte hoy?' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async (text?: string, image?: string) => {
    const content = text || inputValue;
    if (!content.trim() && !image) return;

    const newMessages = [...messages, { role: 'user' as const, content: content || (image ? 'Imagen adjunta' : ''), image }];
    setMessages(newMessages);
    setInputValue('');
    setIsTyping(true);

    try {
      const products = await ProductController.getAll();
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });
      const model = "gemini-3-flash-preview";

      const parts: any[] = [
        { text: `Eres el asistente experto de Biomedics Souls. Tu objetivo es ayudar a los usuarios con información sobre suplementos, nutrición y bienestar.
        
        CONTEXTO DE PRODUCTOS:
        ${products.map(p => `- ${p.name}: ${p.desc || p.shortDesc}. Precio: $${p.price}. Beneficios: ${p.benefits || 'Varios'}`).join('\n')}
        
        REGLAS:
        1. Sé profesional, amable y conciso.
        2. Si preguntan por un producto, usa la información del catálogo.
        3. Si envían una imagen, analízala (puede ser una etiqueta de suplemento, una foto de comida o una captura de pantalla de la web).
        4. No des consejos médicos diagnósticos, siempre sugiere consultar con un profesional si la duda es médica grave.
        5. Mantén un tono motivador hacia un estilo de vida saludable.` }
      ];

      // Add conversation history (last 5 messages for context)
      const history = messages.slice(-5).map(m => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`).join('\n');
      parts.push({ text: `HISTORIAL RECIENTE:\n${history}` });

      // Add current user input
      if (image) {
        const base64Data = image.split(',')[1];
        const mimeType = image.split(';')[0].split(':')[1];
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }
      
      parts.push({ text: content || 'Analiza esta imagen por favor.' });

      const response = await ai.models.generateContent({
        model,
        contents: { parts },
      });

      const aiText = response.text || 'Lo siento, tuve un problema procesando tu solicitud. ¿Podrías intentar de nuevo?';
      setMessages(prev => [...prev, { role: 'ai', content: aiText }]);
    } catch (error) {
      console.error('Error calling Gemini:', error);
      setMessages(prev => [...prev, { role: 'ai', content: 'Lo siento, mi conexión con la red neuronal de Biomedics ha fallado momentáneamente. ¿Podemos intentar en unos segundos?' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleScreenshot = async () => {
    setIsCapturing(true);
    setIsMenuOpen(false);
    try {
      // Small delay to ensure menu is closed
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // html-to-image handles modern CSS like oklch much better than html2canvas
      const dataUrl = await toPng(document.body, {
        cacheBust: true,
        skipFonts: true, // Speeds up capture and avoids some font-related issues
      });

      setMessages(prev => [...prev, { 
        role: 'user', 
        content: 'He capturado mi pantalla actual.', 
        image: dataUrl 
      }]);
      handleSend('Analiza esta captura de pantalla de la aplicación.', dataUrl);
    } catch (error) {
      console.error('Error capturing screenshot:', error);
    } finally {
      setIsCapturing(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'gallery' | 'camera') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        handleSend(type === 'camera' ? 'He tomado una foto.' : 'He adjuntado una imagen.', dataUrl);
      };
      reader.readAsDataURL(file);
    }
    setIsMenuOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-80 md:w-96 overflow-hidden mb-2 flex flex-col max-h-[500px]"
          id="ai-chat-container"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[var(--color-purple)] to-[var(--color-dark-blue)] text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm">Asistente IA</h4>
                <p className="text-xs text-white/80">Biomedics Souls</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Chat Messages */}
          <div 
            ref={scrollRef}
            className="flex-grow p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4 min-h-[300px] scroll-smooth"
          >
            {messages.map((msg, i) => (
              <div 
                key={i} 
                className={msg.role === 'user' ? 'self-end max-w-[85%]' : 'self-start max-w-[85%]'}
              >
                <div className={`p-3 rounded-2xl shadow-sm text-sm ${
                  msg.role === 'user' 
                    ? 'bg-[var(--color-purple)] text-white rounded-tr-none' 
                    : 'bg-white text-[var(--color-text-primary)] rounded-tl-none border border-gray-100'
                }`}>
                  {msg.image && (
                    <div className="relative group mb-2">
                      <img src={msg.image} alt="Adjunto" className="rounded-lg max-w-full h-auto border border-gray-100 shadow-sm" />
                    </div>
                  )}
                  <div className="markdown-body">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="self-start bg-white border border-gray-100 p-3 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                <div className="flex gap-1">
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                    className="w-1.5 h-1.5 bg-[var(--color-brand)] rounded-full"
                  />
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                    className="w-1.5 h-1.5 bg-[var(--color-brand)] rounded-full"
                  />
                  <motion.span 
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                    className="w-1.5 h-1.5 bg-[var(--color-brand)] rounded-full"
                  />
                </div>
              </div>
            )}
            {isCapturing && (
              <div className="self-center bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm flex items-center gap-2 text-xs text-gray-500">
                <Loader2 className="w-3 h-3 animate-spin" />
                Capturando pantalla...
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 shrink-0">
            <div className="relative flex items-center gap-2">
              {/* Action Menu Toggle */}
              <div className="relative">
                <button 
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className={`p-2 rounded-full transition-all ${
                    isMenuOpen ? 'bg-gray-100 text-gray-600 rotate-45' : 'bg-gray-50 text-gray-400 hover:text-[var(--color-brand)]'
                  }`}
                >
                  <Plus className="w-5 h-5" />
                </button>

                {/* Action Menu */}
                <AnimatePresence>
                  {isMenuOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full left-0 mb-3 bg-white rounded-xl shadow-xl border border-gray-100 p-2 flex flex-col gap-1 min-w-[160px]"
                    >
                      <button 
                        onClick={handleScreenshot}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition-colors"
                      >
                        <Monitor className="w-4 h-4 text-blue-500" />
                        Captura de pantalla
                      </button>
                      <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition-colors"
                      >
                        <Image className="w-4 h-4 text-purple-500" />
                        Adjuntar imagen
                      </button>
                      <button 
                        onClick={() => cameraInputRef.current?.click()}
                        className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg text-sm text-gray-600 transition-colors"
                      >
                        <Camera className="w-4 h-4 text-emerald-500" />
                        Cámara
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Text Input */}
              <div className="relative flex-grow">
                <input 
                  type="text" 
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregúntame algo..." 
                  className="w-full bg-gray-50 border border-gray-200 rounded-full pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-[var(--color-brand)] focus:bg-white transition-all"
                />
                <button 
                  onClick={() => handleSend()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-[var(--color-brand)] hover:scale-110 transition-transform"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Hidden Inputs */}
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={(e) => handleFileChange(e, 'gallery')} 
          />
          <input 
            type="file" 
            ref={cameraInputRef} 
            className="hidden" 
            accept="image/*" 
            capture="environment" 
            onChange={(e) => handleFileChange(e, 'camera')} 
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
