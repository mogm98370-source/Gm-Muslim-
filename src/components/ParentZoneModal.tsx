import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  Clock, 
  BarChart3, 
  User, 
  Award, 
  Star, 
  Volume2, 
  CheckCircle2, 
  Save, 
  Sliders 
} from 'lucide-react';
import { UserProfile, ProgressStats } from '../types';
import { soundEffects } from '../lib/sound';

interface ParentZoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  stats: ProgressStats;
  onUpdateSettings: (settings: { dailyLimitMinutes: number; soundEnabled: boolean; childName: string; childAge: number }) => void;
}

export const ParentZoneModal: React.FC<ParentZoneModalProps> = ({
  isOpen,
  onClose,
  user,
  stats,
  onUpdateSettings
}) => {
  const [activeTab, setActiveTab] = useState<'progress' | 'controls' | 'profile'>('progress');
  const [dailyLimitMinutes, setDailyLimitMinutes] = useState(user.parentSettings.dailyLimitMinutes || 30);
  const [soundEnabled, setSoundEnabled] = useState(user.parentSettings.soundEnabled ?? true);
  const [childName, setChildName] = useState(user.childName);
  const [childAge, setChildAge] = useState(user.childAge);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    soundEffects.playSuccess();
    onUpdateSettings({
      dailyLimitMinutes,
      soundEnabled,
      childName,
      childAge
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-black">منطقة أولياء الأمور (Parent Zone)</h3>
              <p className="text-xs text-blue-100 font-medium">متابعة إنجاز الطفل وضبط وقت التعلم والأمان</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-100 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('progress')}
            className={`pb-3 px-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'progress'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>تقرير التقدم والإنجاز</span>
          </button>

          <button
            onClick={() => setActiveTab('controls')}
            className={`pb-3 px-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'controls'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>وقت الشاشة والتحكم</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-3 font-bold text-xs sm:text-sm border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <User className="w-4 h-4" />
            <span>بيانات الطفل</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'progress' && (
            <div className="space-y-6">
              {/* Overall stats cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 text-center">
                  <span className="text-2xl font-black text-amber-700 block">{user.totalStars}</span>
                  <span className="text-xs font-bold text-slate-600">النجوم المكتسبة ⭐</span>
                </div>
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-center">
                  <span className="text-2xl font-black text-emerald-700 block">{user.learnedLetters.length} / 26</span>
                  <span className="text-xs font-bold text-slate-600">حروف متقنة 🔤</span>
                </div>
                <div className="bg-indigo-50 p-4 rounded-2xl border border-indigo-200 text-center">
                  <span className="text-2xl font-black text-indigo-700 block">{user.learnedNumbers.length} / 20</span>
                  <span className="text-xs font-bold text-slate-600">أرقام متقنة 🔢</span>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200 text-center">
                  <span className="text-2xl font-black text-purple-700 block">{user.dailyStreak}</span>
                  <span className="text-xs font-bold text-slate-600">أيام متتالية 🔥</span>
                </div>
              </div>

              {/* Progress Summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-sm text-slate-800">مستوى إتقان الحروف الأبجدية:</h4>
                <div className="flex flex-wrap gap-1.5">
                  {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(char => {
                    const isDone = user.learnedLetters.includes(char);
                    return (
                      <span
                        key={char}
                        className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center font-display ${
                          isDone ? 'bg-emerald-500 text-white shadow-xs' : 'bg-white text-slate-300 border border-slate-200'
                        }`}
                      >
                        {char}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 flex items-center justify-between">
                  <span>الحد اليومي للاستخدام:</span>
                  <span className="text-blue-600 font-black">{dailyLimitMinutes} دقيقة يومياً</span>
                </label>
                <input
                  type="range"
                  min={10}
                  max={120}
                  step={5}
                  value={dailyLimitMinutes}
                  onChange={(e) => setDailyLimitMinutes(Number(e.target.value))}
                  className="w-full accent-blue-600"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-bold">
                  <span>10 دقائق</span>
                  <span>30 دقيقة (موصى به)</span>
                  <span>120 دقيقة</span>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <h4 className="font-bold text-sm text-slate-800">المؤثرات الصوتية والتشجيع</h4>
                  <p className="text-xs text-slate-500">أصوات النجوم والألعاب والأناشيد</p>
                </div>
                <input
                  type="checkbox"
                  checked={soundEnabled}
                  onChange={(e) => setSoundEnabled(e.target.checked)}
                  className="w-5 h-5 accent-blue-600 rounded"
                />
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">اسم الطفل:</label>
                <input
                  type="text"
                  value={childName}
                  onChange={(e) => setChildName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">عمر الطفل (سنوات):</label>
                <select
                  value={childAge}
                  onChange={(e) => setChildAge(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:bg-white"
                >
                  <option value={3}>3 سنوات (حضانة صغرى)</option>
                  <option value={4}>4 سنوات (روضة أولى KG1)</option>
                  <option value={5}>5 سنوات (روضة ثانية KG2)</option>
                  <option value={6}>6 سنوات (تمهيدي)</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          {savedSuccess ? (
            <span className="text-emerald-600 text-xs font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              <span>تم حفظ الإعدادات بنجاح!</span>
            </span>
          ) : <span />}

          <button
            onClick={handleSave}
            className="bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm px-6 py-2.5 rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>حفظ الإعدادات</span>
          </button>
        </div>
      </div>
    </div>
  );
};
