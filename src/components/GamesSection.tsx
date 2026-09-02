import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Gamepad2, 
  Star, 
  Trophy, 
  Sparkles, 
  RotateCcw, 
  Volume2, 
  Check, 
  X,
  Flame,
  Award,
  Play,
  Clock,
  CheckCircle2,
  AlertCircle,
  Zap,
  HelpCircle,
  Smile
} from 'lucide-react';
import { GameItem, UserProfile } from '../types';
import { speakEnglish, soundEffects } from '../lib/sound';
import { saveGameResult } from '../lib/firebase';
import confetti from 'canvas-confetti';

interface GamesSectionProps {
  games: GameItem[];
  user: UserProfile;
  onBack: () => void;
  onReward: (stars: number) => void;
  onOpenLetterTracing?: () => void;
}

type Difficulty = 'easy' | 'medium' | 'hard';

export const GamesSection: React.FC<GamesSectionProps> = ({
  games,
  user,
  onBack,
  onReward,
  onOpenLetterTracing
}) => {
  const [activeGameId, setActiveGameId] = useState<string | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');

  // Unified Game Session State
  const [gameScore, setGameScore] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [wrongCount, setWrongCount] = useState(0);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(30);

  // 1. MATCHING GAMES STATE (Letter Cases, Letter-Pic, Word-Pic, Color-Name, Number-Count)
  const [matchLeftItems, setMatchLeftItems] = useState<{ id: string; label: string; pairId: string; matched: boolean }[]>([]);
  const [matchRightItems, setMatchRightItems] = useState<{ id: string; label: string; pairId: string; matched: boolean }[]>([]);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);

  // 2. TAP THE LETTER STATE
  const [tapTarget, setTapTarget] = useState('A');
  const [tapOptions, setTapOptions] = useState<{ id: string; letter: string }[]>([]);

  // 3. MEMORY CARDS STATE
  const [memoryCards, setMemoryCards] = useState<{ id: string; pairId: string; label: string; isMatched: boolean }[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);

  // 4. LISTEN & CHOOSE STATE
  const [listenIdx, setListenIdx] = useState(0);
  const [listenQuizList, setListenQuizList] = useState<{ target: string; emoji: string; ar: string; options: { word: string; emoji: string }[] }[]>([]);

  // 5. WORD BUILDER STATE
  const [builderTargetWord, setBuilderTargetWord] = useState<{ word: string; ar: string; emoji: string }>({ word: 'CAT', ar: 'قطة', emoji: '🐱' });
  const [builderPool, setBuilderPool] = useState<string[]>([]);
  const [builderBuilt, setBuilderBuilt] = useState<string[]>([]);

  // 6. COUNT & POP BUBBLES STATE
  const [bubbleTarget, setBubbleTarget] = useState(5);
  const [poppedCount, setPoppedCount] = useState(0);
  const [bubbles, setBubbles] = useState<number[]>([]);

  // 7. SPEED CHALLENGE STATE
  const [speedQuestions, setSpeedQuestions] = useState<{ questionEn: string; questionAr: string; options: string[]; correct: string }[]>([]);
  const [speedIdx, setSpeedIdx] = useState(0);

  // Clean finish handler & Firestore sync
  const finishGameSession = (finalCorrect: number, finalWrong: number, totalQuestions: number) => {
    setIsGameFinished(true);
    const scorePct = Math.round((finalCorrect / Math.max(1, totalQuestions)) * 100);
    const stars = Math.max(3, Math.round((finalCorrect * (difficulty === 'hard' ? 3 : difficulty === 'medium' ? 2 : 1))));
    const points = stars * 10;

    setGameScore(scorePct);
    onReward(stars);

    if (scorePct >= 60) {
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      soundEffects.playVictory();
    } else {
      soundEffects.playSuccess();
    }

    if (user.uid) {
      saveGameResult(user.uid, {
        gameId: activeGameId || 'unknown',
        gameTitle: games.find(g => g.id === activeGameId)?.titleAr || 'لعبة تعليمية',
        difficulty,
        score: scorePct,
        correctAnswers: finalCorrect,
        wrongAnswers: finalWrong,
        starsEarned: stars,
        pointsEarned: points
      }).catch(e => console.warn('Sync game result error:', e));
    }
  };

  // Launch and initialize games
  const handleLaunchGame = (gameId: string) => {
    soundEffects.playPop();
    setActiveGameId(gameId);
    setIsGameFinished(false);
    setCorrectCount(0);
    setWrongCount(0);
    setGameScore(0);
    setSelectedLeft(null);
    setSelectedRight(null);

    if (gameId === 'letter-trace' && onOpenLetterTracing) {
      onOpenLetterTracing();
      return;
    }

    // Initialize Matching Games
    if (gameId === 'match-letter-cases') {
      initMatchLetterCases();
    } else if (gameId === 'match-letter-picture') {
      initMatchLetterPicture();
    } else if (gameId === 'match-letter-word' || gameId === 'word-puzzle') {
      initMatchWordPicture();
    } else if (gameId === 'match-color-name') {
      initMatchColorName();
    } else if (gameId === 'match-number-count') {
      initMatchNumberCount();
    } else if (gameId === 'tap-the-letter') {
      initTapTheLetter();
    } else if (gameId === 'memory-cards' || gameId === 'memory-match') {
      initMemoryCards();
    } else if (gameId === 'listen-and-choose') {
      initListenQuiz();
    } else if (gameId === 'word-builder') {
      initWordBuilder();
    } else if (gameId === 'count-and-pop') {
      initBubbleGame();
    } else if (gameId === 'speed-challenge') {
      initSpeedChallenge();
    }
  };

  // 1. Match Letters (A ↔ a)
  const initMatchLetterCases = () => {
    const pool = [
      { id: '1', pairId: 'a', label: 'A' },
      { id: '2', pairId: 'b', label: 'B' },
      { id: '3', pairId: 'c', label: 'C' },
      { id: '4', pairId: 'd', label: 'D' },
      { id: '5', pairId: 'e', label: 'E' },
      { id: '6', pairId: 'f', label: 'F' }
    ].slice(0, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6);

    const left = pool.map(item => ({ ...item, matched: false })).sort(() => Math.random() - 0.5);
    const right = pool.map(item => ({ id: item.id + '_r', pairId: item.pairId, label: item.pairId.toLowerCase(), matched: false })).sort(() => Math.random() - 0.5);

    setMatchLeftItems(left);
    setMatchRightItems(right);
    speakEnglish('Match the uppercase and lowercase letters!');
  };

  // 2. Match Letter to Picture (A ↔ 🍎 Apple)
  const initMatchLetterPicture = () => {
    const pool = [
      { id: '1', pairId: 'apple', label: 'A' },
      { id: '2', pairId: 'ball', label: 'B' },
      { id: '3', pairId: 'cat', label: 'C' },
      { id: '4', pairId: 'dog', label: 'D' },
      { id: '5', pairId: 'elephant', label: 'E' }
    ].slice(0, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);

    const picMap: Record<string, string> = {
      apple: '🍎 Apple',
      ball: '⚽ Ball',
      cat: '🐱 Cat',
      dog: '🐶 Dog',
      elephant: '🐘 Elephant'
    };

    const left = pool.map(i => ({ ...i, matched: false })).sort(() => Math.random() - 0.5);
    const right = pool.map(i => ({ id: i.id + '_r', pairId: i.pairId, label: picMap[i.pairId], matched: false })).sort(() => Math.random() - 0.5);

    setMatchLeftItems(left);
    setMatchRightItems(right);
    speakEnglish('Match each letter to its picture!');
  };

  // 3. Match Word to Picture (Cat ↔ 🐱)
  const initMatchWordPicture = () => {
    const pool = [
      { id: '1', pairId: 'cat', label: 'Cat', pic: '🐱' },
      { id: '2', pairId: 'dog', label: 'Dog', pic: '🐶' },
      { id: '3', pairId: 'lion', label: 'Lion', pic: '🦁' },
      { id: '4', pairId: 'bird', label: 'Bird', pic: '🐦' },
      { id: '5', pairId: 'fish', label: 'Fish', pic: '🐟' }
    ].slice(0, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 5);

    const left = pool.map(i => ({ id: i.id, pairId: i.pairId, label: i.label, matched: false })).sort(() => Math.random() - 0.5);
    const right = pool.map(i => ({ id: i.id + '_r', pairId: i.pairId, label: i.pic, matched: false })).sort(() => Math.random() - 0.5);

    setMatchLeftItems(left);
    setMatchRightItems(right);
    speakEnglish('Match the word with the correct picture!');
  };

  // 4. Match Color to Name (🔴 ↔ Red)
  const initMatchColorName = () => {
    const pool = [
      { id: '1', pairId: 'red', label: '🔴 أحمر', en: 'Red' },
      { id: '2', pairId: 'blue', label: '🔵 أزرق', en: 'Blue' },
      { id: '3', pairId: 'green', label: '🟢 أخضر', en: 'Green' },
      { id: '4', pairId: 'yellow', label: '🟡 أصفر', en: 'Yellow' }
    ].slice(0, difficulty === 'easy' ? 3 : 4);

    const left = pool.map(i => ({ id: i.id, pairId: i.pairId, label: i.label, matched: false })).sort(() => Math.random() - 0.5);
    const right = pool.map(i => ({ id: i.id + '_r', pairId: i.pairId, label: i.en, matched: false })).sort(() => Math.random() - 0.5);

    setMatchLeftItems(left);
    setMatchRightItems(right);
    speakEnglish('Match the color with its English name!');
  };

  // 5. Match Number to Count (3 ↔ ⭐️⭐️⭐️)
  const initMatchNumberCount = () => {
    const pool = [
      { id: '1', pairId: '1', label: '1 (One)', count: '⭐' },
      { id: '2', pairId: '2', label: '2 (Two)', count: '⭐⭐' },
      { id: '3', pairId: '3', label: '3 (Three)', count: '⭐⭐⭐' },
      { id: '4', pairId: '4', label: '4 (Four)', count: '⭐⭐⭐⭐' }
    ].slice(0, difficulty === 'easy' ? 3 : 4);

    const left = pool.map(i => ({ id: i.id, pairId: i.pairId, label: i.label, matched: false })).sort(() => Math.random() - 0.5);
    const right = pool.map(i => ({ id: i.id + '_r', pairId: i.pairId, label: i.count, matched: false })).sort(() => Math.random() - 0.5);

    setMatchLeftItems(left);
    setMatchRightItems(right);
    speakEnglish('Match the number with the correct count!');
  };

  // Click handler for all matching games
  const handleSelectMatch = (side: 'left' | 'right', pairId: string, id: string) => {
    soundEffects.playPop();
    if (side === 'left') {
      setSelectedLeft(pairId);
      if (selectedRight) {
        checkMatch(pairId, selectedRight);
      }
    } else {
      setSelectedRight(pairId);
      if (selectedLeft) {
        checkMatch(selectedLeft, pairId);
      }
    }
  };

  const checkMatch = (leftPair: string, rightPair: string) => {
    if (leftPair === rightPair) {
      soundEffects.playSuccess();
      speakEnglish(leftPair);
      setCorrectCount(prev => prev + 1);

      setMatchLeftItems(prev => prev.map(item => item.pairId === leftPair ? { ...item, matched: true } : item));
      setMatchRightItems(prev => prev.map(item => item.pairId === rightPair ? { ...item, matched: true } : item));

      setSelectedLeft(null);
      setSelectedRight(null);

      // Check if all matched
      const remaining = matchLeftItems.filter(i => !i.matched && i.pairId !== leftPair).length;
      if (remaining === 0) {
        finishGameSession(correctCount + 1, wrongCount, matchLeftItems.length);
      }
    } else {
      soundEffects.playError();
      setWrongCount(prev => prev + 1);
      setTimeout(() => {
        setSelectedLeft(null);
        setSelectedRight(null);
      }, 700);
    }
  };

  // 6. Tap the Target Letter
  const initTapTheLetter = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'M', 'S', 'T', 'Z'];
    const target = letters[Math.floor(Math.random() * letters.length)];
    setTapTarget(target);

    const count = difficulty === 'easy' ? 6 : difficulty === 'medium' ? 9 : 12;
    const shuffled: { id: string; letter: string }[] = [];

    // ensure at least 2 target letters
    shuffled.push({ id: 't1', letter: target });
    shuffled.push({ id: 't2', letter: target });

    while (shuffled.length < count) {
      const rnd = letters[Math.floor(Math.random() * letters.length)];
      shuffled.push({ id: Math.random().toString(), letter: rnd });
    }

    setTapOptions(shuffled.sort(() => Math.random() - 0.5));
    speakEnglish(`Tap the letter: ${target}`);
  };

  const handleTapLetterClick = (id: string, letter: string) => {
    if (letter === tapTarget) {
      soundEffects.playSuccess();
      speakEnglish(letter);
      setCorrectCount(prev => prev + 1);
      setTapOptions(prev => prev.filter(o => o.id !== id));

      const targetRemaining = tapOptions.filter(o => o.letter === tapTarget && o.id !== id).length;
      if (targetRemaining === 0) {
        finishGameSession(correctCount + 1, wrongCount, 5);
      }
    } else {
      soundEffects.playError();
      setWrongCount(prev => prev + 1);
    }
  };

  // 7. Memory Cards
  const initMemoryCards = () => {
    const baseCards = [
      { id: '1', pairId: 'apple', label: 'Apple 🍎' },
      { id: '2', pairId: 'cat', label: 'Cat 🐱' },
      { id: '3', pairId: 'dog', label: 'Dog 🐶' },
      { id: '4', pairId: 'star', label: 'Star ⭐' },
      { id: '5', pairId: 'sun', label: 'Sun ☀️' },
      { id: '6', pairId: 'car', label: 'Car 🚗' }
    ].slice(0, difficulty === 'easy' ? 3 : difficulty === 'medium' ? 4 : 6);

    const deck = [
      ...baseCards.map(c => ({ id: c.id + '_a', pairId: c.pairId, label: c.label, isMatched: false })),
      ...baseCards.map(c => ({ id: c.id + '_b', pairId: c.pairId, label: c.label, isMatched: false }))
    ].sort(() => Math.random() - 0.5);

    setMemoryCards(deck);
    setFlippedIndices([]);
    speakEnglish('Find all matching cards!');
  };

  const handleMemoryCardClick = (idx: number) => {
    if (flippedIndices.length === 2 || flippedIndices.includes(idx) || memoryCards[idx].isMatched) return;

    soundEffects.playPop();
    const newFlipped = [...flippedIndices, idx];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      if (memoryCards[first].pairId === memoryCards[second].pairId) {
        soundEffects.playSuccess();
        speakEnglish(memoryCards[first].pairId);
        setCorrectCount(prev => prev + 1);

        setMemoryCards(prev => prev.map((card, i) => i === first || i === second ? { ...card, isMatched: true } : card));
        setFlippedIndices([]);

        const unmatchedLeft = memoryCards.filter(c => !c.isMatched).length;
        if (unmatchedLeft <= 2) {
          finishGameSession(correctCount + 1, wrongCount, memoryCards.length / 2);
        }
      } else {
        soundEffects.playError();
        setWrongCount(prev => prev + 1);
        setTimeout(() => {
          setFlippedIndices([]);
        }, 900);
      }
    }
  };

  // 8. Listen & Choose
  const initListenQuiz = () => {
    const list = [
      { target: 'Apple', emoji: '🍎', ar: 'تفاحة', options: [{ word: 'Apple', emoji: '🍎' }, { word: 'Banana', emoji: '🍌' }, { word: 'Cat', emoji: '🐱' }, { word: 'Dog', emoji: '🐶' }] },
      { target: 'Cat', emoji: '🐱', ar: 'قطة', options: [{ word: 'Bird', emoji: '🐦' }, { word: 'Cat', emoji: '🐱' }, { word: 'Fish', emoji: '🐟' }, { word: 'Sun', emoji: '☀️' }] },
      { target: 'Star', emoji: '⭐', ar: 'نجمة', options: [{ word: 'Moon', emoji: '🌙' }, { word: 'Star', emoji: '⭐' }, { word: 'Tree', emoji: '🌳' }, { word: 'Car', emoji: '🚗' }] },
      { target: 'Sun', emoji: '☀️', ar: 'شمس', options: [{ word: 'Ball', emoji: '⚽' }, { word: 'Boat', emoji: '⛵' }, { word: 'Sun', emoji: '☀️' }, { word: 'Book', emoji: '📖' }] },
      { target: 'Dog', emoji: '🐶', ar: 'كلب', options: [{ word: 'Lion', emoji: '🦁' }, { word: 'Cow', emoji: '🐮' }, { word: 'Dog', emoji: '🐶' }, { word: 'Duck', emoji: '🦆' }] }
    ];

    setListenIdx(0);
    setListenQuizList(list);
    speakEnglish(`Listen carefully and tap: ${list[0].target}`);
  };

  const handleListenChoice = (chosenWord: string) => {
    const current = listenQuizList[listenIdx];
    if (chosenWord === current.target) {
      soundEffects.playSuccess();
      setCorrectCount(prev => prev + 1);

      if (listenIdx + 1 < listenQuizList.length) {
        setListenIdx(prev => prev + 1);
        speakEnglish(`Find: ${listenQuizList[listenIdx + 1].target}`);
      } else {
        finishGameSession(correctCount + 1, wrongCount, listenQuizList.length);
      }
    } else {
      soundEffects.playError();
      setWrongCount(prev => prev + 1);
    }
  };

  // 9. Word Builder
  const initWordBuilder = () => {
    const words = [
      { word: 'CAT', ar: 'قطة', emoji: '🐱' },
      { word: 'DOG', ar: 'كلب', emoji: '🐶' },
      { word: 'SUN', ar: 'شمس', emoji: '☀️' },
      { word: 'BOX', ar: 'صندوق', emoji: '📦' },
      { word: 'RED', ar: 'أحمر', emoji: '🔴' }
    ];
    const target = words[Math.floor(Math.random() * words.length)];
    setBuilderTargetWord(target);

    const letters = target.word.split('').sort(() => Math.random() - 0.5);
    // add an extra random distractor letter for medium/hard
    if (difficulty !== 'easy') {
      const dist = ['X', 'Z', 'M', 'P'][Math.floor(Math.random() * 4)];
      letters.push(dist);
      letters.sort(() => Math.random() - 0.5);
    }

    setBuilderPool(letters);
    setBuilderBuilt([]);
    speakEnglish(`Spell the word: ${target.word}`);
  };

  const handleBuilderLetterClick = (letter: string, idx: number) => {
    soundEffects.playPop();
    const newBuilt = [...builderBuilt, letter];
    setBuilderBuilt(newBuilt);
    setBuilderPool(prev => prev.filter((_, i) => i !== idx));

    if (newBuilt.length === builderTargetWord.word.length) {
      const full = newBuilt.join('');
      if (full === builderTargetWord.word) {
        soundEffects.playSuccess();
        speakEnglish(full);
        finishGameSession(correctCount + 1, wrongCount, 1);
      } else {
        soundEffects.playError();
        setWrongCount(prev => prev + 1);
        setTimeout(() => {
          // reset pool
          initWordBuilder();
        }, 1000);
      }
    }
  };

  // 10. Bubble Game
  const initBubbleGame = () => {
    const target = Math.floor(Math.random() * 4) + (difficulty === 'easy' ? 3 : 5);
    setBubbleTarget(target);
    setPoppedCount(0);
    setBubbles(Array.from({ length: 12 }, (_, i) => i));
    speakEnglish(`Pop ${target} stars!`);
  };

  const handlePopBubble = (bId: number) => {
    soundEffects.playPop(600 + poppedCount * 80);
    setBubbles(prev => prev.filter(b => b !== bId));
    const nextCount = poppedCount + 1;
    setPoppedCount(nextCount);

    if (nextCount === bubbleTarget) {
      soundEffects.playSuccess();
      finishGameSession(bubbleTarget, 0, bubbleTarget);
    }
  };

  // 11. Speed Challenge
  const initSpeedChallenge = () => {
    const questions = [
      { questionEn: 'What color is an Apple?', questionAr: 'ما هو لون التفاحة؟', options: ['Red', 'Blue', 'Black'], correct: 'Red' },
      { questionEn: 'What animal says Meow?', questionAr: 'ما هو الحيوان الذي يموء؟', options: ['Cat', 'Lion', 'Duck'], correct: 'Cat' },
      { questionEn: 'How many legs does a Dog have?', questionAr: 'كم عدد أرجل الكلب؟', options: ['Four', 'Two', 'Six'], correct: 'Four' },
      { questionEn: 'Which one is a fruit?', questionAr: 'أي من هذه فاكهة؟', options: ['Banana', 'Car', 'Book'], correct: 'Banana' }
    ];

    setSpeedQuestions(questions);
    setSpeedIdx(0);
    setTimerSeconds(30);
    speakEnglish(questions[0].questionEn);
  };

  const handleSpeedAnswer = (opt: string) => {
    const cur = speedQuestions[speedIdx];
    if (opt === cur.correct) {
      soundEffects.playSuccess();
      setCorrectCount(prev => prev + 1);
    } else {
      soundEffects.playError();
      setWrongCount(prev => prev + 1);
    }

    if (speedIdx + 1 < speedQuestions.length) {
      setSpeedIdx(prev => prev + 1);
      speakEnglish(speedQuestions[speedIdx + 1].questionEn);
    } else {
      finishGameSession(correctCount + (opt === cur.correct ? 1 : 0), wrongCount + (opt === cur.correct ? 0 : 1), speedQuestions.length);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in" dir="rtl">
      {/* Top Header & Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-slate-200 shadow-xs">
        <button
          onClick={() => {
            soundEffects.playPop();
            if (activeGameId) {
              setActiveGameId(null);
            } else {
              onBack();
            }
          }}
          className="flex items-center gap-2 bg-slate-100 hover:bg-amber-100 text-slate-800 font-bold px-4 py-2.5 rounded-2xl transition-all shadow-xs active:scale-95"
        >
          <ArrowRight className="w-5 h-5 text-amber-600" />
          <span>{activeGameId ? 'العودة لمركز الألعاب' : 'الرئيسية'}</span>
        </button>

        <div className="text-center">
          <h2 className="text-lg sm:text-xl font-black text-slate-800 flex items-center gap-2 justify-center">
            <span>🎮</span>
            <span>مركز الألعاب التفاعلية (GM Games)</span>
          </h2>
          <p className="text-xs text-slate-500 font-bold">
            12 لعبة تعليمية ممتعة تعمل 100% مع نظام مكافآت حقيقي! ⭐
          </p>
        </div>

        {/* Difficulty Selector */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl gap-1">
          <button
            onClick={() => {
              soundEffects.playPop();
              setDifficulty('easy');
              if (activeGameId) handleLaunchGame(activeGameId);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === 'easy' ? 'bg-emerald-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟢 سهل
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setDifficulty('medium');
              if (activeGameId) handleLaunchGame(activeGameId);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === 'medium' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🟡 متوسط
          </button>
          <button
            onClick={() => {
              soundEffects.playPop();
              setDifficulty('hard');
              if (activeGameId) handleLaunchGame(activeGameId);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              difficulty === 'hard' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            🔴 متقدم
          </button>
        </div>
      </div>

      {/* ==================== ACTIVE GAME CANVAS ==================== */}
      {activeGameId && !isGameFinished && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-200 shadow-xl max-w-2xl mx-auto space-y-6">
          {/* Game Header Controls */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-800">
                  {games.find(g => g.id === activeGameId)?.titleAr}
                </h3>
                <p className="text-xs text-slate-400 font-bold">
                  الصعوبة: {difficulty === 'easy' ? 'سهل' : difficulty === 'medium' ? 'متوسط' : 'متقدم'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-xl text-xs font-black border border-emerald-200">
                <Check className="w-3.5 h-3.5" />
                <span>{correctCount}</span>
              </div>
              <div className="flex items-center gap-1 bg-rose-50 text-rose-700 px-2.5 py-1 rounded-xl text-xs font-black border border-rose-200">
                <X className="w-3.5 h-3.5" />
                <span>{wrongCount}</span>
              </div>
              <button
                onClick={() => handleLaunchGame(activeGameId)}
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                title="إعادة المحاولة"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 1. MATCHING GAMES (Letter Cases, Letter-Pic, Word-Pic, Color-Name, Number-Count) */}
          {(activeGameId === 'match-letter-cases' ||
            activeGameId === 'match-letter-picture' ||
            activeGameId === 'match-letter-word' ||
            activeGameId === 'word-puzzle' ||
            activeGameId === 'match-color-name' ||
            activeGameId === 'match-number-count') && (
            <div className="space-y-4">
              <p className="text-center text-xs font-bold text-slate-600">
                اضغط على عنصر من العمود الأيمن ثم اختر ما يطابقه من العمود الأيسر 🎯
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-2">
                {/* Right Column */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-500 text-center">الخيارات</h4>
                  {matchLeftItems.map((item) => (
                    <button
                      key={item.id}
                      disabled={item.matched}
                      onClick={() => handleSelectMatch('left', item.pairId, item.id)}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-base transition-all border-2 flex items-center justify-center ${
                        item.matched
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-700 opacity-50'
                          : selectedLeft === item.pairId
                          ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-md scale-102'
                          : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.matched && <Check className="w-4 h-4 mr-2" />}
                    </button>
                  ))}
                </div>

                {/* Left Column */}
                <div className="space-y-3">
                  <h4 className="text-xs font-black text-slate-500 text-center">المطابقات</h4>
                  {matchRightItems.map((item) => (
                    <button
                      key={item.id}
                      disabled={item.matched}
                      onClick={() => handleSelectMatch('right', item.pairId, item.id)}
                      className={`w-full py-3.5 px-4 rounded-2xl font-black text-base transition-all border-2 flex items-center justify-center ${
                        item.matched
                          ? 'bg-emerald-100 border-emerald-400 text-emerald-700 opacity-50'
                          : selectedRight === item.pairId
                          ? 'bg-amber-400 border-amber-600 text-slate-900 shadow-md scale-102'
                          : 'bg-slate-50 hover:bg-amber-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.matched && <Check className="w-4 h-4 mr-2" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. TAP THE LETTER */}
          {activeGameId === 'tap-the-letter' && (
            <div className="space-y-6 text-center">
              <div className="bg-amber-50 p-4 rounded-2xl border border-amber-200 inline-block mx-auto">
                <span className="text-xs font-black text-amber-800 block">اضغط على الحرف المطلوب:</span>
                <span className="text-4xl font-black text-orange-600 font-display block mt-1">{tapTarget}</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {tapOptions.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => handleTapLetterClick(opt.id, opt.letter)}
                    className="h-18 bg-white hover:bg-amber-100 active:scale-90 border-2 border-slate-200 hover:border-amber-400 rounded-2xl text-2xl font-black text-slate-800 font-display transition-all shadow-xs flex items-center justify-center"
                  >
                    {opt.letter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 3. MEMORY CARDS */}
          {(activeGameId === 'memory-cards' || activeGameId === 'memory-match') && (
            <div className="space-y-4">
              <p className="text-center text-xs font-bold text-slate-600">
                اقلب البطاقات وابحث عن الأزواج المتطابقة! 🧠
              </p>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {memoryCards.map((card, idx) => {
                  const isFlipped = flippedIndices.includes(idx) || card.isMatched;
                  return (
                    <button
                      key={card.id}
                      onClick={() => handleMemoryCardClick(idx)}
                      className={`h-20 sm:h-24 rounded-2xl border-2 font-bold text-sm sm:text-base transition-all flex items-center justify-center cursor-pointer ${
                        isFlipped
                          ? 'bg-gradient-to-tr from-purple-500 to-indigo-600 text-white border-purple-600 shadow-md scale-102'
                          : 'bg-slate-100 border-slate-300 hover:bg-amber-100 text-2xl'
                      }`}
                    >
                      {isFlipped ? card.label : '❓'}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. LISTEN & CHOOSE */}
          {activeGameId === 'listen-and-choose' && listenQuizList.length > 0 && (
            <div className="space-y-6 text-center">
              <div>
                <button
                  onClick={() => speakEnglish(listenQuizList[listenIdx]?.target)}
                  className="w-20 h-20 mx-auto rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-200 animate-bounce transition-all cursor-pointer"
                >
                  <Volume2 className="w-8 h-8" />
                </button>
                <p className="text-xs font-black text-slate-500 mt-2">اضغط للاستماع للصوت 🔊</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {listenQuizList[listenIdx]?.options.map((opt) => (
                  <button
                    key={opt.word}
                    onClick={() => handleListenChoice(opt.word)}
                    className="py-4 bg-slate-50 hover:bg-emerald-50 active:scale-95 border-2 border-slate-200 hover:border-emerald-400 rounded-2xl font-black text-base text-slate-800 transition-all flex items-center justify-center gap-2"
                  >
                    <span className="text-2xl">{opt.emoji}</span>
                    <span>{opt.word}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 5. WORD BUILDER */}
          {activeGameId === 'word-builder' && (
            <div className="space-y-6 text-center">
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl">{builderTargetWord.emoji}</span>
                <span className="text-lg font-black text-slate-700">{builderTargetWord.ar}</span>
              </div>

              {/* Word placeholder boxes */}
              <div className="flex items-center justify-center gap-2">
                {Array.from({ length: builderTargetWord.word.length }).map((_, i) => (
                  <div
                    key={i}
                    className="w-14 h-14 rounded-2xl bg-amber-50 border-2 border-dashed border-amber-400 flex items-center justify-center text-2xl font-black text-orange-600 font-display"
                  >
                    {builderBuilt[i] || ''}
                  </div>
                ))}
              </div>

              {/* Scrambled Pool */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                {builderPool.map((letter, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleBuilderLetterClick(letter, idx)}
                    className="w-12 h-12 bg-white hover:bg-orange-100 active:scale-90 border-2 border-slate-300 hover:border-orange-500 rounded-2xl text-xl font-black text-slate-800 font-display transition-all shadow-xs cursor-pointer"
                  >
                    {letter}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 6. COUNT & POP BUBBLES */}
          {activeGameId === 'count-and-pop' && (
            <div className="space-y-4 text-center">
              <div className="text-sm font-bold text-amber-800">
                المطلوب: فرقع <span className="text-xl font-black text-rose-600">{bubbleTarget}</span> نجوم! (فرقعت {poppedCount})
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 min-h-[200px] bg-sky-50 rounded-3xl p-6 border-2 border-dashed border-sky-200">
                {bubbles.map((b) => (
                  <button
                    key={b}
                    onClick={() => handlePopBubble(b)}
                    className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 hover:scale-125 active:scale-90 shadow-md flex items-center justify-center text-2xl transition-all cursor-pointer animate-pulse"
                  >
                    ⭐
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 7. SPEED CHALLENGE */}
          {activeGameId === 'speed-challenge' && speedQuestions.length > 0 && (
            <div className="space-y-6 text-center">
              <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                <h4 className="text-base font-black text-purple-900 font-display">
                  {speedQuestions[speedIdx]?.questionEn}
                </h4>
                <p className="text-xs text-purple-600 font-bold mt-1">
                  {speedQuestions[speedIdx]?.questionAr}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {speedQuestions[speedIdx]?.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSpeedAnswer(opt)}
                    className="py-3.5 bg-slate-50 hover:bg-purple-100 active:scale-95 border-2 border-slate-200 hover:border-purple-400 rounded-2xl font-black text-base text-slate-800 transition-all font-display"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================== GAME OVER & REWARD MODAL ==================== */}
      {isGameFinished && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-amber-300 shadow-2xl max-w-md mx-auto text-center space-y-5 animate-scale-up">
          <div className="w-18 h-18 rounded-3xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto border-2 border-amber-300 shadow-inner text-4xl animate-bounce">
            🏆
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-900">
              {gameScore >= 60 ? 'أحسنت يا بطل! 🎉' : 'محاولة رائعة! 🌟'}
            </h3>
            <p className="text-xs text-slate-500 font-bold">
              تم حفظ تقدمك ومكافآتك في حسابك بنجاح
            </p>
          </div>

          {/* Stats Badges */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-200 text-xs">
            <div>
              <span className="text-slate-400 block font-bold">النسبة</span>
              <span className="text-base font-black text-indigo-600">{gameScore}%</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">صحيح</span>
              <span className="text-base font-black text-emerald-600">{correctCount} ✅</span>
            </div>
            <div>
              <span className="text-slate-400 block font-bold">النجوم</span>
              <span className="text-base font-black text-amber-600">+{Math.max(3, correctCount * 2)} ⭐</span>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <button
              onClick={() => handleLaunchGame(activeGameId!)}
              className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-sm py-3.5 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>إعادة اللعب</span>
            </button>

            <button
              onClick={() => setActiveGameId(null)}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 rounded-2xl transition-all cursor-pointer"
            >
              العودة لقائمة الألعاب
            </button>
          </div>
        </div>
      )}

      {/* ==================== 12 GAMES GALLERY GRID ==================== */}
      {!activeGameId && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((g) => (
            <div
              key={g.id}
              onClick={() => handleLaunchGame(g.id)}
              className="bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-amber-400 hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div className="flex items-start justify-between gap-2 mb-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  {g.icon}
                </div>
                <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-full flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>+{g.starsReward}</span>
                </span>
              </div>

              <div>
                <h4 className="font-black text-slate-800 text-base group-hover:text-amber-600 transition-colors">
                  {g.titleAr}
                </h4>
                <p className="text-xs font-black text-amber-600 mb-1 font-display">
                  {g.titleEn}
                </p>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {g.descriptionAr}
                </p>
              </div>

              <button className="mt-4 w-full py-2.5 bg-slate-50 group-hover:bg-amber-500 group-hover:text-white text-slate-700 font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-2xs">
                <Play className="w-4 h-4 fill-current" />
                <span>العب الآن 🚀</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
