
import React, { useState } from 'react';
import AuthScreen from './components/AuthScreen';
import Vault from './components/Vault';
import Chat from './components/Chat';
import Navigation from './components/Navigation';
import { ViewState, ChatMessage } from './types';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('vault');
  
  // Lifted State: Chat messages live here now so they don't disappear when switching tabs
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'هلا والله! 👋\nأنا مساعدك الذكي، موجود هنا عشانك.\n\nأقدر أسولف معك، أجاوب أسئلتك، وحتى **أرسم لك صور** أو أعدل عليها! 🎨✨\n\nوش بخاطرك اليوم؟',
      timestamp: Date.now()
    }
  ]);

  if (!isAuthenticated) {
    return <AuthScreen onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="h-[100dvh] w-full bg-black text-white relative overflow-hidden font-sans touch-pan-y">
      {/* Noise Texture REMOVED to fix encoding issues */}

      {/* Dynamic Background Blob for Atmosphere */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className={`absolute top-[-10%] right-[-10%] w-[400px] h-[400px] rounded-full blur-[120px] transition-colors duration-1000 opacity-20 ${
             currentView === 'chat' ? 'bg-blue-600' : 'bg-purple-900'
         }`} />
         <div className={`absolute bottom-[-10%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[100px] transition-colors duration-1000 opacity-20 ${
             currentView === 'chat' ? 'bg-cyan-600' : 'bg-zinc-800'
         }`} />
      </div>

      {/* Main Content Area */}
      <main className="relative z-10 h-full w-full">
        {currentView === 'vault' && <Vault />}
        {currentView === 'chat' && (
          <Chat 
            messages={messages} 
            setMessages={setMessages}
            onBack={() => setCurrentView('vault')}
          />
        )}
      </main>

      {/* Navigation Dock - Hidden when in Chat for full screen experience */}
      {currentView !== 'chat' && (
        <Navigation currentView={currentView} setView={setCurrentView} />
      )}
    </div>
  );
};

export default App;
