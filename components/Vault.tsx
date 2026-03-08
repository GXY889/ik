
import React, { useState, useEffect } from 'react';
import { Plus, Search, Copy, Eye, EyeOff, Wallet, Globe, Briefcase, Lock, Download, Check, Trash2, ArrowUpDown, ShieldCheck, ShieldAlert, Share, PlusSquare, X, Smartphone, MoreVertical, ExternalLink, Link as LinkIcon, AtSign, AlertTriangle } from 'lucide-react';
import { Account } from '../types';
import * as storageService from '../services/storageService';

const Vault: React.FC = () => {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [search, setSearch] = useState('');
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'az' | 'za'>('newest');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [revealedIds, setRevealedIds] = useState<Set<string>>(new Set());
  
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedUserAccount, setCopiedUserAccount] = useState<string | null>(null);

  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallHelp, setShowInstallHelp] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  
  const [accountToDelete, setAccountToDelete] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newCategory, setNewCategory] = useState<Account['category']>('other');

  useEffect(() => {
    setAccounts(storageService.getAccounts());
    setCurrentUrl(window.location.href);
    setIsSecure(window.location.protocol === 'https:' || window.location.hostname === 'localhost');
    
    const userAgent = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(userAgent));

    const handleInstallPrompt = (e: any) => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener('beforeinstallprompt', handleInstallPrompt);

    const checkStandalone = () => {
        setIsStandalone(window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone);
    };
    checkStandalone();
    return () => window.removeEventListener('beforeinstallprompt', handleInstallPrompt);
  }, []);

  const getFilteredAndSortedAccounts = () => {
    let filtered = accounts;
    if (search) {
      filtered = filtered.filter(acc => 
        acc.title.toLowerCase().includes(search.toLowerCase()) || 
        acc.username.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(acc => acc.category === selectedCategory);
    }
    return filtered.sort((a, b) => {
      switch (sortOption) {
        case 'newest': return b.createdAt - a.createdAt;
        case 'oldest': return a.createdAt - b.createdAt;
        case 'az': return a.title.localeCompare(b.title);
        case 'za': return b.title.localeCompare(a.title);
        default: return 0;
      }
    });
  };

  const displayedAccounts = getFilteredAndSortedAccounts();

  const handleAddAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newPassword) return;
    const newAccount: Account = {
      id: Date.now().toString(),
      title: newTitle,
      username: newUsername,
      password: newPassword,
      category: newCategory,
      color: getRandomColor(),
      createdAt: Date.now(),
    };
    const updated = storageService.saveAccount(newAccount);
    setAccounts(updated);
    setNewTitle(''); setNewUsername(''); setNewPassword(''); setIsModalOpen(false);
  };

  const getRandomColor = () => {
    const colors = [
        'from-emerald-600 to-emerald-900', // Green
        'from-red-600 to-red-900',         // Red
        'from-blue-600 to-blue-900',       // Blue
        'from-zinc-900 to-black',          // Black
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const toggleReveal = (id: string) => {
    if(navigator.vibrate) navigator.vibrate(10);
    setRevealedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <div className="w-full h-full pb-60 px-4 pt-[max(1rem,env(safe-area-inset-top))] overflow-y-auto no-scrollbar font-sans overscroll-contain touch-pan-y" style={{ willChange: 'scroll-position' }}>
      
      {!isSecure && (
        <div className="mb-4 p-3 bg-red-900/50 border border-red-500/50 rounded-xl flex items-center gap-3 animate-pulse">
            <ShieldAlert className="w-6 h-6 text-red-500 flex-shrink-0" />
            <div className="text-xs text-red-200">
                <p className="font-bold">تحذير: الاتصال غير مشفر</p>
                <p className="opacity-80">بياناتك قد تكون في خطر على هذا الرابط.</p>
            </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6 mt-4">
        <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">الخزنة</h1>
            <p className="text-zinc-400 text-sm mt-1">{displayedAccounts.length} حسابات محفوظة</p>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setShowLinkModal(true)} className="w-12 h-12 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-400 active:scale-95 transition-transform"><Share className="w-5 h-5" /></button>
            <button onClick={() => setIsModalOpen(true)} className="w-12 h-12 rounded-full bg-primary border border-blue-400 flex items-center justify-center text-white shadow-lg active:scale-95 transition-transform"><Plus className="w-6 h-6" /></button>
        </div>
      </div>

      <div className="flex gap-2 mb-4">
        <div className="relative flex-1">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
            <input type="text" placeholder="بحث سريع..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl py-4 pr-12 pl-4 text-white placeholder-zinc-600 focus:border-primary/50 outline-none" />
        </div>
      </div>

      <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-1">
        {['all', 'banking', 'social', 'work', 'other'].map((cat) => (
            <button key={cat} onClick={() => setSelectedCategory(cat)} className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-all ${selectedCategory === cat ? 'bg-white text-black scale-105' : 'bg-zinc-800/50 text-zinc-400 border border-zinc-700/30'}`}>
                {cat === 'all' ? 'الكل' : cat === 'banking' ? 'بنكي' : cat === 'social' ? 'تواصل' : cat === 'work' ? 'عمل' : 'عام'}
            </button>
        ))}
      </div>

      <div className="space-y-4">
        {displayedAccounts.map((account) => (
            <div key={account.id} className="relative group animate-fade-in-up" style={{ willChange: 'transform, opacity' }}>
                <div className={`relative p-6 rounded-3xl bg-gradient-to-br ${account.color} border border-white/10 shadow-xl overflow-hidden active:scale-[0.98] transition-transform`}>
                    
                    <button onClick={(e) => { e.stopPropagation(); setAccountToDelete(account.id); }} className="absolute top-4 left-4 w-10 h-10 bg-black/20 hover:bg-red-500 rounded-full flex items-center justify-center text-white/70 transition-colors z-20"><Trash2 className="w-4 h-4" /></button>

                    <div className="flex justify-between items-start mb-6 pr-12"> 
                         <h3 className="text-3xl font-extrabold text-white drop-shadow-md truncate">{account.title}</h3>
                         <div className="p-2 bg-black/20 rounded-xl">{account.category === 'banking' ? <Wallet className="w-5 h-5"/> : account.category === 'social' ? <Globe className="w-5 h-5"/> : <Lock className="w-5 h-5"/>}</div>
                    </div>

                    <div className="mb-4 flex items-center justify-between bg-black/10 rounded-xl p-3 border border-white/5">
                        <p className="text-white/90 text-sm font-medium truncate dir-ltr text-right flex-1">{account.username}</p>
                        <button onClick={() => { navigator.clipboard.writeText(account.username); setCopiedUserAccount(account.id); setTimeout(() => setCopiedUserAccount(null), 1000); }} className="mr-3 text-white/50">{copiedUserAccount === account.id ? <Check className="w-4 h-4 text-green-400"/> : <Copy className="w-4 h-4"/>}</button>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="flex-1 bg-black/30 rounded-xl p-3 border border-white/5 flex items-center overflow-hidden">
                            <span className={`font-mono text-white text-lg tracking-widest truncate dir-ltr w-full transition-all ${revealedIds.has(account.id) ? 'blur-none' : 'blur-[6px]'}`}>{account.password}</span>
                        </div>
                        <button onClick={() => toggleReveal(account.id)} className="w-12 h-12 flex-shrink-0 bg-black/20 rounded-xl flex items-center justify-center border border-white/5">{revealedIds.has(account.id) ? <EyeOff className="w-5 h-5"/> : <Eye className="w-5 h-5"/>}</button>
                        <button onClick={() => { navigator.clipboard.writeText(account.password); setCopiedId(account.id); setTimeout(() => setCopiedId(null), 1000); }} className={`w-12 h-12 flex-shrink-0 rounded-xl flex items-center justify-center border transition-all ${copiedId === account.id ? 'bg-green-500 border-green-400' : 'bg-black/20 border-white/5'}`}>{copiedId === account.id ? <Check className="w-5 h-5"/> : <Copy className="w-5 h-5" />}</button>
                    </div>
                </div>
            </div>
        ))}
      </div>

      {/* Delete Modal */}
      {accountToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-zinc-900 border border-zinc-700 w-full max-w-xs rounded-3xl p-6 shadow-2xl animate-shake">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-center text-white mb-6">حذف الحساب؟</h3>
                <div className="flex gap-3">
                    <button onClick={() => setAccountToDelete(null)} className="flex-1 py-3 bg-zinc-800 rounded-xl text-white font-bold">إلغاء</button>
                    <button onClick={() => { setAccounts(storageService.deleteAccount(accountToDelete)); setAccountToDelete(null); }} className="flex-1 py-3 bg-red-600 rounded-xl text-white font-bold">حذف</button>
                </div>
            </div>
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
            <div className="bg-zinc-900 w-full sm:w-[400px] rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 border-t border-white/10 animate-fade-in-up">
                <div className="w-12 h-1.5 bg-zinc-800 rounded-full mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-center text-white mb-8">إضافة حساب جديد</h2>
                <form onSubmit={handleAddAccount} className="space-y-4">
                    <input required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none focus:border-primary" placeholder="اسم المنصة" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
                    <input className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white outline-none dir-ltr text-right" placeholder="المستخدم / الإيميل" value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
                    <input required className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-white font-mono text-center tracking-widest text-lg" placeholder="كلمة المرور" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    <div className="grid grid-cols-2 gap-2">
                        {['social', 'banking', 'work', 'other'].map(cat => (
                            <button key={cat} type="button" onClick={() => setNewCategory(cat as any)} className={`py-3 rounded-xl text-xs font-bold border transition-all ${newCategory === cat ? 'bg-primary border-primary' : 'bg-zinc-800 border-zinc-700 text-zinc-500'}`}>{cat === 'social' ? 'تواصل' : cat === 'banking' ? 'بنكي' : cat === 'work' ? 'عمل' : 'عام'}</button>
                        ))}
                    </div>
                    <button type="submit" className="w-full bg-primary py-4 rounded-2xl text-white font-bold text-lg shadow-lg active:scale-95 transition-transform mt-4">حفظ</button>
                    <button type="button" onClick={() => setIsModalOpen(false)} className="w-full py-3 text-zinc-500 font-bold">إلغاء</button>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default Vault;
