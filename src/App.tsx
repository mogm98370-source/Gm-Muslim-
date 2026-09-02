import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HomeDashboard } from './components/HomeDashboard';
import { LettersSection } from './components/LettersSection';
import { NumbersSection } from './components/NumbersSection';
import { ColorsSection } from './components/ColorsSection';
import { AnimalsSection } from './components/AnimalsSection';
import { FruitsSection } from './components/FruitsSection';
import { ShapesSection } from './components/ShapesSection';
import { BodyPartsSection } from './components/BodyPartsSection';
import { WordsDictionarySection } from './components/WordsDictionarySection';
import { SimpleSentencesSection } from './components/SimpleSentencesSection';
import { WriteAndSpeak } from './components/WriteAndSpeak';
import { RepeatAfterMe } from './components/RepeatAfterMe';
import { LetterTracing } from './components/LetterTracing';
import { WordBuilder } from './components/WordBuilder';
import { GamesSection } from './components/GamesSection';
import { StoriesSection } from './components/StoriesSection';
import { SongsSection } from './components/SongsSection';
import { AiTeacherSection } from './components/AiTeacherSection';
import { AuthScreen } from './components/AuthScreen';
import { ParentGateModal } from './components/ParentGateModal';
import { ParentZoneModal } from './components/ParentZoneModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { PremiumModal } from './components/PremiumModal';
import { ProfileModal } from './components/ProfileModal';

import { 
  initialLetters, 
  initialNumbers, 
  initialColors, 
  initialAnimals, 
  initialFruits, 
  initialShapes, 
  initialBodyParts, 
  initialWords, 
  initialSentences, 
  initialGames, 
  initialStories, 
  initialSongs, 
  subscriptionPlans,
  defaultDailyChallenges 
} from './data/initialContent';
import { UserProfile, ProgressStats, DailyChallenge, WordItem } from './types';
import { soundEffects } from './lib/sound';
import { 
  auth, 
  SUPER_ADMIN_EMAIL, 
  isSuperAdmin, 
  signOutUser, 
  getUserProfile, 
  saveUserProfile 
} from './lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';

const LOCAL_STORAGE_KEY = 'gm_english_user_v2';

const createDefaultGuestUser = (): UserProfile => ({
  uid: 'guest-' + Math.random().toString(36).substring(2, 9),
  email: '',
  role: 'user',
  childName: 'البطل الصغير',
  childAge: 5,
  childAvatar: '🧒',
  isPremium: false,
  totalStars: 15,
  points: 150,
  level: 1,
  dailyStreak: 1,
  learnedLetters: ['A', 'B'],
  learnedNumbers: ['1', '2'],
  completedGames: [],
  parentSettings: {
    pin: '1234',
    dailyLimitMinutes: 30,
    soundEnabled: true
  },
  createdAt: new Date().toISOString()
});

export default function App() {
  // Application State
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return createDefaultGuestUser();
      }
    }
    return createDefaultGuestUser();
  });

  const [isAuthLoading, setIsAuthLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentView, setCurrentView] = useState<string>('home');
  const [tracingLetter, setTracingLetter] = useState<string>('A');
  const [repeatWord, setRepeatWord] = useState<string>('Apple');

  // Dynamic Content state (expandable by Admin)
  const [wordsList, setWordsList] = useState<WordItem[]>(initialWords);
  const [dailyChallenges, setDailyChallenges] = useState<DailyChallenge[]>(defaultDailyChallenges);

  // Modals state - Show login screen immediately on first launch if not logged in with email
  const [isAuthScreenOpen, setIsAuthScreenOpen] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return !parsed?.email;
      }
    } catch {}
    return true;
  });
  const [isParentGateOpen, setIsParentGateOpen] = useState(false);
  const [parentGateTarget, setParentGateTarget] = useState<'parent' | 'admin' | 'logout' | null>(null);
  const [isParentZoneOpen, setIsParentZoneOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Check if current user is Super Admin
  const isSuperAdminUser = isSuperAdmin(user.email);

  // Listen to Firebase Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const email = fbUser.email || '';
        const userIsAdmin = isSuperAdmin(email);

        // Try to fetch existing Firestore profile
        const existingProfile = await getUserProfile(fbUser.uid);
        if (existingProfile) {
          const syncedProfile: UserProfile = {
            ...existingProfile,
            email: email,
            role: userIsAdmin ? 'super_admin' : (existingProfile.role === 'admin' ? 'user' : existingProfile.role),
            isPremium: userIsAdmin ? true : existingProfile.isPremium
          };
          setUser(syncedProfile);
          setIsAuthScreenOpen(false);
        } else {
          // Initialize new profile for Email authenticated user
          const newProfile: UserProfile = {
            uid: fbUser.uid,
            email: email,
            role: userIsAdmin ? 'super_admin' : 'user',
            childName: fbUser.displayName || (userIsAdmin ? 'المشرف العام' : 'البطل الجديد'),
            childAge: 5,
            childAvatar: userIsAdmin ? '👑' : '🧒',
            isPremium: userIsAdmin ? true : false,
            totalStars: userIsAdmin ? 999 : 25,
            points: userIsAdmin ? 9999 : 250,
            level: 1,
            dailyStreak: 1,
            learnedLetters: ['A', 'B'],
            learnedNumbers: ['1', '2'],
            completedGames: [],
            parentSettings: {
              pin: '1234',
              dailyLimitMinutes: 45,
              soundEnabled: true
            },
            createdAt: new Date().toISOString()
          };
          setUser(newProfile);
          setIsAuthScreenOpen(false);
          await saveUserProfile(newProfile);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Save user changes to localStorage and Firestore
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(user));
    if (user.uid && !user.uid.startsWith('guest-')) {
      saveUserProfile(user).catch((e) => console.warn('Firestore user sync failed:', e));
    }
  }, [user]);

  // Sign-Out handler (Real Firebase Auth)
  const handleSignOut = async () => {
    try {
      setIsAuthLoading(true);
      await signOutUser();
      const guest = createDefaultGuestUser();
      setUser(guest);
      soundEffects.playPop();
      setIsAuthScreenOpen(true);
    } catch (err: any) {
      console.error('Sign-Out failed:', err);
    } finally {
      setIsAuthLoading(false);
    }
  };

  const handleToggleSound = () => {
    soundEffects.playPop();
    setIsMuted(prev => !prev);
  };

  // Award stars and update progress
  const handleRewardStars = (starsToAdd: number) => {
    setUser(prev => ({
      ...prev,
      totalStars: (prev.totalStars || 0) + starsToAdd,
      points: (prev.points || 0) + (starsToAdd * 10)
    }));

    // Update Daily challenges progress
    setDailyChallenges(prev => prev.map(ch => {
      const updatedCount = ch.currentCount + 1;
      return {
        ...ch,
        currentCount: updatedCount,
        completed: updatedCount >= ch.targetCount
      };
    }));
  };

  const handleLetterLearned = (letter: string) => {
    setUser(prev => {
      if (!prev.learnedLetters.includes(letter)) {
        return {
          ...prev,
          learnedLetters: [...prev.learnedLetters, letter],
          totalStars: (prev.totalStars || 0) + 5,
          points: (prev.points || 0) + 50
        };
      }
      return {
        ...prev,
        totalStars: (prev.totalStars || 0) + 2,
        points: (prev.points || 0) + 20
      };
    });
  };

  const handleNumberLearned = (num: number) => {
    const numStr = num.toString();
    setUser(prev => {
      if (!prev.learnedNumbers.includes(numStr)) {
        return {
          ...prev,
          learnedNumbers: [...prev.learnedNumbers, numStr],
          totalStars: (prev.totalStars || 0) + 5,
          points: (prev.points || 0) + 50
        };
      }
      return {
        ...prev,
        totalStars: (prev.totalStars || 0) + 2,
        points: (prev.points || 0) + 20
      };
    });
  };

  // Parent Gate Verification
  const handleOpenParentGate = (target: 'parent' | 'admin' | 'logout') => {
    soundEffects.playPop();
    setParentGateTarget(target);
    setIsParentGateOpen(true);
  };

  const handleParentGateSuccess = (targetView: string) => {
    setIsParentGateOpen(false);
    if (targetView === 'parent') {
      setIsParentZoneOpen(true);
    } else if (targetView === 'admin') {
      setIsAdminPanelOpen(true);
    } else if (targetView === 'logout') {
      handleSignOut();
    }
  };

  // Profile update handler
  const handleUpdateProfile = (childName: string, childAvatar: string, childAge: number) => {
    setUser(prev => ({
      ...prev,
      childName,
      childAvatar,
      childAge
    }));
  };

  // Parent Zone Settings update
  const handleUpdateParentSettings = (settings: { dailyLimitMinutes: number; soundEnabled: boolean; childName: string; childAge: number }) => {
    setUser(prev => ({
      ...prev,
      childName: settings.childName,
      childAge: settings.childAge,
      parentSettings: {
        ...prev.parentSettings,
        dailyLimitMinutes: settings.dailyLimitMinutes,
        soundEnabled: settings.soundEnabled
      }
    }));
  };

  // Premium Upgrade
  const handleUpgradePremium = (planId: string) => {
    setUser(prev => ({
      ...prev,
      isPremium: true
    }));
    setIsPremiumModalOpen(false);
    soundEffects.playLevelUp();
  };

  // Admin Actions
  const handleAddCustomWord = (newWord: WordItem) => {
    setWordsList(prev => [newWord, ...prev]);
  };

  const handleToggleUserPremium = (userId: string) => {
    setUser(prev => ({ ...prev, isPremium: !prev.isPremium }));
  };

  // Progress stats object for parent
  const stats: ProgressStats = {
    totalStarsEarned: user.totalStars || 0,
    lettersLearnedCount: user.learnedLetters?.length || 0,
    numbersLearnedCount: user.learnedNumbers?.length || 0,
    gamesPlayedCount: user.completedGames?.length || 0,
    dailyStreak: user.dailyStreak || 1,
    lastActiveDate: new Date().toISOString()
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-b from-amber-50/40 via-orange-50/20 to-sky-50/30 text-slate-900 font-sans antialiased selection:bg-amber-200" dir="rtl">
      {/* Top Application Navigation Bar */}
      <Header
        user={user}
        currentView={currentView}
        onNavigate={(view) => {
          soundEffects.playPop();
          setCurrentView(view);
        }}
        onOpenParentGate={(targetView) => handleOpenParentGate(targetView as 'parent' | 'admin' | 'logout')}
        onOpenAuth={() => {
          soundEffects.playPop();
          setIsProfileModalOpen(true);
        }}
        onOpenPremium={() => {
          soundEffects.playStarCollect();
          setIsPremiumModalOpen(true);
        }}
        onSignOut={handleSignOut}
        isMuted={isMuted}
        onToggleSound={handleToggleSound}
        isSuperAdminUser={isSuperAdminUser}
      />

      {/* Main Screen Router View Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 pt-4 pb-16 overflow-x-hidden">
        {currentView === 'home' && (
          <HomeDashboard
            user={user}
            dailyChallenges={dailyChallenges}
            onNavigate={(view) => {
              if (view === 'letter-tracing') {
                setTracingLetter('A');
              } else if (view === 'repeat-after-me') {
                setRepeatWord('Apple');
              }
              setCurrentView(view);
            }}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onClaimDailyReward={(id) => handleRewardStars(10)}
          />
        )}

        {currentView === 'letters' && (
          <LettersSection
            letters={initialLetters}
            user={user}
            onBack={() => setCurrentView('home')}
            onLetterLearned={handleLetterLearned}
            onOpenTracing={(letter) => {
              setTracingLetter(letter);
              setCurrentView('letter-tracing');
            }}
            onOpenRepeat={(word) => {
              setRepeatWord(word);
              setCurrentView('repeat-after-me');
            }}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {currentView === 'numbers' && (
          <NumbersSection
            numbers={initialNumbers}
            user={user}
            onBack={() => setCurrentView('home')}
            onNumberLearned={handleNumberLearned}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {currentView === 'colors' && (
          <ColorsSection
            colors={initialColors}
            user={user}
            onBack={() => setCurrentView('home')}
            onReward={handleRewardStars}
          />
        )}

        {currentView === 'animals' && (
          <AnimalsSection
            animals={initialAnimals}
            user={user}
            onBack={() => setCurrentView('home')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onReward={handleRewardStars}
          />
        )}

        {currentView === 'fruits' && (
          <FruitsSection
            fruits={initialFruits}
            user={user}
            onBack={() => setCurrentView('home')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {currentView === 'shapes' && (
          <ShapesSection
            shapes={initialShapes}
            user={user}
            onBack={() => setCurrentView('home')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {currentView === 'bodyParts' && (
          <BodyPartsSection
            bodyParts={initialBodyParts}
            user={user}
            onBack={() => setCurrentView('home')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {currentView === 'words' && (
          <WordsDictionarySection
            words={wordsList}
            user={user}
            onBack={() => setCurrentView('home')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {currentView === 'sentences' && (
          <SimpleSentencesSection
            sentences={initialSentences}
            user={user}
            onBack={() => setCurrentView('home')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {currentView === 'write-and-speak' && (
          <WriteAndSpeak
            user={user}
            onBack={() => setCurrentView('home')}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
            onReward={handleRewardStars}
          />
        )}

        {currentView === 'repeat-after-me' && (
          <RepeatAfterMe
            user={user}
            initialWord={repeatWord}
            onBack={() => setCurrentView('home')}
            onReward={handleRewardStars}
          />
        )}

        {currentView === 'letter-tracing' && (
          <LetterTracing
            letters={initialLetters}
            user={user}
            initialLetter={tracingLetter}
            onBack={() => setCurrentView('home')}
            onReward={handleRewardStars}
          />
        )}

        {currentView === 'word-builder' && (
          <WordBuilder
            user={user}
            onBack={() => setCurrentView('home')}
            onReward={handleRewardStars}
          />
        )}

        {currentView === 'games' && (
          <GamesSection
            games={initialGames}
            user={user}
            onBack={() => setCurrentView('home')}
            onReward={handleRewardStars}
          />
        )}

        {currentView === 'stories' && (
          <StoriesSection
            stories={initialStories}
            user={user}
            onBack={() => setCurrentView('home')}
            onReward={handleRewardStars}
            onOpenPremium={() => setIsPremiumModalOpen(true)}
          />
        )}

        {currentView === 'songs' && (
          <SongsSection
            songs={initialSongs}
            user={user}
            onBack={() => setCurrentView('home')}
            onReward={handleRewardStars}
          />
        )}

        {currentView === 'ai-teacher' && (
          <AiTeacherSection
            user={user}
            onBack={() => setCurrentView('home')}
            onReward={handleRewardStars}
          />
        )}
      </main>

      {/* Pure Email & Password Authentication Screen Modal */}
      <AuthScreen
        isOpen={isAuthScreenOpen}
        onClose={() => setIsAuthScreenOpen(false)}
        onContinueAsGuest={() => {
          setIsAuthScreenOpen(false);
          soundEffects.playPop();
        }}
        onAuthSuccess={(authenticatedUser) => {
          setUser(authenticatedUser);
          setIsAuthScreenOpen(false);
          soundEffects.playSuccess();
        }}
      />

      {/* Security Parent Gate Modal */}
      <ParentGateModal
        isOpen={isParentGateOpen}
        targetView={parentGateTarget || 'parent'}
        onClose={() => setIsParentGateOpen(false)}
        onSuccess={handleParentGateSuccess}
        savedPin={user.parentSettings?.pin || '1234'}
      />

      {/* Parent Zone Modal */}
      <ParentZoneModal
        isOpen={isParentZoneOpen}
        onClose={() => setIsParentZoneOpen(false)}
        user={user}
        stats={stats}
        onUpdateSettings={handleUpdateParentSettings}
      />

      {/* Super Admin Control Panel Modal — Strictly for larblaablaybla@gmail.com */}
      <AdminPanelModal
        isOpen={isAdminPanelOpen}
        onClose={() => setIsAdminPanelOpen(false)}
        currentUser={user}
        plans={subscriptionPlans}
        onAddCustomWord={handleAddCustomWord}
        onToggleUserPremium={handleToggleUserPremium}
      />

      {/* Premium Upgrade Modal */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        plans={subscriptionPlans}
        user={user}
        onUpgrade={handleUpgradePremium}
      />

      {/* Child Profile & Account Modal */}
      <ProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        user={user}
        onUpdateProfile={handleUpdateProfile}
        onOpenAuthScreen={() => setIsAuthScreenOpen(true)}
        onSignOut={handleSignOut}
        isAuthLoading={isAuthLoading}
      />
    </div>
  );
}
