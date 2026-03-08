import React from 'react';
import { ShieldCheck, MessageSquareMore } from 'lucide-react';
import { ViewState } from '../types';

interface NavigationProps {
  currentView: ViewState;
  setView: (view: ViewState) => void;
}

const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="glass-panel rounded-full px-2 py-2 flex items-center gap-1 shadow-2xl shadow-black/50">
        <button
          onClick={() => setView('vault')}
          className={`relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
            currentView === 'vault' 
              ? 'bg-zinc-800 text-white' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <ShieldCheck className="w-5 h-5" />
          <span className={`text-sm font-medium ${currentView === 'vault' ? 'block' : 'hidden'}`}>الخزنة</span>
          {currentView === 'vault' && (
             <span className="absolute inset-0 rounded-full bg-white/5 pointer-events-none"></span>
          )}
        </button>

        <button
          onClick={() => setView('chat')}
          className={`relative px-6 py-3 rounded-full flex items-center gap-2 transition-all duration-300 ${
            currentView === 'chat' 
              ? 'bg-primary text-white shadow-[0_0_15px_rgba(10,132,255,0.4)]' 
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <MessageSquareMore className="w-5 h-5" />
          <span className={`text-sm font-medium ${currentView === 'chat' ? 'block' : 'hidden'}`}>المساعد</span>
        </button>
      </div>
    </div>
  );
};

export default Navigation;