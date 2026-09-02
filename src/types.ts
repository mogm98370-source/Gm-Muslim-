export type Role = 'user' | 'admin' | 'super_admin';

export interface ParentSettings {
  pin: string;
  dailyLimitMinutes: number;
  soundEnabled: boolean;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  childName: string;
  childAge: number;
  childAvatar: string;
  role: Role;
  isPremium: boolean;
  premiumExpiresAt?: string;
  stars?: number;
  totalStars: number;
  points?: number;
  level?: number;
  completedLessons?: string[];
  learnedLetters: string[];
  learnedWords?: string[];
  learnedNumbers: string[];
  completedGames?: string[];
  badges?: Badge[];
  parentPin?: string;
  parentSettings: ParentSettings;
  dailyStreak: number;
  lastActiveDate?: string;
  totalMinutes?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface ProgressStats {
  totalStarsEarned: number;
  lettersLearnedCount: number;
  numbersLearnedCount: number;
  gamesPlayedCount: number;
  dailyStreak: number;
  lastActiveDate: string;
}

export interface Badge {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  descriptionAr: string;
  earnedAt?: string;
  unlocked: boolean;
}

export interface LetterItem {
  id: string;
  letter: string;
  lowercase: string;
  word: string;
  arabicWord: string;
  emoji: string;
  image?: string;
  phonetic: string;
  exampleSentence: string;
  arabicSentence: string;
  color: string;
  isPremium?: boolean;
}

export interface NumberItem {
  id: string;
  number: number;
  word: string;
  arabicWord: string;
  countEmoji?: string;
  color?: string;
  isPremium?: boolean;
}

export interface ColorItem {
  id: string;
  name: string;
  arabicName: string;
  hex: string;
  textColor: string;
  exampleItem: string;
  emoji: string;
  isPremium?: boolean;
}

export interface AnimalItem {
  id: string;
  name: string;
  arabicName: string;
  emoji: string;
  sound: string;
  category: string;
  image?: string;
  isPremium?: boolean;
}

export interface FruitItem {
  id: string;
  name: string;
  arabicName: string;
  emoji: string;
  color: string;
  tasteAr: string;
  isPremium?: boolean;
}

export interface ShapeItem {
  id: string;
  name: string;
  arabicName: string;
  emoji: string;
  sides: number;
  color: string;
  isPremium?: boolean;
}

export interface BodyPartItem {
  id: string;
  name: string;
  arabicName: string;
  emoji: string;
  descriptionAr: string;
  isPremium?: boolean;
}

export type WordCategory = 'family' | 'food' | 'school' | 'toys' | 'clothes' | 'home' | 'nature' | 'transport';

export interface WordItem {
  id: string;
  category: WordCategory;
  categoryAr?: string;
  english: string;
  arabic: string;
  emoji: string;
  phonetic?: string;
  isPremium?: boolean;
}

export interface SentenceItem {
  id: string;
  english: string;
  arabic: string;
  emoji: string;
  difficulty: 'easy' | 'medium';
  isPremium?: boolean;
}

export interface StorySentence {
  english: string;
  arabic: string;
}

export interface StoryQuizItem {
  questionAr: string;
  questionEn?: string;
  options: string[];
  correctIndex: number;
}

export interface StoryItem {
  id: string;
  titleEn: string;
  titleAr: string;
  emoji?: string;
  coverEmoji?: string;
  summaryAr?: string;
  sentences: StorySentence[];
  moralAr?: string;
  quiz?: StoryQuizItem[];
  isPremium?: boolean;
}

export interface SongLyric {
  timeSec?: number;
  en: string;
  ar?: string;
}

export interface SongItem {
  id: string;
  titleEn: string;
  titleAr: string;
  category: string;
  emoji: string;
  durationSec?: number;
  lyrics: string[];
  isPremium?: boolean;
}

export type GameType = 
  | 'match-letter-cases'
  | 'match-letter-picture'
  | 'match-letter-word'
  | 'match-color-name'
  | 'match-number-count'
  | 'tap-the-letter'
  | 'word-builder'
  | 'memory-cards'
  | 'listen-and-choose'
  | 'count-and-pop'
  | 'letter-trace'
  | 'word-puzzle'
  | 'speed-challenge';

export interface GameItem {
  id: string;
  titleAr: string;
  titleEn: string;
  icon: string;
  category: string;
  descriptionAr: string;
  starsReward: number;
  isPremium?: boolean;
}

export interface GameDefinition {
  id: GameType;
  titleAr: string;
  titleEn: string;
  emoji: string;
  category: string;
  descriptionAr: string;
  difficultyLevels?: ('easy' | 'medium' | 'hard')[];
  isPremium?: boolean;
}

export interface DailyChallenge {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  targetCount: number;
  currentCount: number;
  rewardStars: number;
  rewardPoints: number;
  completed: boolean;
  type: 'letters' | 'words' | 'game' | 'pronounce' | 'trace';
}

export interface SubscriptionPlan {
  id: string;
  nameAr: string;
  nameEn: string;
  price?: string;
  priceUSD?: number;
  periodAr: string;
  interval: 'weekly' | 'monthly' | 'yearly' | 'lifetime';
  features?: string[];
  featuresAr: string[];
  isPopular?: boolean;
  active: boolean;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'teacher';
  textAr: string;
  textEn?: string;
  timestamp: string;
}

export interface AppSettings {
  appNameAr: string;
  appNameEn: string;
  taglineAr: string;
  soundEffectsEnabled: boolean;
  speechSynthesisRate: number;
  adsEnabled: boolean;
  aiTeacherEnabled: boolean;
  dailyFreeAiLimit: number;
  freeLettersCount: number;
  primaryColor: string;
}
