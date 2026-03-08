import React from 'react';
import { createRoot } from 'react-dom';

function App() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="glass-panel p-8 rounded-2xl text-center">
        <h1 className="text-3xl font-bold text-primary mb-4">حارسي الأمين</h1>
        <p className="text-gray-400">جاري تجهيز الخزنة الآمنة...</p>
      </div>
    </div>
  );
}

const root = createRoot(document.getElementById('root'));
root.render(<App />);
