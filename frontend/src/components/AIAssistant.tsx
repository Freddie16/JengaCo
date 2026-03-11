
import React, { useState, useRef, useEffect } from 'react';
import { getConstructionAdvice } from '../services/groqService';
import { Project } from '../types';

interface AIAssistantProps {
  project: Project;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: `Jambo! I'm your JengaHub AI. Need help with building permits or material costs in ${project.location}?` }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    const context = `User is building in ${project.location}. Current budget is ${project.budget}. Already spent ${project.spent}. Project status: ${project.status}.`;
    const aiResponse = await getConstructionAdvice(userMessage, context);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "Pole, I had trouble processing that. Can you try again?" }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 rounded-full shadow-2xl shadow-blue-900/50 flex items-center justify-center text-white text-2xl z-50 hover:scale-110 transition-all hover:bg-blue-700"
      >
        {isOpen ? <i className="fa-solid fa-xmark"></i> : <i className="fa-solid fa-robot"></i>}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-sm md:max-w-md h-[500px] glass rounded-3xl shadow-2xl z-50 flex flex-col overflow-hidden border border-blue-500/30 animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="p-4 bg-blue-600 flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <i className="fa-solid fa-brain text-white"></i>
            </div>
            <div>
              <h4 className="text-white font-bold">JengaHub AI</h4>
              <p className="text-xs text-blue-100">Construction Expert</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" ref={scrollRef}>
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-800 text-slate-200'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-800 p-3 rounded-2xl text-slate-400 text-xs flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce delay-75">.</span>
                  <span className="animate-bounce delay-150">.</span>
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-slate-900/50 border-t border-slate-800">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Ask about NCA laws, cement prices..."
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-3 pl-4 pr-12 text-white text-sm outline-none focus:border-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              />
              <button 
                onClick={handleSend}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-blue-600 rounded-xl flex items-center justify-center text-white hover:bg-blue-700 transition-all"
              >
                <i className="fa-solid fa-paper-plane text-xs"></i>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIAssistant;
