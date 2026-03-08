
import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, WifiOff, Image as ImageIcon, X, Palette, Wand2, MessageCircle, Smile, Download, Maximize2, ArrowRight } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

interface ChatProps {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onBack: () => void;
}

const SUGGESTIONS = [
  { label: '🎨 ارسم لي', text: 'ارسم لي صورة قطة في الفضاء', icon: <Palette className="w-3 h-3" /> },
  { label: '✨ عدل الصورة', text: 'خلي الصورة هذي كرتونية', icon: <Wand2 className="w-3 h-3" /> },
  { label: '💬 سوالف', text: 'سولف لي عن آخر التكنولوجيا', icon: <MessageCircle className="w-3 h-3" /> },
  { label: '😂 ضحكني', text: 'عطني نكتة جديدة', icon: <Smile className="w-3 h-3" /> },
];

const Chat: React.FC<ChatProps> = ({ messages, setMessages, onBack }) => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  // State for Full Screen Image Modal
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const endRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Monitor online status
  useEffect(() => {
    const handleStatusChange = () => {
      setIsOnline(navigator.onLine);
    };
    window.addEventListener('online', handleStatusChange);
    window.addEventListener('offline', handleStatusChange);
    return () => {
      window.removeEventListener('online', handleStatusChange);
      window.removeEventListener('offline', handleStatusChange);
    };
  }, []);

  const scrollToBottom = () => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading, selectedImage]); 

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
            setSelectedImage(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
      setSelectedImage(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDownloadImage = (e: React.MouseEvent, imageUrl: string) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `my-guardian-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSend = async (textOverride?: string) => {
    const textToSend = textOverride || input.trim();
    // Allow sending if there is text OR an image
    if ((!textToSend && !selectedImage) || loading) return;

    if (!textOverride) setInput('');
    const imageToSend = selectedImage; // Capture current image
    clearImage(); // Clear preview

    // Haptic feedback
    if (navigator.vibrate) navigator.vibrate(10);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textToSend,
      image: imageToSend || undefined,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    try {
      if (!isOnline) {
        await new Promise(resolve => setTimeout(resolve, 600)); 
      }

      // Call the NEW General AI Service
      const response = await generateAIResponse(textToSend, imageToSend || undefined);
      
      const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'model',
          text: response.text,
          image: response.image, // Handle generated image
          timestamp: Date.now()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-black/20 relative animate-fade-in">
       {/* Full Screen Image Modal */}
       {previewImage && (
           <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in-up">
               <button 
                  onClick={() => setPreviewImage(null)}
                  className="absolute top-6 right-6 p-2 bg-zinc-800/50 hover:bg-zinc-700 rounded-full text-white/80 transition-colors z-[101]"
               >
                   <X className="w-8 h-8" />
               </button>
               
               <img 
                  src={previewImage} 
                  className="max-w-full max-h-[80vh] object-contain rounded-xl shadow-2xl border border-white/10"
                  alt="Full preview"
               />

               <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <button 
                      onClick={(e) => handleDownloadImage(e, previewImage)}
                      className="flex items-center gap-2 bg-primary hover:bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95"
                  >
                      <Download className="w-5 h-5" />
                      <span>حفظ الصورة</span>
                  </button>
               </div>
           </div>
       )}

       {/* Header */}
       <div className="px-4 py-4 pt-[max(1rem,env(safe-area-inset-top))] border-b border-white/5 bg-black/60 backdrop-blur-xl sticky top-0 z-20 flex items-center gap-3 justify-between shadow-lg">
          <div className="flex items-center gap-3">
            {/* Back Button */}
            <button 
                onClick={onBack}
                className="w-10 h-10 rounded-xl bg-zinc-800/80 hover:bg-zinc-700 flex items-center justify-center text-zinc-300 transition-colors"
            >
                <ArrowRight className="w-5 h-5" />
            </button>

            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all shadow-lg ${isOnline ? 'bg-gradient-to-tr from-purple-600 to-pink-500 shadow-purple-500/20' : 'bg-zinc-800 border border-zinc-700'}`}>
                {isOnline ? <Sparkles className="w-5 h-5 text-white" /> : <Bot className="w-5 h-5 text-zinc-400" />}
            </div>
            <div>
                <h2 className="font-bold text-base text-white tracking-wide leading-none">المساعد</h2>
                <div className="flex items-center gap-1.5 mt-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`}></span>
                    <p className="text-[10px] font-medium text-zinc-400">
                        {isOnline ? 'متصل' : 'غير متصل'}
                    </p>
                </div>
            </div>
          </div>
          
          {!isOnline && (
            <div className="bg-amber-500/10 border border-amber-500/20 rounded-full p-2">
              <WifiOff className="w-5 h-5 text-amber-500" />
            </div>
          )}
       </div>

       {/* Messages */}
       <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-40 no-scrollbar touch-pan-y">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'} animate-fade-in-up`}
            >
               <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${msg.role === 'user' ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* Avatar */}
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-auto shadow-md ${msg.role === 'user' ? 'bg-zinc-800 border border-zinc-700' : (isOnline ? 'bg-gradient-to-br from-purple-500 to-pink-600' : 'bg-zinc-700')}`}>
                    {msg.role === 'user' ? <User className="w-4 h-4 text-zinc-400" /> : <Bot className="w-4 h-4 text-white" />}
                  </div>

                  {/* Bubble Container */}
                  <div className="flex flex-col gap-2">
                      {/* Image Attachment (User Upload OR AI Generation) */}
                      {msg.image && (
                          <div className={`group relative rounded-2xl overflow-hidden border border-white/10 shadow-lg cursor-pointer transition-transform active:scale-[0.98] ${msg.role === 'user' ? 'self-start max-w-[200px]' : 'self-end w-full'}`} onClick={() => setPreviewImage(msg.image!)}>
                              <img src={msg.image} alt="Attachment" className="w-full h-auto object-cover" />
                              
                              {/* Overlay Icons for Interaction */}
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                  <div className="bg-black/60 p-2 rounded-full text-white backdrop-blur-sm">
                                      <Maximize2 className="w-5 h-5" />
                                  </div>
                              </div>

                              {msg.role === 'model' && (
                                <div className="absolute bottom-2 right-2 bg-black/50 px-2 py-1 rounded text-[10px] text-white backdrop-blur-md">تم التوليد بواسطة AI</div>
                              )}
                          </div>
                      )}
                      
                      {/* Text Bubble */}
                      {msg.text && (
                        <div className={`p-4 rounded-[1.2rem] text-[15px] leading-relaxed shadow-lg whitespace-pre-wrap ${
                            msg.role === 'user' 
                            ? 'bg-zinc-800 text-white rounded-br-none border border-zinc-700/50' 
                            : (isOnline 
                                    ? 'bg-zinc-900/90 backdrop-blur-md text-white rounded-bl-none border border-zinc-700/50 shadow-purple-900/10' 
                                    : 'bg-zinc-700 text-zinc-100 rounded-bl-none border border-zinc-600')
                        }`}>
                            {msg.text}
                        </div>
                      )}
                  </div>
               </div>
            </div>
          ))}
          
          {loading && (
             <div className="flex justify-end animate-fade-in-up">
               <div className="flex flex-row-reverse gap-3 max-w-[85%]">
                  <div className="w-8 h-8 rounded-full bg-zinc-800/50 flex items-center justify-center mt-auto border border-zinc-700/30">
                     <Bot className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="bg-zinc-800/50 border border-zinc-700/30 p-4 rounded-[1.2rem] rounded-bl-none backdrop-blur-sm">
                     <div className="flex gap-1.5 items-center h-full">
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                        <span className="w-2 h-2 bg-zinc-400 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                     </div>
                  </div>
               </div>
             </div>
          )}
          <div ref={endRef} />
       </div>

       {/* Input Area & Quick Actions */}
       <div className="absolute bottom-6 left-0 w-full z-30 flex flex-col gap-2 pb-[env(safe-area-inset-bottom)]">
          
          {/* Image Preview (If selected) */}
          {selectedImage && (
              <div className="mx-4 mb-1 p-2 bg-zinc-900/90 border border-zinc-700 rounded-2xl flex items-center gap-3 w-fit animate-fade-in-up backdrop-blur-md">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden border border-zinc-600">
                      <img src={selectedImage} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                  <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">صورة مرفقة</span>
                      <span className="text-[10px] text-zinc-400">جاهزة للإرسال أو التعديل</span>
                  </div>
                  <button onClick={clearImage} className="p-1.5 bg-zinc-800 rounded-full text-zinc-400 hover:text-red-400 mr-2">
                      <X className="w-4 h-4" />
                  </button>
              </div>
          )}

          {/* Quick Actions Chips */}
          <div className="px-4 overflow-x-auto no-scrollbar flex gap-2 pb-1">
             {SUGGESTIONS.map((chip, idx) => (
                <button
                   key={idx}
                   onClick={() => handleSend(chip.text)}
                   disabled={loading}
                   className="flex items-center gap-1.5 bg-zinc-800/80 hover:bg-zinc-700 border border-zinc-600/50 backdrop-blur-md px-3 py-2 rounded-xl text-xs font-bold text-zinc-200 whitespace-nowrap transition-all active:scale-95"
                >
                   {chip.icon}
                   <span>{chip.label}</span>
                </button>
             ))}
          </div>

          <div className="px-4">
            <div className="glass-panel rounded-[2rem] p-1.5 flex items-end gap-2 shadow-[0_8px_32px_rgba(0,0,0,0.5)] border border-white/10 backdrop-blur-2xl bg-zinc-900/80">
               
               <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleImageSelect}
               />
               
               <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-12 h-12 rounded-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-primary transition-colors flex-shrink-0"
               >
                   <ImageIcon className="w-5 h-5" />
               </button>

               <textarea 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={isOnline ? "اكتب، ارسم، أو عدل صورة..." : "المحادثة غير متصلة"}
                  rows={1}
                  className="flex-1 bg-transparent text-white placeholder-zinc-500 px-2 py-3.5 focus:outline-none text-[16px] resize-none overflow-hidden" 
                  style={{ minHeight: '48px', maxHeight: '120px' }}
               />
               
               <button 
                  onClick={() => handleSend()}
                  disabled={loading || (!input.trim() && !selectedImage)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 active:scale-95 flex-shrink-0 mb-[1px] ${
                     (input.trim() || selectedImage)
                      ? 'bg-primary text-white shadow-lg shadow-blue-500/30 rotate-0' 
                      : 'bg-zinc-800 text-zinc-600 rotate-90 opacity-50'
                  }`}
               >
                  <Send className="w-5 h-5 ml-1" />
               </button>
            </div>
          </div>
       </div>
    </div>
  );
};

export default Chat;
