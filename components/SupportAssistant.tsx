
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { X, Send, UserCircle, Bot, Loader2, Mic, Sparkles, BrainCircuit } from 'lucide-react';
import { ChatMessage } from '../types';
import AIVoiceAssistant from './AIVoiceAssistant';

interface SupportAssistantProps {
  onClose: () => void;
  userContext: any;
}

const SupportAssistant: React.FC<SupportAssistantProps> = ({ onClose, userContext }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: `Namaste ${userContext.name}! I am your Gemini 3.0 AI Guide. I'm here to ensure your skill exchange is successful. What's on your mind?` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showVoice, setShowVoice] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo(0, scrollRef.current.scrollHeight);
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: userMsg,
        config: {
          systemInstruction: `You are the Gemini 3.0 AI Guide for the SkillBarter app. 
          Your goal is to help users exchange skills efficiently. 
          User Context: ${userContext.name}, teaching ${userContext.skillsToTeach.join(', ')}, learning ${userContext.skillsToLearn.join(', ')}.
          Be professional, helpful, and encourage focused learning.`
        }
      });

      setMessages(prev => [...prev, { role: 'model', text: response.text || "I apologize, I'm having trouble processing that right now." }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: "Gemini service is currently at capacity. Please try again in a moment." }]);
    } finally {
      setIsTyping(false);
    }
  };

  if (showVoice) return <AIVoiceAssistant userContext={userContext} onClose={() => setShowVoice(false)} />;

  return (
    <div className="fixed bottom-4 right-4 lg:bottom-24 lg:right-6 w-[calc(100vw-2rem)] sm:w-96 max-h-[80vh] lg:h-[600px] bg-white rounded-3xl shadow-[0_30px_90px_-20px_rgba(0,0,0,0.4)] flex flex-col border border-indigo-100 animate-scaleIn overflow-hidden z-[60]">
      {/* Gemini Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-700 p-5 flex items-center justify-between text-white shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
            <BrainCircuit size={22} className="text-white animate-pulse" />
          </div>
          <div>
            <span className="font-black text-sm block tracking-tight">Gemini 3.0</span>
            <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest">AI Guide • Active</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowVoice(true)} className="hover:bg-white/10 p-2 rounded-xl transition-colors flex items-center gap-2 text-xs font-bold">
            <Mic size={18} />
          </button>
          <button onClick={onClose} className="hover:bg-white/10 p-2 rounded-xl"><X size={20} /></button>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50/50 min-h-0">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] p-4 rounded-3xl text-sm ${
              m.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none shadow-xl shadow-indigo-200' 
                : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none shadow-sm'
            }`}>
              {m.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-2">
              <Sparkles size={14} className="text-indigo-400 animate-spin" />
              <span className="text-xs font-bold text-slate-400">Gemini is thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t bg-white flex gap-3 shrink-0">
        <div className="flex-1 relative">
           <input 
            type="text" 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask Gemini anything about bartering..."
            className="w-full bg-slate-100 border-2 border-transparent focus:border-indigo-600 focus:bg-white rounded-2xl px-5 py-3 text-sm outline-none transition-all font-medium text-slate-800"
          />
        </div>
        <button 
          onClick={handleSend} 
          className="w-12 h-12 bg-indigo-600 text-white rounded-2xl hover:bg-indigo-700 active:scale-95 transition-all shrink-0 shadow-lg flex items-center justify-center"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default SupportAssistant;
