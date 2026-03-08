
import React, { useState, useEffect } from 'react';
import { Lock, Delete } from 'lucide-react';

interface AuthScreenProps {
  onAuthenticated: () => void;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthenticated }) => {
  const [pin, setPin] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  
  // PIN Configuration
  const CORRECT_PIN = "1324";

  useEffect(() => {
    if (pin.length === 4) {
      if (pin === CORRECT_PIN) {
        // Success
        if (navigator.vibrate) navigator.vibrate([50]);
        setTimeout(() => {
            onAuthenticated();
        }, 300);
      } else {
        // Error
        if (navigator.vibrate) navigator.vibrate([50, 50, 50]);
        setError(true);
        setTimeout(() => {
          setPin('');
          setError(false);
        }, 500);
      }
    }
  }, [pin, onAuthenticated]);

  const handlePress = (digit: string) => {
    if (navigator.vibrate) navigator.vibrate(15); // Haptic feedback
    if (pin.length < 4) {
      setPin(prev => prev + digit);
    }
  };

  const handleDelete = () => {
    if (navigator.vibrate) navigator.vibrate(10);
    setPin(prev => prev.slice(0, -1));
  };

  return (
    <div className="h-[100dvh] w-full bg-midnight flex flex-col items-center justify-between py-12 px-6 relative overflow-hidden select-none font-sans pt-[max(3rem,env(safe-area-inset-top))] pb-[max(3rem,env(safe-area-inset-bottom))]">
      {/* Background decoration */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className={`flex flex-col items-center z-10 w-full mt-10 transition-transform ${error ? 'animate-shake' : ''}`}>
        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-900/20 border border-zinc-800">
          <Lock className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">مرحباً بعودتك</h1>
        <p className="text-zinc-500 text-sm mb-8">أدخل رمز المرور (1324) للوصول</p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-8" dir="ltr">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                pin.length > i 
                  ? 'bg-primary shadow-[0_0_10px_#0A84FF] scale-110' 
                  : 'bg-zinc-800 border border-zinc-700'
              }`}
            />
          ))}
        </div>
        {error && <p className="text-red-500 text-sm animate-pulse font-medium">رمز المرور غير صحيح</p>}
      </div>

      {/* Number Pad */}
      <div className="w-full max-w-sm z-10 mb-8" dir="ltr">
        <div className="grid grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handlePress(num.toString())}
              className="w-20 h-20 rounded-full bg-zinc-900/50 hover:bg-zinc-800 backdrop-blur-md text-2xl font-bold text-white transition-all active:scale-95 active:bg-zinc-700 flex items-center justify-center mx-auto border border-zinc-800/50 outline-none touch-manipulation font-mono shadow-lg"
            >
              {num}
            </button>
          ))}
          <div className="w-20 h-20" /> {/* Spacer */}
          <button
            onClick={() => handlePress("0")}
            className="w-20 h-20 rounded-full bg-zinc-900/50 hover:bg-zinc-800 backdrop-blur-md text-2xl font-bold text-white transition-all active:scale-95 active:bg-zinc-700 flex items-center justify-center mx-auto border border-zinc-800/50 outline-none touch-manipulation font-mono shadow-lg"
          >
            0
          </button>
          <button
            onClick={handleDelete}
            className="w-20 h-20 rounded-full hover:bg-zinc-800/50 text-white transition-all active:scale-95 flex items-center justify-center mx-auto outline-none touch-manipulation"
          >
            <Delete className="w-6 h-6 text-zinc-400" />
          </button>
        </div>
      </div>
      
      <button className="text-zinc-600 text-xs mt-4 hover:text-primary transition-colors z-10">
        نسيت رمز الدخول؟
      </button>
    </div>
  );
};

export default AuthScreen;
