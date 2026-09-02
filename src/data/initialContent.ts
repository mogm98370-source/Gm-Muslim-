import { 
  LetterItem, 
  NumberItem, 
  ColorItem, 
  AnimalItem, 
  FruitItem, 
  ShapeItem, 
  BodyPartItem, 
  WordItem, 
  SentenceItem, 
  StoryItem, 
  SongItem, 
  GameItem, 
  DailyChallenge, 
  SubscriptionPlan,
  AppSettings,
  Badge
} from '../types';

export const initialLetters: LetterItem[] = [
  { id: 'letter-a', letter: 'A', lowercase: 'a', word: 'Apple', arabicWord: 'تفاحة', emoji: '🍎', phonetic: '/ˈæp.əl/', exampleSentence: 'The apple is red.', arabicSentence: 'التفاحة حمراء.', color: 'bg-red-500' },
  { id: 'letter-b', letter: 'B', lowercase: 'b', word: 'Ball', arabicWord: 'كرة', emoji: '⚽', phonetic: '/bɔːl/', exampleSentence: 'I have a blue ball.', arabicSentence: 'لدي كرة زرقاء.', color: 'bg-blue-500' },
  { id: 'letter-c', letter: 'C', lowercase: 'c', word: 'Cat', arabicWord: 'قطة', emoji: '🐱', phonetic: '/kæt/', exampleSentence: 'The cat says meow.', arabicSentence: 'القطة تقول مياو.', color: 'bg-amber-500' },
  { id: 'letter-d', letter: 'D', lowercase: 'd', word: 'Dog', arabicWord: 'كلب', emoji: '🐶', phonetic: '/dɒɡ/', exampleSentence: 'The dog is friendly.', arabicSentence: 'الكلب ودود ومرح.', color: 'bg-emerald-500' },
  { id: 'letter-e', letter: 'E', lowercase: 'e', word: 'Elephant', arabicWord: 'فيل', emoji: '🐘', phonetic: '/ˈel.ɪ.fənt/', exampleSentence: 'The elephant is big.', arabicSentence: 'الفيل كبير وضخم.', color: 'bg-indigo-500' },
  { id: 'letter-f', letter: 'F', lowercase: 'f', word: 'Fish', arabicWord: 'سمكة', emoji: '🐟', phonetic: '/fɪʃ/', exampleSentence: 'The fish swims in water.', arabicSentence: 'السمكة تسبح في الماء.', color: 'bg-teal-500' },
  { id: 'letter-g', letter: 'G', lowercase: 'g', word: 'Giraffe', arabicWord: 'زرافة', emoji: '🦒', phonetic: '/dʒɪˈrɑːf/', exampleSentence: 'The giraffe has a tall neck.', arabicSentence: 'الزرافة لها رقبة طويلة.', color: 'bg-yellow-500' },
  { id: 'letter-h', letter: 'H', lowercase: 'h', word: 'Horse', arabicWord: 'حصان', emoji: '🐴', phonetic: '/hɔːs/', exampleSentence: 'The horse runs fast.', arabicSentence: 'الحصان يجري بسرعة.', color: 'bg-orange-500' },
  { id: 'letter-i', letter: 'I', lowercase: 'i', word: 'Ice Cream', arabicWord: 'مثلجات', emoji: '🍦', phonetic: '/ˈaɪs ˌkriːm/', exampleSentence: 'I love sweet ice cream.', arabicSentence: 'أنا أحب الآيس كريم الحلو.', color: 'bg-pink-500' },
  { id: 'letter-j', letter: 'J', lowercase: 'j', word: 'Juice', arabicWord: 'عصير', emoji: '🧃', phonetic: '/dʒuːs/', exampleSentence: 'I drink orange juice.', arabicSentence: 'أنا أشرب عصير البرتقال.', color: 'bg-purple-500' },
  { id: 'letter-k', letter: 'K', lowercase: 'k', word: 'Kite', arabicWord: 'طائرة ورقية', emoji: '🪁', phonetic: '/kaɪt/', exampleSentence: 'The kite flies high.', arabicSentence: 'الطائرة الورقية تطير عالياً.', color: 'bg-cyan-500' },
  { id: 'letter-l', letter: 'L', lowercase: 'l', word: 'Lion', arabicWord: 'أسد', emoji: '🦁', phonetic: '/ˈlaɪ.ən/', exampleSentence: 'The lion is strong.', arabicSentence: 'الأسد ملك الغابة القوي.', color: 'bg-amber-600' },
  { id: 'letter-m', letter: 'M', lowercase: 'm', word: 'Monkey', arabicWord: 'قرد', emoji: '🐵', phonetic: '/ˈmʌŋ.ki/', exampleSentence: 'The monkey loves bananas.', arabicSentence: 'القرد يحب الموز.', color: 'bg-rose-500' },
  { id: 'letter-n', letter: 'N', lowercase: 'n', word: 'Nest', arabicWord: 'عش', emoji: '🪺', phonetic: '/nest/', exampleSentence: 'Birds build a nest.', arabicSentence: 'العصافير تبني العش.', color: 'bg-emerald-600', isPremium: true },
  { id: 'letter-o', letter: 'O', lowercase: 'o', word: 'Orange', arabicWord: 'برتقالة', emoji: '🍊', phonetic: '/ˈɒr.ɪndʒ/', exampleSentence: 'Oranges are delicious.', arabicSentence: 'البرتقال لذيذ ومفيد.', color: 'bg-orange-600', isPremium: true },
  { id: 'letter-p', letter: 'P', lowercase: 'p', word: 'Pencil', arabicWord: 'قلم رصاص', emoji: '✏️', phonetic: '/ˈpen.səl/', exampleSentence: 'I draw with my pencil.', arabicSentence: 'أنا أرسم بقلم الرصاص.', color: 'bg-yellow-600', isPremium: true },
  { id: 'letter-q', letter: 'Q', lowercase: 'q', word: 'Queen', arabicWord: 'ملكة', emoji: '👑', phonetic: '/kwiːn/', exampleSentence: 'The queen has a crown.', arabicSentence: 'الملكة ترتدي تاجاً ذهبياً.', color: 'bg-purple-600', isPremium: true },
  { id: 'letter-r', letter: 'R', lowercase: 'r', word: 'Rabbit', arabicWord: 'أرنب', emoji: '🐰', phonetic: '/ˈræb.ɪt/', exampleSentence: 'The rabbit hops happily.', arabicSentence: 'الأرنب يقفز بسعادة.', color: 'bg-pink-600', isPremium: true },
  { id: 'letter-s', letter: 'S', lowercase: 's', word: 'Sun', arabicWord: 'شمس', emoji: '☀️', phonetic: '/sʌn/', exampleSentence: 'The sun is bright and warm.', arabicSentence: 'الشمس مشرقة ودافئة.', color: 'bg-amber-400', isPremium: true },
  { id: 'letter-t', letter: 'T', lowercase: 't', word: 'Tree', arabicWord: 'شجرة', emoji: '🌳', phonetic: '/triː/', exampleSentence: 'The tree is tall and green.', arabicSentence: 'الشجرة خضراء وعالية.', color: 'bg-green-600', isPremium: true },
  { id: 'letter-u', letter: 'U', lowercase: 'u', word: 'Umbrella', arabicWord: 'مظلة', emoji: '☂️', phonetic: '/ʌmˈbrel.ə/', exampleSentence: 'Use the umbrella in rain.', arabicSentence: 'نستخدم المظلة عند المطر.', color: 'bg-sky-500', isPremium: true },
  { id: 'letter-v', letter: 'V', lowercase: 'v', word: 'Van', arabicWord: 'شاحنة صغيرة', emoji: '🚐', phonetic: '/væn/', exampleSentence: 'We ride the school van.', arabicSentence: 'نركب حافلة المدرسة.', color: 'bg-violet-500', isPremium: true },
  { id: 'letter-w', letter: 'W', lowercase: 'w', word: 'Watermelon', arabicWord: 'بطيخ', emoji: '🍉', phonetic: '/ˈwɔː.təˌmel.ən/', exampleSentence: 'Watermelon is sweet.', arabicSentence: 'البطيخ حلو ومنعش.', color: 'bg-red-600', isPremium: true },
  { id: 'letter-x', letter: 'X', lowercase: 'x', word: 'Xylophone', arabicWord: 'إكسيلوفون', emoji: '🎵', phonetic: '/ˈzaɪ.lə.fəʊn/', exampleSentence: 'I play the xylophone.', arabicSentence: 'أنا أعزف على الإكسيلوفون.', color: 'bg-fuchsia-500', isPremium: true },
  { id: 'letter-y', letter: 'Y', lowercase: 'y', word: 'Yo-yo', arabicWord: 'يويو', emoji: '🪀', phonetic: '/ˈjəʊ.jəʊ/', exampleSentence: 'I spin my yellow yo-yo.', arabicSentence: 'أنا ألعب باليويو الممتع.', color: 'bg-lime-500', isPremium: true },
  { id: 'letter-z', letter: 'Z', lowercase: 'z', word: 'Zebra', arabicWord: 'حمار وحشي', emoji: '🦓', phonetic: '/ˈzeb.rə/', exampleSentence: 'The zebra has black stripes.', arabicSentence: 'الحمار الوحشي له خطوط جميلة.', color: 'bg-slate-700', isPremium: true }
];

export const initialNumbers: NumberItem[] = [
  { id: 'num-1', number: 1, word: 'One', arabicWord: 'واحد', countEmoji: '⭐', color: 'from-amber-400 to-orange-500' },
  { id: 'num-2', number: 2, word: 'Two', arabicWord: 'اثنان', countEmoji: '⭐⭐', color: 'from-blue-400 to-indigo-500' },
  { id: 'num-3', number: 3, word: 'Three', arabicWord: 'ثلاثة', countEmoji: '⭐⭐⭐', color: 'from-emerald-400 to-teal-500' },
  { id: 'num-4', number: 4, word: 'Four', arabicWord: 'أربعة', countEmoji: '🍎🍎🍎🍎', color: 'from-rose-400 to-red-500' },
  { id: 'num-5', number: 5, word: 'Five', arabicWord: 'خمسة', countEmoji: '✋', color: 'from-purple-400 to-indigo-600' },
  { id: 'num-6', number: 6, word: 'Six', arabicWord: 'ستة', countEmoji: '🎲🎲🎲🎲🎲🎲', color: 'from-sky-400 to-cyan-600' },
  { id: 'num-7', number: 7, word: 'Seven', arabicWord: 'سبعة', countEmoji: '🌈🌈🌈🌈🌈🌈🌈', color: 'from-fuchsia-400 to-pink-500' },
  { id: 'num-8', number: 8, word: 'Eight', arabicWord: 'ثمانية', countEmoji: '🎈🎈🎈🎈🎈🎈🎈🎈', color: 'from-lime-400 to-green-600' },
  { id: 'num-9', number: 9, word: 'Nine', arabicWord: 'تسعة', countEmoji: '🐱🐱🐱🐱🐱🐱🐱🐱🐱', color: 'from-yellow-400 to-amber-600' },
  { id: 'num-10', number: 10, word: 'Ten', arabicWord: 'عشرة', countEmoji: '🎉🎉🎉🎉🎉🎉🎉🎉🎉🎉', color: 'from-teal-400 to-emerald-600' },
  { id: 'num-11', number: 11, word: 'Eleven', arabicWord: 'أحد عشر', countEmoji: '⭐', color: 'from-blue-500 to-indigo-700', isPremium: true },
  { id: 'num-12', number: 12, word: 'Twelve', arabicWord: 'اثنا عشر', countEmoji: '⭐', color: 'from-violet-500 to-purple-700', isPremium: true },
  { id: 'num-13', number: 13, word: 'Thirteen', arabicWord: 'ثلاثة عشر', countEmoji: '⭐', color: 'from-pink-500 to-rose-700', isPremium: true },
  { id: 'num-14', number: 14, word: 'Fourteen', arabicWord: 'أربعة عشر', countEmoji: '⭐', color: 'from-amber-500 to-orange-700', isPremium: true },
  { id: 'num-15', number: 15, word: 'Fifteen', arabicWord: 'خمسة عشر', countEmoji: '⭐', color: 'from-emerald-500 to-teal-700', isPremium: true },
  { id: 'num-16', number: 16, word: 'Sixteen', arabicWord: 'ستة عشر', countEmoji: '⭐', color: 'from-cyan-500 to-blue-700', isPremium: true },
  { id: 'num-17', number: 17, word: 'Seventeen', arabicWord: 'سبعة عشر', countEmoji: '⭐', color: 'from-fuchsia-500 to-purple-800', isPremium: true },
  { id: 'num-18', number: 18, word: 'Eighteen', arabicWord: 'ثمانية عشر', countEmoji: '⭐', color: 'from-red-500 to-rose-800', isPremium: true },
  { id: 'num-19', number: 19, word: 'Nineteen', arabicWord: 'تسعة عشر', countEmoji: '⭐', color: 'from-lime-500 to-green-800', isPremium: true },
  { id: 'num-20', number: 20, word: 'Twenty', arabicWord: 'عشرون', countEmoji: '👑', color: 'from-amber-400 to-yellow-600', isPremium: true }
];

export const initialColors: ColorItem[] = [
  { id: 'color-red', name: 'Red', arabicName: 'أحمر', hex: '#EF4444', textColor: 'text-white', exampleItem: 'Apple', emoji: '🍎' },
  { id: 'color-blue', name: 'Blue', arabicName: 'أزرق', hex: '#3B82F6', textColor: 'text-white', exampleItem: 'Sky', emoji: '🌊' },
  { id: 'color-green', name: 'Green', arabicName: 'أخضر', hex: '#10B981', textColor: 'text-white', exampleItem: 'Leaf', emoji: '🍃' },
  { id: 'color-yellow', name: 'Yellow', arabicName: 'أصفر', hex: '#FACC15', textColor: 'text-slate-900', exampleItem: 'Sun', emoji: '☀️' },
  { id: 'color-orange', name: 'Orange', arabicName: 'برتقالي', hex: '#F97316', textColor: 'text-white', exampleItem: 'Orange fruit', emoji: '🍊' },
  { id: 'color-pink', name: 'Pink', arabicName: 'وردي', hex: '#EC4899', textColor: 'text-white', exampleItem: 'Flower', emoji: '🌸' },
  { id: 'color-purple', name: 'Purple', arabicName: 'بنفسجي', hex: '#8B5CF6', textColor: 'text-white', exampleItem: 'Grapes', emoji: '🍇' },
  { id: 'color-black', name: 'Black', arabicName: 'أسود', hex: '#1E293B', textColor: 'text-white', exampleItem: 'Night', emoji: '🐈‍⬛' },
  { id: 'color-white', name: 'White', arabicName: 'أبيض', hex: '#F8FAFC', textColor: 'text-slate-800', exampleItem: 'Snow', emoji: '⛄' },
  { id: 'color-brown', name: 'Brown', arabicName: 'بني', hex: '#78350F', textColor: 'text-white', exampleItem: 'Chocolate', emoji: '🍫' }
];

export const initialAnimals: AnimalItem[] = [
  { id: 'animal-dog', name: 'Dog', arabicName: 'كلب', emoji: '🐶', sound: 'Woof woof!', category: 'pets' },
  { id: 'animal-cat', name: 'Cat', arabicName: 'قطة', emoji: '🐱', sound: 'Meow meow!', category: 'pets' },
  { id: 'animal-lion', name: 'Lion', arabicName: 'أسد', emoji: '🦁', sound: 'Roaaar!', category: 'wild' },
  { id: 'animal-elephant', name: 'Elephant', arabicName: 'فيل', emoji: '🐘', sound: 'Pawoo!', category: 'wild' },
  { id: 'animal-monkey', name: 'Monkey', arabicName: 'قرد', emoji: '🐵', sound: 'Ooh ooh aah aah!', category: 'wild' },
  { id: 'animal-bird', name: 'Bird', arabicName: 'طائر', emoji: '🐦', sound: 'Chirp chirp!', category: 'nature' },
  { id: 'animal-fish', name: 'Fish', arabicName: 'سمكة', emoji: '🐠', sound: 'Glub glub!', category: 'sea' },
  { id: 'animal-horse', name: 'Horse', arabicName: 'حصان', emoji: '🐴', sound: 'Neigh neigh!', category: 'farm' },
  { id: 'animal-bear', name: 'Bear', arabicName: 'دب', emoji: '🐻', sound: 'Grrr!', category: 'wild', isPremium: true },
  { id: 'animal-duck', name: 'Duck', arabicName: 'بطة', emoji: '🦆', sound: 'Quack quack!', category: 'farm', isPremium: true },
  { id: 'animal-rabbit', name: 'Rabbit', arabicName: 'أرنب', emoji: '🐰', sound: 'Squeak squeak!', category: 'pets', isPremium: true },
  { id: 'animal-sheep', name: 'Sheep', arabicName: 'خروف', emoji: '🐑', sound: 'Baa baa!', category: 'farm', isPremium: true }
];

export const initialFruits: FruitItem[] = [
  { id: 'fruit-apple', name: 'Apple', arabicName: 'تفاحة', emoji: '🍎', color: '#EF4444', tasteAr: 'حلوة ومقرمشة' },
  { id: 'fruit-banana', name: 'Banana', arabicName: 'موزة', emoji: '🍌', color: '#FACC15', tasteAr: 'لذيذة ومغذية' },
  { id: 'fruit-orange', name: 'Orange', arabicName: 'برتقالة', emoji: '🍊', color: '#F97316', tasteAr: 'غنية بفيتامين سي' },
  { id: 'fruit-mango', name: 'Mango', arabicName: 'مانجو', emoji: '🥭', color: '#F59E0B', tasteAr: 'حلوة وعصيرية' },
  { id: 'fruit-strawberry', name: 'Strawberry', arabicName: 'فراولة', emoji: '🍓', color: '#E11D48', tasteAr: 'جميلة وحمراء' },
  { id: 'fruit-watermelon', name: 'Watermelon', arabicName: 'بطيخ', emoji: '🍉', color: '#10B981', tasteAr: 'منعش في الصيف' },
  { id: 'fruit-grapes', name: 'Grapes', arabicName: 'عنب', emoji: '🍇', color: '#8B5CF6', tasteAr: 'حبات حلوة ولذيذة', isPremium: true },
  { id: 'fruit-pineapple', name: 'Pineapple', arabicName: 'أناناس', emoji: '🍍', color: '#EAB308', tasteAr: 'استوائي ومنعش', isPremium: true },
  { id: 'fruit-peach', name: 'Peach', arabicName: 'خوخ', emoji: '🍑', color: '#FB923C', tasteAr: 'طري ولذيذ', isPremium: true },
  { id: 'fruit-cherry', name: 'Cherry', arabicName: 'كرز', emoji: '🍒', color: '#BE123C', tasteAr: 'حبات صغيرة حلوة', isPremium: true }
];

export const initialShapes: ShapeItem[] = [
  { id: 'shape-circle', name: 'Circle', arabicName: 'دائرة', emoji: '⭕', sides: 0, color: 'text-rose-500' },
  { id: 'shape-square', name: 'Square', arabicName: 'مربع', emoji: '🟦', sides: 4, color: 'text-blue-500' },
  { id: 'shape-triangle', name: 'Triangle', arabicName: 'مثلث', emoji: '🔺', sides: 3, color: 'text-amber-500' },
  { id: 'shape-rectangle', name: 'Rectangle', arabicName: 'مستطيل', emoji: '🟩', sides: 4, color: 'text-emerald-500' },
  { id: 'shape-star', name: 'Star', arabicName: 'نجمة', emoji: '⭐', sides: 5, color: 'text-yellow-400' },
  { id: 'shape-heart', name: 'Heart', arabicName: 'قلب', emoji: '❤️', sides: 0, color: 'text-red-500' },
  { id: 'shape-diamond', name: 'Diamond', arabicName: 'معين', emoji: '💎', sides: 4, color: 'text-cyan-500', isPremium: true },
  { id: 'shape-oval', name: 'Oval', arabicName: 'بيضاوي', emoji: '🥚', sides: 0, color: 'text-purple-500', isPremium: true }
];

export const initialBodyParts: BodyPartItem[] = [
  { id: 'body-head', name: 'Head', arabicName: 'رأس', emoji: '👦', descriptionAr: 'في الرأس يوجد العقل والعينين والفم' },
  { id: 'body-eyes', name: 'Eyes', arabicName: 'عينان', emoji: '👀', descriptionAr: 'نرى بها الأشياء الجميلة والألوان' },
  { id: 'body-ears', name: 'Ears', arabicName: 'أذنان', emoji: '👂', descriptionAr: 'نسمع بها الأصوات والقصص' },
  { id: 'body-nose', name: 'Nose', arabicName: 'أنف', emoji: '👃', descriptionAr: 'نشم به الزهور والأطعمة اللذيذة' },
  { id: 'body-mouth', name: 'Mouth', arabicName: 'فم', emoji: '👄', descriptionAr: 'نتكلم ونبتسم به ونأكل الطعام' },
  { id: 'body-hand', name: 'Hand', arabicName: 'يد', emoji: '✋', descriptionAr: 'نكتب ونرسم ونلعب بأيدينا' },
  { id: 'body-foot', name: 'Foot', arabicName: 'قدم', emoji: '🦶', descriptionAr: 'نمشي ونجري ونقفز بأقدامنا' },
  { id: 'body-arm', name: 'Arm', arabicName: 'ذراع', emoji: '💪', descriptionAr: 'نحمل به الأشياء ونعانق أحبابنا', isPremium: true }
];

export const initialWords: WordItem[] = [
  // Family
  { id: 'w-father', category: 'family', categoryAr: 'العائلة', english: 'Father', arabic: 'أب', emoji: '👨' },
  { id: 'w-mother', category: 'family', categoryAr: 'العائلة', english: 'Mother', arabic: 'أم', emoji: '👩' },
  { id: 'w-brother', category: 'family', categoryAr: 'العائلة', english: 'Brother', arabic: 'أخ', emoji: '👦' },
  { id: 'w-sister', category: 'family', categoryAr: 'العائلة', english: 'Sister', arabic: 'أخت', emoji: '👧' },
  { id: 'w-baby', category: 'family', categoryAr: 'العائلة', english: 'Baby', arabic: 'طفل رضيع', emoji: '👶' },
  { id: 'w-grandpa', category: 'family', categoryAr: 'العائلة', english: 'Grandfather', arabic: 'جد', emoji: '👴', isPremium: true },
  { id: 'w-grandma', category: 'family', categoryAr: 'العائلة', english: 'Grandmother', arabic: 'جدة', emoji: '👵', isPremium: true },

  // Food
  { id: 'w-bread', category: 'food', categoryAr: 'الطعام', english: 'Bread', arabic: 'خبز', emoji: '🍞' },
  { id: 'w-milk', category: 'food', categoryAr: 'الطعام', english: 'Milk', arabic: 'حليب', emoji: '🥛' },
  { id: 'w-egg', category: 'food', categoryAr: 'الطعام', english: 'Egg', arabic: 'بيضة', emoji: '🥚' },
  { id: 'w-cheese', category: 'food', categoryAr: 'الطعام', english: 'Cheese', arabic: 'جبن', emoji: '🧀' },
  { id: 'w-cake', category: 'food', categoryAr: 'الطعام', english: 'Cake', arabic: 'كعكة', emoji: '🎂' },

  // School
  { id: 'w-book', category: 'school', categoryAr: 'المدرسة', english: 'Book', arabic: 'كتاب', emoji: '📖' },
  { id: 'w-pencil', category: 'school', categoryAr: 'المدرسة', english: 'Pencil', arabic: 'قلم رصاص', emoji: '✏️' },
  { id: 'w-bag', category: 'school', categoryAr: 'المدرسة', english: 'Bag', arabic: 'حقيبة', emoji: '🎒' },
  { id: 'w-desk', category: 'school', categoryAr: 'المدرسة', english: 'Desk', arabic: 'مكتب', emoji: '🪑' },
  { id: 'w-eraser', category: 'school', categoryAr: 'المدرسة', english: 'Eraser', arabic: 'ممحاة', emoji: '🧼', isPremium: true },

  // Toys
  { id: 'w-car', category: 'toys', categoryAr: 'الألعاب', english: 'Toy Car', arabic: 'سيارة لعبة', emoji: '🚗' },
  { id: 'w-doll', category: 'toys', categoryAr: 'الألعاب', english: 'Doll', arabic: 'دمية', emoji: '🪆' },
  { id: 'w-ball', category: 'toys', categoryAr: 'الألعاب', english: 'Ball', arabic: 'كرة', emoji: '⚽' },
  { id: 'w-teddy', category: 'toys', categoryAr: 'الألعاب', english: 'Teddy Bear', arabic: 'دبدوب', emoji: '🧸' },
  { id: 'w-robot', category: 'toys', categoryAr: 'الألعاب', english: 'Robot', arabic: 'روبوت', emoji: '🤖', isPremium: true },

  // Clothes
  { id: 'w-shirt', category: 'clothes', categoryAr: 'الملابس', english: 'Shirt', arabic: 'قميص', emoji: '👕' },
  { id: 'w-dress', category: 'clothes', categoryAr: 'الملابس', english: 'Dress', arabic: 'فستان', emoji: '👗' },
  { id: 'w-hat', category: 'clothes', categoryAr: 'الملابس', english: 'Hat', arabic: 'قبعة', emoji: '🧢' },
  { id: 'w-shoes', category: 'clothes', categoryAr: 'الملابس', english: 'Shoes', arabic: 'حذاء', emoji: '👟' },

  // Home
  { id: 'w-door', category: 'home', categoryAr: 'المنزل', english: 'Door', arabic: 'باب', emoji: '🚪' },
  { id: 'w-window', category: 'home', categoryAr: 'المنزل', english: 'Window', arabic: 'نافذة', emoji: '🪟' },
  { id: 'w-bed', category: 'home', categoryAr: 'المنزل', english: 'Bed', arabic: 'سرير', emoji: '🛏️' },
  { id: 'w-lamp', category: 'home', categoryAr: 'المنزل', english: 'Lamp', arabic: 'مصباح', emoji: '💡' },

  // Nature
  { id: 'w-sun', category: 'nature', categoryAr: 'الطبيعة', english: 'Sun', arabic: 'شمس', emoji: '☀️' },
  { id: 'w-moon', category: 'nature', categoryAr: 'الطبيعة', english: 'Moon', arabic: 'قمر', emoji: '🌙' },
  { id: 'w-star', category: 'nature', categoryAr: 'الطبيعة', english: 'Star', arabic: 'نجمة', emoji: '⭐' },
  { id: 'w-cloud', category: 'nature', categoryAr: 'الطبيعة', english: 'Cloud', arabic: 'سحابة', emoji: '☁️' },
  { id: 'w-flower', category: 'nature', categoryAr: 'الطبيعة', english: 'Flower', arabic: 'زهرة', emoji: '🌸' },

  // Transport
  { id: 'w-bus', category: 'transport', categoryAr: 'المواصلات', english: 'Bus', arabic: 'حافلة', emoji: '🚌' },
  { id: 'w-train', category: 'transport', categoryAr: 'المواصلات', english: 'Train', arabic: 'قطار', emoji: '🚆' },
  { id: 'w-plane', category: 'transport', categoryAr: 'المواصلات', english: 'Airplane', arabic: 'طائرة', emoji: '✈️' },
  { id: 'w-boat', category: 'transport', categoryAr: 'المواصلات', english: 'Boat', arabic: 'قارب', emoji: '⛵', isPremium: true }
];

export const initialSentences: SentenceItem[] = [
  { id: 'sent-1', english: 'Hello! Good morning.', arabic: 'مرحباً! صباح الخير.', emoji: '👋', difficulty: 'easy' },
  { id: 'sent-2', english: 'What is your name?', arabic: 'ما اسمك؟', emoji: '❓', difficulty: 'easy' },
  { id: 'sent-3', english: 'My name is GM.', arabic: 'اسمي جي إم.', emoji: '🌟', difficulty: 'easy' },
  { id: 'sent-4', english: 'How are you today?', arabic: 'كيف حالك اليوم؟', emoji: '😊', difficulty: 'easy' },
  { id: 'sent-5', english: 'I am very happy!', arabic: 'أنا سعيد جداً!', emoji: '🎉', difficulty: 'easy' },
  { id: 'sent-6', english: 'I love my family.', arabic: 'أنا أحب عائلتي.', emoji: '❤️', difficulty: 'easy' },
  { id: 'sent-7', english: 'Look at the cute cat.', arabic: 'انظر إلى القطة اللطيفة.', emoji: '🐱', difficulty: 'easy' },
  { id: 'sent-8', english: 'I can count to ten.', arabic: 'أستطيع أن أعد حتى عشرة.', emoji: '🔢', difficulty: 'easy' },
  { id: 'sent-9', english: 'This apple is red and sweet.', arabic: 'هذه التفاحة حمراء وحلوة.', emoji: '🍎', difficulty: 'medium', isPremium: true },
  { id: 'sent-10', english: 'Let us play together.', arabic: 'دعونا نلعب معاً.', emoji: '🤝', difficulty: 'medium', isPremium: true },
  { id: 'sent-11', english: 'The sun shines in the sky.', arabic: 'الشمس تشرق في السماء.', emoji: '☀️', difficulty: 'medium', isPremium: true },
  { id: 'sent-12', english: 'Thank you very much!', arabic: 'شكراً جزيلاً لك!', emoji: '💐', difficulty: 'easy', isPremium: true }
];

export const initialStories: StoryItem[] = [
  {
    id: 'story-1',
    titleEn: 'The Little Cat & The Big Ball',
    titleAr: 'القطة الصغيرة والكرة الكبيرة',
    coverEmoji: '🐱⚽',
    emoji: '🐱⚽',
    summaryAr: 'قصة لطيفة عن قطة تبحث عن كرتها وتلتقي بأصدقائها في الحديقة.',
    moralAr: 'التعاون والصداقة يجعلان الحياة أكثر سعادة ومرحاً.',
    sentences: [
      { english: 'Once upon a time, there was a little white cat named Mimi.', arabic: 'كان يا ما كان، كان هناك قطة بيضاء صغيرة اسمها ميمي.' },
      { english: 'Mimi had a bright red ball. She loved to play with it every day.', arabic: 'كان لدى ميمي كرة حمراء لامعة، كانت تحب اللعب بها كل يوم.' },
      { english: 'One morning, the red ball rolled into the green garden!', arabic: 'في أحد الصباحات، تدحرجت الكرة الحمراء داخل الحديقة الخضراء!' },
      { english: 'A friendly dog named Max found the ball and gave it back to Mimi.', arabic: 'وجد الكلب الودود ماكس الكرة وأعادها إلى ميمي بسعادة.' },
      { english: 'Mimi and Max became best friends. They played together happily!', arabic: 'أصبحت ميمي وماكس أفضل صديقين، ولعبا معاً بفرح وسرور!' }
    ],
    quiz: [
      {
        questionAr: 'ما اسم القطة الصغيرة في القصة؟',
        options: ['Mimi', 'Max', 'Sam', 'Leo'],
        correctIndex: 0
      },
      {
        questionAr: 'ما هو لون كرة ميمي؟',
        options: ['Blue', 'Red', 'Yellow', 'Black'],
        correctIndex: 1
      },
      {
        questionAr: 'من ساعد ميمي في إيجاد كرتها؟',
        options: ['A bird', 'Max the dog', 'A lion', 'A fish'],
        correctIndex: 1
      }
    ]
  },
  {
    id: 'story-2',
    titleEn: 'Colors in the Garden',
    titleAr: 'الألوان في الحديقة الجميلة',
    coverEmoji: '🌸🦋',
    emoji: '🌸🦋',
    summaryAr: 'رحلة فراشة صغيرة تكتشف ألوان الأزهار والفواكه المبهجة.',
    moralAr: 'العالم جميل ومليء بالألوان الرائعة.',
    sentences: [
      { english: 'Bella the butterfly loved flying under the warm yellow sun.', arabic: 'بيلا الفراشة كانت تحب الطيران تحت أشعة الشمس الصفراء الدافئة.' },
      { english: 'She landed on a red rose and smelled its sweet scent.', arabic: 'هبطت على وردة حمراء وشمت رائحتها الزكية.' },
      { english: 'Then, she flew over blue bells and green grass.', arabic: 'ثم حلقت فوق زهور زرقاء وعشب أخضر ناعم.' },
      { english: 'The world is full of wonderful bright colors!', arabic: 'العالم مليء بالألوان الزاهية والرائعة!' }
    ],
    quiz: [
      {
        questionAr: 'ماذا كانت بيلا؟',
        options: ['A bird', 'A butterfly', 'A cat', 'A fish'],
        correctIndex: 1
      },
      {
        questionAr: 'ما لون الشمس الدافئة؟',
        options: ['Yellow', 'Green', 'Purple', 'Black'],
        correctIndex: 0
      }
    ],
    isPremium: true
  }
];

export const initialSongs: SongItem[] = [
  {
    id: 'song-abc',
    titleEn: 'The ABC Song',
    titleAr: 'أنشودة الحروف الإنجليزية',
    category: 'letters',
    emoji: '🔤',
    durationSec: 45,
    lyrics: [
      'A B C D E F G',
      'H I J K L M N O P',
      'Q R S and T U V',
      'W X and Y and Z',
      'Now I know my ABCs!',
      'Next time won\'t you sing with me?'
    ]
  },
  {
    id: 'song-numbers',
    titleEn: 'One Two, Buckle My Shoe',
    titleAr: 'أنشودة الأرقام المرحة',
    category: 'numbers',
    emoji: '🔢',
    durationSec: 40,
    lyrics: [
      'One, two, buckle my shoe,',
      'Three, four, shut the door,',
      'Five, six, pick up sticks,',
      'Seven, eight, lay them straight,',
      'Nine, ten, a big fat hen!'
    ]
  },
  {
    id: 'song-colors',
    titleEn: 'Rainbow Colors Song',
    titleAr: 'أنشودة قوس قزح والألوان',
    category: 'colors',
    emoji: '🌈',
    durationSec: 35,
    lyrics: [
      'Red and yellow, green and blue,',
      'Purple, orange, pink too!',
      'I see colors everywhere,',
      'In the rainbow up in the air!'
    ],
    isPremium: true
  }
];

export const initialGames: GameItem[] = [
  {
    id: 'match-letter-cases',
    titleAr: 'وصل الحروف (كبير وصغير)',
    titleEn: 'Match Upper & Lowercase',
    icon: '🔗',
    category: 'letters',
    descriptionAr: 'صل الحرف الكبير بالحرف الصغير المطابق له (A → a).',
    starsReward: 5
  },
  {
    id: 'match-letter-picture',
    titleAr: 'وصل الحرف بالصورة',
    titleEn: 'Match Letter to Picture',
    icon: '🖼️',
    category: 'letters',
    descriptionAr: 'صل الحرف بالصورة المناسبة التي تبدأ به (A → 🍎 Apple).',
    starsReward: 5
  },
  {
    id: 'match-letter-word',
    titleAr: 'وصل الحرف بالكلمة',
    titleEn: 'Match Letter to Word',
    icon: '🔤',
    category: 'words',
    descriptionAr: 'صل الحرف الأول بالكلمة الإنجليزية الصحيحة (B → Ball).',
    starsReward: 5
  },
  {
    id: 'match-color-name',
    titleAr: 'وصل اللون بالاسم',
    titleEn: 'Match Color to Name',
    icon: '🎨',
    category: 'colors',
    descriptionAr: 'صل اللون المبهج باسمه الإنجليزي الصحيح.',
    starsReward: 5
  },
  {
    id: 'match-number-count',
    titleAr: 'وصل الرقم بالعدد',
    titleEn: 'Match Number to Count',
    icon: '🔢',
    category: 'numbers',
    descriptionAr: 'صل الرقم بعدد الأشكال والعناصر المعروضة (3 → ⭐⭐⭐).',
    starsReward: 5
  },
  {
    id: 'tap-the-letter',
    titleAr: 'اضغط على الحرف المطلوب',
    titleEn: 'Tap the Letter',
    icon: '🎯',
    category: 'letters',
    descriptionAr: 'استمع للحرف المطلوب واضغط عليه بسرعة بين الحروف السابحة.',
    starsReward: 5
  },
  {
    id: 'word-builder',
    titleAr: 'كوّن الكلمة',
    titleEn: 'Word Builder Scramble',
    icon: '🧩',
    category: 'words',
    descriptionAr: 'رتب الحروف المبعثرة بالترتيب الصحيح لتكوين الكلمة (A + P + P + L + E).',
    starsReward: 5
  },
  {
    id: 'memory-cards',
    titleAr: 'لعبة الذاكرة الذكية',
    titleEn: 'Memory Matching Cards',
    icon: '🧠',
    category: 'memory',
    descriptionAr: 'اقلب البطاقات وطابق بين صورة الكائن واسمه الإنجليزي.',
    starsReward: 5
  },
  {
    id: 'listen-and-choose',
    titleAr: 'اسمع واختر الصورة',
    titleEn: 'Listen & Pick Image',
    icon: '🎧',
    category: 'listening',
    descriptionAr: 'استمع لنطق الكلمة الإنجليزية واختر الصورة المطابقة لها.',
    starsReward: 5
  },
  {
    id: 'count-and-pop',
    titleAr: 'فرقعة البالونات',
    titleEn: 'Balloon Pop Counter',
    icon: '🎈',
    category: 'numbers',
    descriptionAr: 'فرقع البالونات التي تحتوي على الحروف والأرقام الصحيحة.',
    starsReward: 5
  },
  {
    id: 'letter-trace',
    titleAr: 'اكتب وارسم الحرف',
    titleEn: 'Letter Tracing Studio',
    icon: '✏️',
    category: 'writing',
    descriptionAr: 'تتبع خطوط الحرف بإصبعك على الشاشة لتعلم كتابته بدقة.',
    starsReward: 5,
    isPremium: true
  },
  {
    id: 'speed-challenge',
    titleAr: 'التحدي السريع',
    titleEn: 'Speed Challenge',
    icon: '⚡',
    category: 'challenge',
    descriptionAr: 'أجب عن أكبر عدد من الأسئلة قبل انتهاء الوقت واجمع النجوم الذهبية!',
    starsReward: 10,
    isPremium: true
  }
];

export const defaultDailyChallenges: DailyChallenge[] = [
  {
    id: 'dc-1',
    titleAr: 'تعلم 5 كلمات جديدة',
    titleEn: 'Learn 5 New Words',
    descriptionAr: 'استمع وتعرف على 5 كلمات جديدة اليوم للحصول على مكافأتك!',
    targetCount: 5,
    currentCount: 0,
    rewardStars: 10,
    rewardPoints: 50,
    completed: false,
    type: 'words'
  },
  {
    id: 'dc-2',
    titleAr: 'اكتب حرفين بالإصبع',
    titleEn: 'Trace 2 Letters',
    descriptionAr: 'تتبع واكتب حرفين من الحروف الإنجليزية في استوديو الكتابة.',
    targetCount: 2,
    currentCount: 0,
    rewardStars: 8,
    rewardPoints: 40,
    completed: false,
    type: 'trace'
  },
  {
    id: 'dc-3',
    titleAr: 'العب لعبة تعليمية',
    titleEn: 'Play a Learning Game',
    descriptionAr: 'أكمل جولة واحدة في أي لعبة من ألعاب GM English.',
    targetCount: 1,
    currentCount: 0,
    rewardStars: 12,
    rewardPoints: 60,
    completed: false,
    type: 'game'
  }
];

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'monthly',
    nameAr: 'الاشتراك الشهري',
    nameEn: 'Monthly Pass',
    price: '$4.99',
    priceUSD: 4.99,
    periodAr: 'شهرياً',
    interval: 'monthly',
    featuresAr: [
      'فتح جميع الحروف (A-Z) كاملة',
      'فتح جميع الأرقام (1-20)',
      'المعلم الذكي Gemini AI للأطفال',
      'جميع الألعاب التعليمية الـ 12',
      'بدون إعلانات نهائياً'
    ],
    active: true
  },
  {
    id: 'yearly',
    nameAr: 'الاشتراك السنوي (الأكثر طلباً ⭐)',
    nameEn: 'Annual Champion',
    price: '$29.99',
    priceUSD: 29.99,
    periodAr: 'سنوياً',
    interval: 'yearly',
    isPopular: true,
    featuresAr: [
      'جميع مزايا الباقة الشهرية',
      'توليد القصص بالذكاء الاصطناعي',
      'شهادات إنجاز وبطاقات قابلة للطباعة',
      'توفير 50% مقارنة بالدفع الشهري',
      'دعم فني خاص لأولياء الأمور'
    ],
    active: true
  },
  {
    id: 'lifetime',
    nameAr: 'العضوية الذهبية الدائمة',
    nameEn: 'Lifetime VIP',
    price: '$59.99',
    priceUSD: 59.99,
    periodAr: 'مدى الحياة',
    interval: 'lifetime',
    featuresAr: [
      'وصول دائم لجميع التحديثات المستقبلية',
      'تفعيل لجميع أجهزة العائلة',
      'جميع ميزات GM English بلا حدود'
    ],
    active: true
  }
];

// Aliases for uppercase compatibility
export const INITIAL_LETTERS = initialLetters;
export const INITIAL_NUMBERS = initialNumbers;
export const INITIAL_COLORS = initialColors;
export const INITIAL_ANIMALS = initialAnimals;
export const INITIAL_FRUITS = initialFruits;
export const INITIAL_SHAPES = initialShapes;
export const INITIAL_BODY_PARTS = initialBodyParts;
export const INITIAL_WORDS = initialWords;
export const INITIAL_SENTENCES = initialSentences;
export const INITIAL_STORIES = initialStories;
export const INITIAL_SONGS = initialSongs;
export const INITIAL_GAMES = initialGames;
export const INITIAL_DAILY_CHALLENGES = defaultDailyChallenges;
export const INITIAL_PLANS = subscriptionPlans;
