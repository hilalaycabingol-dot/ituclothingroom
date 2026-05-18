/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LogOut, 
  Package, 
  User as UserIcon, 
  LayoutDashboard, 
  History, 
  CheckCircle, 
  XCircle, 
  PlusCircle, 
  Calendar, 
  Clock,
  Heart,
  ChevronRight,
  Filter,
  ShoppingBag,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useAppContext } from './context/AppContext';
import { User, ClothingItem, Reservation, UserRole } from './types';

// --- Shared Components ---

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  type = 'button',
  disabled = false,
  title = ''
}: { 
  children: React.ReactNode, 
  onClick?: () => void, 
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'itu',
  className?: string,
  type?: 'button' | 'submit' | 'reset',
  disabled?: boolean,
  title?: string
}) => {
  const base = "px-3 py-1.5 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-xs";
  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 shadow-sm",
    secondary: "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
    outline: "border border-slate-200 text-slate-700 hover:border-itu-blue hover:bg-slate-50",
    danger: "bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100",
    ghost: "text-slate-500 hover:bg-slate-100",
    itu: "bg-[#003865] text-white hover:bg-[#002d52] shadow-sm"
  };

  return (
    <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled} title={title}>
      {children}
    </button>
  );
};

const Card = ({ children, className = "", id }: { children: React.ReactNode, className?: string, id?: string }) => (
  <div id={id} className={`bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
    {children}
  </div>
);

const Input = ({ label, type = "text", value, onChange, placeholder, required = false }: any) => (
  <div className="space-y-1">
    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</label>
    <input 
      type={type} 
      value={value} 
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-itu-blue/20 focus:border-itu-blue text-sm transition-all"
    />
  </div>
);

const Badge = ({ status }: { status: string }) => {
  const styles: any = {
    AVAILABLE: "bg-emerald-50 text-emerald-700 border-emerald-100",
    RESERVED: "bg-amber-50 text-amber-700 border-amber-100",
    APPROVED: "bg-blue-50 text-blue-700 border-blue-100",
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    REJECTED: "bg-rose-50 text-rose-700 border-rose-100"
  };

  const labels: any = {
    AVAILABLE: "Mevcut",
    RESERVED: "Rezerve",
    APPROVED: "Onaylandı",
    PENDING: "Beklemede",
    REJECTED: "Reddedildi"
  };

  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

// --- Authenticated Layout ---

const Layout = ({ children, title }: { children: React.ReactNode, title: string }) => {
  const { user, setUser } = useAppContext();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-100 text-slate-900 flex flex-col overflow-hidden">
      <header className="h-14 bg-[#003865] text-white flex items-center justify-between px-6 shrink-0 border-b border-[#002d52]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center">
            <ShoppingBag className="text-itu-blue w-5 h-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold leading-tight uppercase tracking-tight">İTÜ İrem Vardar Giyim Odası</h1>
            <p className="text-[10px] text-blue-200 opacity-80 uppercase tracking-widest font-medium">Bilişim Sistemleri Paneli</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-3 border-l border-white/20 pl-6">
            <div className="text-right">
              <p className="text-xs font-semibold">{user?.email}</p>
              <p className="text-[10px] text-blue-200 uppercase font-bold tracking-tighter opacity-80">{user?.role} • {user?.name}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-blue-400/80 flex items-center justify-center font-bold text-xs ring-2 ring-white/10 shadow-inner">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
          <button 
            className="p-1.5 hover:bg-white/10 rounded transition-colors text-blue-100" 
            onClick={() => setUser(null)}
            title="Çıkış Yap"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden p-4 gap-4">
        {/* Fixed Left Sidebar for High Density look */}
        <aside className="w-64 flex flex-col gap-4 shrink-0 overflow-y-auto scrollbar-hide">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase mb-3 tracking-widest">Hızlı Erişim</h3>
            <div className="space-y-2">
              <button className="w-full bg-[#003865] text-white rounded-lg py-2 px-4 text-[10px] font-bold hover:bg-[#002d52] transition-all flex items-center gap-2">
                <LayoutDashboard className="w-3.5 h-3.5" /> Dashboard
              </button>
              <button className="w-full border border-slate-100 text-slate-600 rounded-lg py-2 px-4 text-[10px] font-bold hover:bg-slate-50 transition-all flex items-center gap-2">
                <Package className="w-3.5 h-3.5" /> Envanter
              </button>
            </div>
          </div>
          
          <div className="bg-white rounded-xl border border-slate-200 flex-1 flex flex-col overflow-hidden shadow-sm">
            <div className="p-4 border-b border-slate-100">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Aktif Durum</h3>
            </div>
            <div className="flex-1 p-3 flex flex-col gap-3">
              <div className="p-2.5 rounded-lg border border-orange-100 bg-orange-50/50">
                <p className="text-[10px] font-bold text-orange-800 italic uppercase">Sistem Mesajı</p>
                <p className="text-[10px] text-orange-600 mt-1 font-medium leading-relaxed">Yeni dönem dağıtım planı aktif edilmiştir. Lütfen rezervasyonları kontrol edin.</p>
              </div>
            </div>
          </div>
        </aside>

        <section className="flex-1 flex flex-col gap-4 overflow-hidden">
          <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between shrink-0 shadow-sm">
            <h2 className="text-sm font-black text-slate-700 tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 bg-itu-blue rounded-full animate-pulse"></span>
              {title}
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
              <span>{new Date().toLocaleDateString('tr-TR')}</span>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-1">
            {children}
          </div>
        </section>
      </main>

      <footer className="h-8 bg-slate-200 border-t border-slate-300 px-4 flex items-center justify-between text-[10px] text-slate-500 shrink-0 font-medium">
        <div>© 2026 İTÜ İrem Vardar Giyim Odası • Gelişmiş Enformasyon Platformu</div>
        <div className="flex gap-4">
          <span>Sistem Durumu: <b className="text-emerald-600">Aktif</b></span>
          <span>Sürüm: <b className="text-slate-600">v2.1.0-ITU</b></span>
        </div>
      </footer>
    </div>
  );
};

// --- Views ---

const LoginView = () => {
  const { signInUser, signUpUser } = useAppContext();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [isDonorMode, setIsDonorMode] = useState(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoggingIn(true);
    try {
      if (isSignUp) {
        if (!selectedRole) return;
        const result = await signUpUser(email, password, selectedRole);
        if (result.error) {
          setError(result.error);
        } else {
          // After successful signup, sign them in
          await signInUser(email, password);
        }
      } else {
        const result = await signInUser(email, password);
        if (!result) {
          setError('Geçersiz e-posta veya şifre.');
        }
      }
    } catch (err) {
      setError('Bağlantı hatası. Lütfen tekrar deneyin.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isDonorMode) {
    return <DonorView onBack={() => setIsDonorMode(false)} />;
  }

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#003865] p-6 relative overflow-hidden">
        {/* Institutional Background Decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 -rotate-12 translate-x-20 -translate-y-20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rotate-45 -translate-x-20 translate-y-20 rounded-full blur-3xl"></div>

        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm z-10">
          <Card className="p-8 shadow-2xl border-none ring-1 ring-white/10">
            <div className="text-center mb-10">
              <div className="bg-itu-blue w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-5 shadow-xl shadow-itu-blue/30">
                <ShoppingBag className="text-white w-7 h-7" />
              </div>
              <h1 className="text-xl font-black tracking-tighter text-slate-900 uppercase">İTÜ İrem Vardar</h1>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Giyim Odası Bilişim Platformu</p>
            </div>
            
            <div className="space-y-4">
              <Button variant="outline" className="w-full h-11 justify-between px-4" onClick={() => setSelectedRole('STUDENT')}>
                <span className="flex items-center gap-2"><UserIcon className="w-4 h-4 text-itu-blue" /> Öğrenci Girişi</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Button>
              <Button variant="outline" className="w-full h-11 justify-between px-4" onClick={() => setSelectedRole('COORDINATOR')}>
                <span className="flex items-center gap-2"><Package className="w-4 h-4 text-itu-blue" /> Koordinatör Paneli</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Button>
              <Button variant="outline" className="w-full h-11 justify-between px-4" onClick={() => setSelectedRole('ADMIN')}>
                <span className="flex items-center gap-2"><LayoutDashboard className="w-4 h-4 text-itu-blue" /> Yönetici Paneli</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-100">
              <p className="text-center text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Gönüllü İşlemleri</p>
              <Button variant="secondary" className="w-full h-11" onClick={() => setIsDonorMode(true)}>
                <Heart className="w-4 h-4 fill-white/20" />
                <span className="uppercase tracking-widest text-[10px] font-black">Bağış Girişi</span>
              </Button>
            </div>
          </Card>
          <p className="text-center mt-8 text-[10px] text-white/50 font-medium tracking-wide uppercase">
            İstanbul Teknik Üniversitesi
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#003865] p-6 relative overflow-hidden">
      {/* Institutional Background Decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 -rotate-12 translate-x-20 -translate-y-20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-400/10 rotate-45 -translate-x-20 translate-y-20 rounded-full blur-3xl"></div>

      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm z-10">
        <Card className="p-8 shadow-2xl border-none ring-1 ring-white/10">
          <button className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 hover:text-itu-blue transition-colors" onClick={() => { setSelectedRole(null); setError(''); setIsSignUp(false); }}>
            <ChevronRight className="w-4 h-4 rotate-180" /> Geri Dön
          </button>
          
          <div className="text-center mb-8">
            <h2 className="text-xl font-black tracking-tighter text-slate-900 uppercase">
              {selectedRole === 'STUDENT' ? 'Öğrenci' : selectedRole === 'COORDINATOR' ? 'Koordinatör' : 'Yönetici'}<br/>
              <span className="text-sm">{isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}</span>
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">İrem Vardar Giyim Odası</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {error && <p className="text-[10px] text-rose-600 bg-rose-50 p-2.5 rounded-lg border border-rose-100 font-bold uppercase tracking-tight">{error}</p>}
            <Input label="E-posta" type="email" value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="name@itu.edu.tr" required />
            <Input label="Şifre" type="password" value={password} onChange={(e: any) => setPassword(e.target.value)} placeholder="••••••••" required />
            <Button type="submit" variant="itu" className="w-full h-11 text-xs font-black uppercase tracking-widest mt-2" disabled={isLoggingIn}>
              {isLoggingIn ? (isSignUp ? 'Kaydediliyor...' : 'Bağlanıyor...') : (isSignUp ? 'Hesap Oluştur' : 'Sisteme Bağlan')}
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-slate-100 pt-6">
            <button type="button" className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-itu-blue transition-colors" onClick={() => { setIsSignUp(!isSignUp); setError(''); }}>
              {isSignUp ? 'Zaten hesabınız var mı? Giriş yapın' : 'Hesabınız yok mu? Kayıt olun'}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

const DonorView = ({ onBack }: { onBack: () => void }) => {
  const { addInventoryItem } = useAppContext();
  const [formData, setFormData] = useState({ category: 'T-Shirt', size: 'M', condition: 'Yeni' });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const categories: any = {
      'T-Shirt': 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop',
      'Pantolon': 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop',
      'Mont': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=600&auto=format&fit=crop',
      'Kazak': 'https://images.unsplash.com/photo-1614743272996-09e80d47eebe?q=80&w=600&auto=format&fit=crop'
    };

    await addInventoryItem({
      category: formData.category,
      size: formData.size,
      condition: formData.condition,
      imageUrl: categories[formData.category] || 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=600&auto=format&fit=crop'
    });
    setIsSubmitting(false);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-6">
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-sm">
        <Card className="p-6 shadow-xl border-t-2 border-t-emerald-600">
          <div className="flex items-center gap-2 mb-6 cursor-pointer text-slate-400 hover:text-slate-700 transition-colors" onClick={onBack}>
            <ChevronRight className="w-4 h-4 rotate-180" />
            <span className="font-bold text-[10px] uppercase tracking-widest">Giriş Ekranı</span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-lg font-black tracking-tighter text-slate-900 uppercase">Gönüllü Bağış</h2>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">İrem Vardar Giyim Odası</p>
          </div>

          {submitted ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-10">
              <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-100">
                <CheckCircle className="text-emerald-600 w-8 h-8" />
              </div>
              <h3 className="text-sm font-bold text-emerald-800 uppercase tracking-tight">Kayıt Başarılı</h3>
              <p className="text-[10px] text-slate-500 mt-2 font-bold uppercase tracking-widest">Teşekkürler, iyilik bulaşır.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Kategori</label>
                <select 
                  value={formData.category} 
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold appearance-none cursor-pointer"
                >
                  <option>T-Shirt</option>
                  <option>Pantolon</option>
                  <option>Mont</option>
                  <option>Kazak</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Beden</label>
                  <select 
                    value={formData.size} 
                    onChange={(e) => setFormData({...formData, size: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold"
                  >
                    <option>XS</option>
                    <option>S</option>
                    <option>M</option>
                    <option>L</option>
                    <option>XL</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Durum</label>
                  <select 
                    value={formData.condition} 
                    onChange={(e) => setFormData({...formData, condition: e.target.value})}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold"
                  >
                    <option>Yeni</option>
                    <option>Yeni Gibi</option>
                    <option>İyi</option>
                  </select>
                </div>
              </div>

              <Button type="submit" variant="secondary" className="w-full h-11 text-[11px] font-black uppercase tracking-widest mt-4" disabled={isSubmitting}>
                {isSubmitting ? 'Kaydediliyor...' : 'Envantere Kaydet'}
              </Button>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
};

const StudentView = () => {
  const { user, inventory, reservations, reserveItem } = useAppContext();
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [pickupDate, setPickupDate] = useState('');
  const [pickupTime, setPickupTime] = useState('');

  const activeReservations = useMemo(() => 
    reservations.filter(r => r.studentEmail === user?.email),
    [reservations, user]
  );

  const availableItems = useMemo(() => 
    inventory.filter(item => item.status === 'AVAILABLE'),
    [inventory]
  );

  const handleReserve = async () => {
    if (selectedItem && pickupDate && pickupTime) {
      if (activeReservations.length >= 3) {
        alert("En fazla 3 aktif rezervasyon yapabilirsiniz.");
        return;
      }
      await reserveItem(selectedItem.id, user!.email, pickupDate, pickupTime);
      setSelectedItem(null);
      setPickupDate('');
      setPickupTime('');
    }
  };

  return (
    <div className="grid lg:grid-cols-[1fr-300px] gap-4">
      <div className="space-y-4">
        <Card className="p-3 bg-white flex items-center justify-between shrink-0 shadow-sm">
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Katalog Filtrele</span>
          </div>
          <div className="flex gap-1.5">
            {['Tümü', 'T-Shirt', 'Pantolon', 'Mont'].map(c => (
              <button key={c} className={`text-[9px] font-black uppercase tracking-tighter px-3 py-1 rounded ${c === 'Tümü' ? 'bg-[#003865] text-white shadow-sm' : 'bg-slate-50 text-slate-500 border border-slate-100 hover:bg-slate-100 transition-colors'}`}>
                {c}
              </button>
            ))}
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {availableItems.length === 0 && (
            <div className="col-span-full border-2 border-dashed border-slate-200 rounded-xl p-10 text-center text-slate-300">
              <Package className="w-10 h-10 mx-auto mb-3 opacity-20" />
              <p className="font-black text-xs uppercase tracking-widest">Envanter Boş</p>
              <p className="text-[10px] uppercase font-bold mt-1">Yeni bağışlar bekleniyor...</p>
            </div>
          )}
          {availableItems.map(item => (
            <motion.div key={item.id} layoutId={item.id}>
              <Card className="group hover:border-itu-blue transition-all duration-300">
                <div className="relative h-48 overflow-hidden bg-slate-50">
                  <img src={item.imageUrl} alt={item.category} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute top-2 left-2">
                    <Badge status={item.status} />
                  </div>
                </div>
                <div className="p-3.5 pt-3">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="font-black text-sm text-slate-800 tracking-tight uppercase leading-none">{item.category}</h3>
                    <span className="bg-slate-900 text-white text-[8px] font-black px-1.5 py-0.5 rounded italic">SIZE: {item.size}</span>
                  </div>
                  <p className="text-slate-400 text-[10px] font-bold mb-3 uppercase tracking-tighter italic">{item.condition}</p>
                  <Button variant="itu" className="w-full text-[10px] h-8 font-black uppercase tracking-widest" onClick={() => setSelectedItem(item)}>
                    İNCELE & AYIR
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      <aside className="space-y-4 w-[300px]">
        <Card className="bg-[#003865] border-none p-5 text-white shadow-xl shadow-itu-blue/20">
          <div className="flex items-center gap-2 mb-6">
            <ShoppingBag className="w-5 h-5 text-blue-300" />
            <h3 className="text-xs font-black tracking-widest uppercase text-white shadow-sm">Kişisel Sepetim</h3>
          </div>
          
          <div className="space-y-3">
            {activeReservations.length === 0 ? (
              <div className="py-6 text-center border-2 border-dashed border-white/5 rounded-xl">
                 <p className="text-[10px] font-black text-blue-200/40 uppercase tracking-widest">Rezervasyonunuz Yok</p>
              </div>
            ) : (
              activeReservations.map(res => {
                const item = inventory.find(i => i.id === res.itemId);
                return (
                  <div key={res.id} className="bg-white/5 rounded-xl p-3 border border-white/5 flex gap-3 items-center group hover:bg-white/10 transition-colors">
                    <img src={item?.imageUrl} className="w-10 h-10 rounded-lg object-cover ring-1 ring-white/10" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-[10px] truncate uppercase text-white tracking-tight">{item?.category}</p>
                      <div className="flex gap-2 items-center mt-1">
                         <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shadow-sm ${res.status === 'PENDING' ? 'bg-amber-400 text-amber-900' : 'bg-emerald-400 text-emerald-900'}`}>
                           {res.status === 'PENDING' ? 'BEKLEMEDE' : 'ONAYLI'}
                         </span>
                         <span className="text-[8px] font-bold text-blue-200 uppercase opacity-60">{res.pickupDate}</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          
          <div className="mt-6 pt-5 border-t border-white/10">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-blue-200/60 mb-2">
              <span>Limit Kontrolü</span>
              <span>{activeReservations.length} / 3</span>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden border border-white/5">
              <div 
                className="bg-blue-400 h-full transition-all duration-700 ease-out" 
                style={{ width: `${(activeReservations.length / 3) * 100}%` }} 
              />
            </div>
          </div>
        </Card>
        
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5 rotate-12">
             <Package className="w-16 h-16 text-slate-900" />
          </div>
          <p className="text-[9px] font-black uppercase text-itu-blue tracking-widest mb-1 shadow-sm">Bilgilendirme</p>
          <p className="text-[10px] text-slate-500 leading-tight font-bold italic uppercase tracking-tighter">
            Teslimat sırasında İTÜ öğrenci kartı ibrazı zorunludur.
          </p>
        </div>
      </aside>

      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-[2px]">
            <motion.div 
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              className="w-full max-w-lg bg-white rounded-2xl overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="flex flex-col">
                <div className="relative h-48">
                  <img src={selectedItem.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-4 left-4 text-white">
                     <h3 className="text-xl font-black uppercase tracking-tighter leading-none">{selectedItem.category}</h3>
                     <p className="text-[10px] font-bold text-blue-200 uppercase tracking-widest mt-1 italic">STOK KODU: #{selectedItem.id.toUpperCase()}</p>
                  </div>
                  <button className="absolute top-4 right-4 p-1.5 bg-black/20 hover:bg-black/40 transition-colors rounded-full text-white" onClick={() => setSelectedItem(null)}>
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Beden Segmenti</span>
                      <p className="font-black text-sm text-slate-800">{selectedItem.size}</p>
                    </div>
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Kalite Durumu</span>
                      <p className="font-black text-sm text-slate-800 uppercase tracking-tighter italic">{selectedItem.condition}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Input 
                      label="Tercih Edilen Teslim Tarihi" 
                      type="date" 
                      value={pickupDate} 
                      onChange={(e: any) => setPickupDate(e.target.value)} 
                      required 
                    />
                    <div className="space-y-1.5">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Saat Aralığı</label>
                       <div className="grid grid-cols-2 gap-2">
                         {['09:00 - 12:00', '13:00 - 16:00'].map(slot => (
                           <button 
                             key={slot}
                             onClick={() => setPickupTime(slot)}
                             className={`py-2 rounded-lg border-2 text-[10px] font-black transition-all ${pickupTime === slot ? 'border-itu-blue bg-blue-50 text-itu-blue' : 'border-slate-100 text-slate-400 hover:border-slate-200'}`}
                           >
                             {slot}
                           </button>
                         ))}
                       </div>
                    </div>
                  </div>

                  <div className="mt-8 flex gap-2">
                    <Button variant="ghost" className="flex-1 font-bold uppercase tracking-widest" onClick={() => setSelectedItem(null)}>İPTAL</Button>
                    <Button 
                      variant="itu"
                      className="flex-[2] h-11 font-black uppercase tracking-widest shadow-xl shadow-itu-blue/20" 
                      onClick={handleReserve}
                      disabled={!pickupDate || !pickupTime}
                    >
                      REZERVASYON YAP
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CoordinatorView = () => {
  const { reservations, inventory, updateReservationStatus, confirmPickup } = useAppContext();
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED'>('PENDING');

  const displayedReservations = useMemo(() => 
    reservations.filter(r => r.status === activeTab),
    [reservations, activeTab]
  );

  return (
    <div className="space-y-4">
      {/* High Density KPI Grid */}
      <div className="grid grid-cols-4 gap-4 shrink-0">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Bekleyen Onay</p>
          <p className="text-2xl font-bold text-orange-500 mt-1">{reservations.filter(r => r.status === 'PENDING').length}</p>
          <p className="text-[10px] text-slate-500 font-medium mt-1 italic">Bugün işlenmesi gereken</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Katalog Doluluğu</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{inventory.filter(i => i.status === 'AVAILABLE').length}</p>
          <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-tighter">Aktif Stok</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tamamlanan</p>
          <p className="text-2xl font-bold text-itu-blue mt-1">{reservations.filter(r => r.status === 'APPROVED').length}</p>
          <p className="text-[10px] text-slate-500 font-medium mt-1 italic">Bu eğitim dönemi</p>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Toplam Rezervasyon</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{reservations.length}</p>
          <p className="text-[10px] text-slate-400 font-medium mt-1">Tüm kayıtlar</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 flex flex-col overflow-hidden shadow-sm">
        <div className="h-12 border-b border-slate-100 flex items-center justify-between px-4 bg-slate-50/50">
          <div className="flex gap-6">
            <button 
              className={`text-[10px] font-black h-12 px-2 uppercase tracking-widest transition-colors ${activeTab === 'PENDING' ? 'text-itu-blue border-b-2 border-itu-blue' : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => setActiveTab('PENDING')}
            >
              Gelen Rezervasyon İstekleri ({reservations.filter(r => r.status === 'PENDING').length})
            </button>
            <button 
              className={`text-[10px] font-black h-12 px-2 uppercase tracking-widest transition-colors ${activeTab === 'APPROVED' ? 'text-itu-blue border-b-2 border-itu-blue' : 'text-slate-400 hover:text-slate-600'}`}
              onClick={() => setActiveTab('APPROVED')}
            >
              Onaylı - Teslim Bekleyenler ({reservations.filter(r => r.status === 'APPROVED').length})
            </button>
          </div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Öğrenci No / Ürün Ara..." 
              className="text-[10px] font-medium border border-slate-200 rounded px-3 py-1.5 w-48 bg-white focus:outline-none focus:ring-1 focus:ring-itu-blue/30"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50/50 border-b border-slate-100 font-black text-[9px] text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="px-6 py-4">Öğrenci Kimlik Detayı</th>
                <th className="px-6 py-4">Ürün Bilgisi</th>
                <th className="px-6 py-4">Teslimat Randevusu</th>
                <th className="px-6 py-4 text-right">Yönetsel İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {displayedReservations.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-20 text-center font-bold text-slate-300 italic text-xs uppercase tracking-widest">
                    Bu kategoride kayıt bulunmamaktadır.
                  </td>
                </tr>
              ) : (
                displayedReservations.map(res => {
                  const item = inventory.find(i => i.id === res.item?.id || i.id === res.itemId);
                  return (
                    <tr key={res.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-slate-900 flex items-center justify-center text-white font-black text-[10px]">
                            {res.studentEmail.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-xs font-black text-slate-800">{res.studentEmail}</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">Doğrulanmış Öğrenci</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img src={item?.imageUrl} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                          <div>
                            <p className="text-xs font-black text-slate-800 uppercase tracking-tight">{item?.category}</p>
                            <p className="text-[9px] font-bold text-slate-500">Beden: {item?.size} • Durum: {item?.condition}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-700">{res.pickupDate}</p>
                          <span className="text-[9px] font-black text-itu-blue bg-blue-50 px-2 py-0.5 rounded border border-blue-100 uppercase tracking-tighter">{res.pickupTimeSlot}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          {activeTab === 'PENDING' ? (
                            <>
                              <Button variant="danger" className="h-8 px-3 font-black uppercase tracking-widest text-[9px]" onClick={() => updateReservationStatus(res.id, 'REJECTED')} title="Reddet">
                                REDDET
                              </Button>
                              <Button variant="secondary" className="h-8 px-4 font-black uppercase tracking-widest text-[9px]" onClick={() => updateReservationStatus(res.id, 'APPROVED')}>
                                ONAYLA
                              </Button>
                            </>
                          ) : (
                            <Button variant="itu" className="h-8 px-4 font-black uppercase tracking-widest text-[9px]" onClick={() => confirmPickup(res.id)}>
                              TESLİM EDİLDİ
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { inventory, reservations } = useAppContext();

  const stats = [
    { label: 'Envanter Kapasitesi', value: inventory.filter(i => i.status === 'AVAILABLE').length, detail: 'Müsait Ürün' },
    { label: 'Aktif Rezervasyonlar', value: reservations.filter(r => r.status === 'PENDING').length, detail: 'Onay Bekleyen' },
    { label: 'Vaka Çözümü', value: reservations.filter(r => r.status === 'APPROVED').length, detail: 'Tamamlanan' },
    { label: 'Toplam Envanter', value: inventory.length, detail: 'Kayıtlı Ürün' }
  ];

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-4 shrink-0">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}>
            <Card className="p-5 border-none shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-10 transition-opacity text-itu-blue">
                <LayoutDashboard className="w-12 h-12" />
              </div>
              <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1 leading-none">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-slate-900 tracking-tighter">{stat.value}</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">{stat.detail}</span>
              </div>
              <div className="mt-3 h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                 <div className="h-full bg-itu-blue w-1/3 rounded-full"></div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-4">
         <Card className="p-0 flex flex-col border-slate-200 shadow-sm min-h-[400px]">
            <div className="h-10 border-b border-slate-100 flex items-center px-6 bg-slate-50/50">
               <h4 className="text-[9px] font-black tracking-widest uppercase text-slate-500">Sistem İşlem Günlüğü (v2.1.0)</h4>
            </div>
            <div className="p-6 space-y-6">
              {[
                { time: '10:24', msg: 'Envanter Güncelleme: Pantolon (M) Raf #IX2', meta: 'DONOR: Public' },
                { time: '09:45', msg: 'Talep Onaylandı: Rezervasyon #RTX442 Onaylandı', meta: 'COORD: Admin_User' },
                { time: '08:12', msg: 'Öğrenci Girişi: Hilal Ayça B. • Oturum Açıldı', meta: 'SYSTEM: Auth_Log' },
                { time: '07:30', msg: 'Güvenlik Taraması: Senkronizasyon Tamamlandı', meta: 'SYSTEM: Cloud_Sync' }
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="text-[10px] font-mono font-black text-slate-300 pt-0.5">{log.time}</div>
                  <div className="space-y-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-itu-blue transition-colors">{log.msg}</p>
                    <p className="text-[9px] font-black uppercase tracking-widest text-itu-blue opacity-70">{log.meta}</p>
                  </div>
                </div>
              ))}
            </div>
         </Card>

         <aside className="space-y-4">
            <Card className="p-5 bg-itu-blue border-none text-white shadow-xl shadow-itu-blue/20">
               <h4 className="text-[10px] font-black tracking-widest uppercase text-blue-200 mb-4 flex items-center gap-2">
                 <History className="w-3 h-3" /> Kritik Stok Takibi
               </h4>
               <div className="p-3 bg-white/5 rounded-lg border border-white/10 space-y-2">
                  <p className="text-[11px] font-bold">Kışlık ürün stokları %15 azaldı.</p>
                  <p className="text-[9px] text-blue-200 opacity-60 font-medium italic">Bağışçı kampanyası planlanıyor.</p>
               </div>
            </Card>
            
            <div className="p-5 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center">
               <div className="bg-slate-50 p-3 rounded-xl mb-3 shadow-inner">
                 <ShoppingBag className="w-6 h-6 text-slate-300" />
               </div>
               <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Analitik Servis</p>
               <p className="text-[9px] text-slate-400 mt-2 font-medium italic">Gelişmiş raporlama modülü yakında aktif edilecektir.</p>
            </div>
         </aside>
      </div>
    </div>
  );
};

// --- Main App Entry ---

function AppContent() {
  const { user } = useAppContext();

  if (!user) return <LoginView />;

  const getDashboard = () => {
    switch (user.role) {
      case 'STUDENT': return <StudentView />;
      case 'COORDINATOR': return <CoordinatorView />;
      case 'ADMIN': return <AdminDashboard />;
      default: return <div>Unauthorized</div>;
    }
  };

  const titles: any = {
    STUDENT: "Katalog",
    COORDINATOR: "Koordinatör Paneli",
    ADMIN: "Yönetici Özeti"
  };

  return (
    <Layout title={titles[user.role]}>
      <motion.div 
        key={user.role} 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
      >
        {getDashboard()}
      </motion.div>
    </Layout>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
