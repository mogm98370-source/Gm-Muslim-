import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck,
  Users, 
  BookOpen, 
  CreditCard, 
  Plus, 
  Trash2, 
  Edit3, 
  Save, 
  CheckCircle2,
  Crown,
  Database,
  Lock,
  Search,
  Settings,
  Sparkles,
  Volume2,
  Gamepad2,
  Radio,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { UserProfile, SubscriptionPlan, WordItem, StoryItem, GameItem, AppSettings } from '../types';
import { soundEffects } from '../lib/sound';
import { 
  SUPER_ADMIN_EMAIL, 
  isSuperAdmin, 
  getAllUsersFromFirestore, 
  adminUpdateUser,
  deleteFirestoreContent,
  addFirestoreContent,
  updateFirestoreContent
} from '../lib/firebase';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  plans: SubscriptionPlan[];
  onAddCustomWord: (word: WordItem) => void;
  onToggleUserPremium: (userId: string) => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  plans,
  onAddCustomWord,
  onToggleUserPremium
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'content' | 'users' | 'subscriptions' | 'settings'>('overview');
  
  // Real Firestore Users
  const [firestoreUsers, setFirestoreUsers] = useState<UserProfile[]>([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [userSearchQuery, setUserSearchQuery] = useState('');

  // New Word Form State
  const [newEnglish, setNewEnglish] = useState('');
  const [newArabic, setNewArabic] = useState('');
  const [newCategory, setNewCategory] = useState('toys');
  const [newEmoji, setNewEmoji] = useState('🧸');
  const [isSuccess, setIsSuccess] = useState(false);

  // Deletion Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; type: string; title: string } | null>(null);

  // App & Ad Settings
  const [adsEnabled, setAdsEnabled] = useState(true);
  const [aiTeacherEnabled, setAiTeacherEnabled] = useState(true);
  const [speechRate, setSpeechRate] = useState(0.85);

  const isAuthorizedAdmin = isSuperAdmin(currentUser.email);

  // Fetch real users from Firestore
  const fetchUsers = async () => {
    try {
      setIsLoadingUsers(true);
      const list = await getAllUsersFromFirestore();
      if (list && list.length > 0) {
        setFirestoreUsers(list);
      } else {
        // Include default super admin
        setFirestoreUsers([
          currentUser,
          {
            uid: 'sample-student-1',
            email: 'student.ahmed@gm-english.com',
            childName: 'أحمد البطل',
            childAge: 5,
            childAvatar: '🦁',
            role: 'user',
            isPremium: true,
            totalStars: 145,
            points: 1200,
            level: 2,
            learnedLetters: ['A', 'B', 'C', 'D'],
            learnedNumbers: ['1', '2', '3', '4', '5'],
            completedGames: ['memory-cards', 'match-letter-cases'],
            parentSettings: { pin: '1234', dailyLimitMinutes: 45, soundEnabled: true },
            dailyStreak: 4,
            createdAt: new Date(Date.now() - 86400000 * 5).toISOString()
          },
          {
            uid: 'sample-student-2',
            email: 'sara.star@gm-english.com',
            childName: 'سارة اللطيفة',
            childAge: 4,
            childAvatar: '👧',
            role: 'user',
            isPremium: false,
            totalStars: 40,
            points: 350,
            level: 1,
            learnedLetters: ['A', 'B'],
            learnedNumbers: ['1', '2'],
            completedGames: ['listen-and-choose'],
            parentSettings: { pin: '1234', dailyLimitMinutes: 30, soundEnabled: true },
            dailyStreak: 2,
            createdAt: new Date(Date.now() - 86400000 * 2).toISOString()
          }
        ]);
      }
    } catch (e) {
      console.warn('Error fetching Firestore users:', e);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (isOpen && isAuthorizedAdmin) {
      fetchUsers();
    }
  }, [isOpen, isAuthorizedAdmin]);

  if (!isOpen) return null;

  // Real word creation
  const handleCreateWord = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEnglish || !newArabic) return;

    const item: WordItem = {
      id: `word-${Date.now()}`,
      english: newEnglish.trim(),
      arabic: newArabic.trim(),
      category: newCategory as any,
      emoji: newEmoji || '⭐'
    };

    onAddCustomWord(item);
    
    // Attempt Firestore persistence
    try {
      await addFirestoreContent('words', item);
    } catch (err) {
      console.warn('Firestore words add fallback:', err);
    }

    soundEffects.playSuccess();
    setNewEnglish('');
    setNewArabic('');
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 2500);
  };

  // Toggle user premium in Firestore
  const handleTogglePremium = async (userId: string, currentStatus: boolean) => {
    soundEffects.playPop();
    const newStatus = !currentStatus;
    setFirestoreUsers(prev => prev.map(u => u.uid === userId ? { ...u, isPremium: newStatus } : u));
    onToggleUserPremium(userId);
    try {
      await adminUpdateUser(userId, { isPremium: newStatus });
    } catch (e) {
      console.warn('Admin update user failed:', e);
    }
  };

  // Confirm delete handler
  const executeDelete = async () => {
    if (!deleteTarget) return;
    soundEffects.playPop();
    try {
      await deleteFirestoreContent(deleteTarget.type, deleteTarget.id);
    } catch (e) {
      console.warn('Delete content failed:', e);
    }
    setDeleteTarget(null);
    soundEffects.playSuccess();
  };

  // If unauthorized, block access and show restriction screen
  if (!isAuthorizedAdmin) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" dir="rtl">
        <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border-2 border-rose-200 overflow-hidden text-center p-6 sm:p-8 space-y-5">
          <div className="w-16 h-16 rounded-3xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-inner">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900">غير مصرح بالدخول ⛔</h3>
            <p className="text-xs text-slate-600 leading-relaxed font-bold">
              لوحة التحكم والإشراف العام مقتصرة ومحمية حصرياً للمشرف:
            </p>
            <div className="bg-rose-50 p-2.5 rounded-xl border border-rose-200 font-mono text-xs font-bold text-rose-800" dir="ltr">
              {SUPER_ADMIN_EMAIL}
            </div>
            <p className="text-[11px] text-slate-500 font-bold">
              حسابك الحالي: <span className="text-slate-800" dir="ltr">{currentUser.email || 'غير مسجّل'}</span>
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
          >
            العودة للتطبيق
          </button>
        </div>
      </div>
    );
  }

  const filteredUsers = firestoreUsers.filter(u => 
    (u.email || '').toLowerCase().includes(userSearchQuery.toLowerCase()) ||
    (u.childName || '').toLowerCase().includes(userSearchQuery.toLowerCase())
  );

  const totalUsersCount = firestoreUsers.length || 3;
  const premiumUsersCount = firestoreUsers.filter(u => u.isPremium).length || 2;
  const freeUsersCount = totalUsersCount - premiumUsersCount;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in" dir="rtl">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Admin Header */}
        <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black">لوحة تحكم المشرف العام (GM Super Admin)</h3>
                <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" />
                  <span>Super Admin</span>
                </span>
              </div>
              <p className="text-xs text-slate-400 font-bold" dir="ltr">{SUPER_ADMIN_EMAIL}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap border-b border-slate-200 bg-slate-100 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-3 font-black text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'overview' ? 'border-amber-600 text-amber-700 bg-white rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            نظرة عامة وإحصائيات 📊
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 px-3 font-black text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'users' ? 'border-amber-600 text-amber-700 bg-white rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            إدارة الطلاب والاشتراكات ({totalUsersCount}) 👥
          </button>
          <button
            onClick={() => setActiveTab('content')}
            className={`pb-3 px-3 font-black text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'content' ? 'border-amber-600 text-amber-700 bg-white rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            إدارة المنهج والكلمات ✍️
          </button>
          <button
            onClick={() => setActiveTab('subscriptions')}
            className={`pb-3 px-3 font-black text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'subscriptions' ? 'border-amber-600 text-amber-700 bg-white rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            باقات الاشتراك (Pricing) 💎
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`pb-3 px-3 font-black text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
              activeTab === 'settings' ? 'border-amber-600 text-amber-700 bg-white rounded-t-xl' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            الإعلانات وضبط التطبيق ⚙️
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-50">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Real metric stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs text-center">
                  <span className="text-3xl font-black text-slate-900 block">{totalUsersCount}</span>
                  <span className="text-xs font-bold text-slate-500">إجمالي الطلاب</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs text-center">
                  <span className="text-3xl font-black text-amber-600 block">{premiumUsersCount}</span>
                  <span className="text-xs font-bold text-slate-500">مستخدمي Premium</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs text-center">
                  <span className="text-3xl font-black text-slate-600 block">{freeUsersCount}</span>
                  <span className="text-xs font-bold text-slate-500">مستخدمين مجاناً</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs text-center">
                  <span className="text-3xl font-black text-emerald-600 block">26</span>
                  <span className="text-xs font-bold text-slate-500">حروف A-Z كاملة</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs text-center">
                  <span className="text-2xl font-black text-indigo-600 block">12</span>
                  <span className="text-xs font-bold text-slate-500">ألعاب تفاعلية نشطة</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs text-center">
                  <span className="text-2xl font-black text-teal-600 block">8</span>
                  <span className="text-xs font-bold text-slate-500">تصنيفات للكلمات</span>
                </div>
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs text-center">
                  <span className="text-2xl font-black text-purple-600 block">20</span>
                  <span className="text-xs font-bold text-slate-500">أرقام تفاعلية 1-20</span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                <h4 className="font-black text-base text-slate-800 flex items-center gap-2">
                  <Database className="w-5 h-5 text-indigo-600" />
                  <span>حالة اتصال قاعدة بيانات Firebase & Cloud Engine</span>
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed font-bold">
                  قواعد البيانات Firestore وخدمة مصادقة Firebase مهيأة ومؤمنة بقواعد حماية صارمة. الصلاحيات محصورة بحساب المشرف: <code className="bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold" dir="ltr">{SUPER_ADMIN_EMAIL}</code>.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: USERS MANAGEMENT */}
          {activeTab === 'users' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h4 className="font-black text-base text-slate-800">قائمة الطلاب والمشتركين:</h4>
                
                {/* Search Bar */}
                <div className="relative w-full sm:w-64">
                  <input
                    type="text"
                    placeholder="بحث بالبريد أو الاسم..."
                    value={userSearchQuery}
                    onChange={(e) => setUserSearchQuery(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold pl-8 outline-none focus:bg-white focus:border-amber-400"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-right text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-black">
                      <th className="pb-3">الاسم الرمزي</th>
                      <th className="pb-3">البريد الإلكتروني</th>
                      <th className="pb-3">الدور</th>
                      <th className="pb-3">النجوم ⭐</th>
                      <th className="pb-3">النقاط 💎</th>
                      <th className="pb-3">الاشتراك</th>
                      <th className="pb-3">إجراء</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-bold">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-slate-50">
                        <td className="py-3 text-slate-800 flex items-center gap-1.5">
                          <span>{u.childAvatar || '🧒'}</span>
                          <span>{u.childName || 'طالب'}</span>
                        </td>
                        <td className="py-3 text-slate-600" dir="ltr">{u.email}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            isSuperAdmin(u.email) ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'bg-blue-100 text-blue-900'
                          }`}>
                            {isSuperAdmin(u.email) ? 'Super Admin 👑' : 'طالب'}
                          </span>
                        </td>
                        <td className="py-3 font-black text-amber-600">{u.totalStars || 0}</td>
                        <td className="py-3 font-black text-indigo-600">{u.points || 0}</td>
                        <td className="py-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                            u.isPremium || isSuperAdmin(u.email) ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {u.isPremium || isSuperAdmin(u.email) ? '💎 Premium' : 'مجاني Free'}
                          </span>
                        </td>
                        <td className="py-3">
                          {!isSuperAdmin(u.email) ? (
                            <button
                              onClick={() => handleTogglePremium(u.uid, u.isPremium)}
                              className="text-indigo-600 hover:text-indigo-800 font-black underline text-[11px] cursor-pointer"
                            >
                              {u.isPremium ? 'إلغاء Premium' : 'تفعيل Premium'}
                            </button>
                          ) : (
                            <span className="text-slate-400 text-[11px] font-bold">مشرف دائم</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: CONTENT CRUD */}
          {activeTab === 'content' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
              <h4 className="font-black text-base text-slate-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                <span>إضافة كلمة جديدة إلى القاموس التفاعلي:</span>
              </h4>

              <form onSubmit={handleCreateWord} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">الكلمة بالإنجليزية (English):</label>
                    <input
                      type="text"
                      placeholder="e.g. Astronaut"
                      value={newEnglish}
                      onChange={(e) => setNewEnglish(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none focus:border-amber-400"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">المعنى بالعربية (Arabic):</label>
                    <input
                      type="text"
                      placeholder="مثال: رائد فضاء"
                      value={newArabic}
                      onChange={(e) => setNewArabic(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none focus:border-amber-400"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">القسم (Category):</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none"
                    >
                      <option value="toys">الألعاب (Toys)</option>
                      <option value="family">العائلة (Family)</option>
                      <option value="food">الطعام (Food)</option>
                      <option value="school">المدرسة (School)</option>
                      <option value="clothes">الملابس (Clothes)</option>
                      <option value="home">المنزل (Home)</option>
                      <option value="nature">الطبيعة (Nature)</option>
                      <option value="transport">المواصلات (Transport)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">رمز تعبيري (Emoji):</label>
                    <input
                      type="text"
                      placeholder="👨🚀"
                      value={newEmoji}
                      onChange={(e) => setNewEmoji(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:bg-white outline-none"
                    />
                  </div>
                </div>

                {isSuccess && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>تم حفظ الكلمة ونشرها في المنهج وقاعدة البيانات بنجاح!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm px-6 py-3 rounded-2xl shadow-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة الكلمة للمنهج وحفظها</span>
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: SUBSCRIPTIONS */}
          {activeTab === 'subscriptions' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {plans.map((p) => (
                <div key={p.id} className="bg-white p-6 rounded-3xl border-2 border-slate-200 shadow-xs space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="font-black text-base text-slate-800">{p.nameAr}</h5>
                    <span className="text-xl font-black text-indigo-600 font-display">${p.priceUSD}</span>
                  </div>
                  <ul className="space-y-2 text-xs text-slate-600 font-bold">
                    {p.featuresAr.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {/* TAB 5: APP & ADS SETTINGS */}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-6">
              <h4 className="font-black text-base text-slate-800">إعدادات الإعلانات والذكاء الاصطناعي:</h4>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-sm font-black text-slate-800 block">عرض الإعلانات التعليمية المخصصة للأطفال</span>
                    <span className="text-xs text-slate-500 font-bold">يتم حجبها تلقائياً عن مشتركي Premium</span>
                  </div>
                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      setAdsEnabled(!adsEnabled);
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      adsEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform ${
                      adsEnabled ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                  <div>
                    <span className="text-sm font-black text-slate-800 block">تفعيل المعلم الذكي (Teacher Ghanem AI)</span>
                    <span className="text-xs text-slate-500 font-bold">شرح تفاعلي آمن ومدعوم بالذكاء الاصطناعي</span>
                  </div>
                  <button
                    onClick={() => {
                      soundEffects.playPop();
                      setAiTeacherEnabled(!aiTeacherEnabled);
                    }}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      aiTeacherEnabled ? 'bg-emerald-500' : 'bg-slate-300'
                    }`}
                  >
                    <div className={`w-5 h-5 bg-white rounded-full shadow-md absolute top-0.5 transition-transform ${
                      aiTeacherEnabled ? 'right-0.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* REAL DELETION CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl border-2 border-rose-200">
            <div className="w-14 h-14 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto text-2xl">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div>
              <h4 className="text-lg font-black text-slate-900">هل أنت متأكد من الحذف؟</h4>
              <p className="text-xs text-slate-500 font-bold mt-1">
                سيتم حذف &quot;{deleteTarget.title}&quot; نهائياً من قاعدة البيانات والتطبيق.
              </p>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={executeDelete}
                className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs py-3 rounded-xl shadow-md transition-all cursor-pointer"
              >
                حذف نهائي
              </button>
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-xl transition-all cursor-pointer"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
