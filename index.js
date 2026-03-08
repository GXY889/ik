import React from 'react';
import { createRoot } from 'react-dom';
import { Shield, Lock, ShieldCheck } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-midnight">
      <div className="glass-panel p-10 rounded-[2rem] max-w-sm w-full text-center shadow-2xl border-primary/20">
        <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <Shield className="text-primary w-12 h-12" />
        </div>
        
        <h1 className="text-3xl font-extrabold mb-2 bg-gradient-to-l from-white to-gray-400 bg-clip-text text-transparent">
          حارسي الأمين
        </h1>
        <p className="text-gray-400 mb-8 text-sm leading-relaxed">
          خزنة كلمات المرور الشخصية. أمان عالي، خصوصية تامة، وسهولة في الوصول.
        </p>
        
        <div className="space-y-3">
          <button className="w-full bg-primary hover:bg-blue-600 text-white font-bold py-4 rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2">
            <Lock size={18} />
            فتح الخزنة
          </button>
          
          <button className="w-full bg-white/5 hover:bg-white/10 text-white font-medium py-4 rounded-xl transition-all flex items-center justify-center gap-2">
            <ShieldCheck size={18} className="text-green-500" />
            فحص الأمان
          </button>
        </div>
        
        <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest">
          برمجة خاصة • مشفر بالكامل
        </p>
      </div>
    </div>
  );
}

// تشغيل التطبيق في صفحة الـ HTML
const root = createRoot(document.getElementById('root'));
root.render(<App />);
