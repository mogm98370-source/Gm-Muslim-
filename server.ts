import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Lazy-initialize Gemini AI
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY is not set in environment. AI features will fallback to smart responses.');
    }
    geminiClient = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });
  }
  return geminiClient;
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'GM English API', time: new Date().toISOString() });
});

// AI Teacher Endpoint
app.post('/api/ai/teacher', async (req, res) => {
  try {
    const { message, childName, childAge, topic, level } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback friendly child response
      return res.json({
        replyEn: `Great job, ${childName || 'my friend'}! Let's practice saying: "I love learning English!" 🌟`,
        replyAr: `أحسنت يا بطل! لنتدرب معاً على نطق هذه الكلمة الجميلة 👏`,
        exercise: {
          word: 'Star',
          arabic: 'نجمة',
          emoji: '⭐',
          sentence: 'You are a shining star!'
        }
      });
    }

    const ai = getGeminiClient();
    const prompt = `You are Teacher Lily (المعلم الذكي), an enthusiastic, loving, cheerful kindergarten and early childhood English teacher in the "GM English" learning app.
Target student: A child named "${childName || 'Little Champion'}" around ${childAge || 5} years old.
Current Topic: "${topic || 'General Kindergarten English'}".
Difficulty Level: "${level || 'Beginner'}".

Student's input or question: "${message || 'Hello teacher!'}"

Respond in JSON format with:
1. "replyEn": A very short, encouraging, super cheerful sentence in simple English suited for a 4-7 year old child. (Max 15 words) with lots of friendly emojis.
2. "replyAr": A short, warm Arabic translation or encouraging Arabic sentence for the child.
3. "wordOfTheMoment": A single English word related to the conversation.
4. "wordArabic": The Arabic translation of that word.
5. "emoji": A matching emoji.
6. "practiceSentence": A 3-5 word super simple practice sentence for the child to repeat.
7. "starsAwarded": 1, 2, or 3.

Respond ONLY with valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const responseText = response.text || '{}';
    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      data = {
        replyEn: `Wonderful job, ${childName || 'friend'}! You are doing great! ⭐`,
        replyAr: `رائع جداً! أنت ذكي وتتعلم بسرعة 🌟`,
        wordOfTheMoment: 'Happy',
        wordArabic: 'سعيد',
        emoji: '😊',
        practiceSentence: 'I am very happy!',
        starsAwarded: 2
      };
    }

    return res.json(data);
  } catch (error: any) {
    console.error('Error in AI Teacher endpoint:', error);
    return res.json({
      replyEn: 'Hello little superstar! You are doing amazing! 🌟',
      replyAr: 'أهلاً بك يا بطل! أنت رائع ومميز جداً 👏',
      wordOfTheMoment: 'Sun',
      wordArabic: 'شمس',
      emoji: '☀️',
      practiceSentence: 'The sun is bright!',
      starsAwarded: 1
    });
  }
});

// AI Custom Mini-Story Generator
app.post('/api/ai/story', async (req, res) => {
  try {
    const { heroName, favoriteTopic } = req.body;
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.json({
        titleEn: `${heroName || 'Sam'} and the Magic Rainbow`,
        titleAr: `${heroName || 'سام'} وقوس قزح السحري`,
        emoji: '🌈✨',
        pages: [
          {
            pageNumber: 1,
            textEn: `${heroName || 'Sam'} looked outside and saw a colorful rainbow.`,
            textAr: `نظر ${heroName || 'سام'} من النافذة وشاهد قوس قزح مليئاً بالألوان.`,
            emoji: '🌈'
          },
          {
            pageNumber: 2,
            textEn: 'Red, yellow, blue, and green shone in the blue sky.',
            textAr: 'الأحمر والأصفر والأزرق والأخضر تلمع في السماء الزرقاء.',
            emoji: '☀️'
          },
          {
            pageNumber: 3,
            textEn: `${heroName || 'Sam'} clapped happily and said: "I love colors!"`,
            textAr: `صفق ${heroName || 'سام'} بفرح وقال: "أنا أحب الألوان!"`,
            emoji: '🎉'
          }
        ]
      });
    }

    const ai = getGeminiClient();
    const prompt = `Write a delightful 3-page bedtime or learning mini story for a kindergarten child.
Child's name: "${heroName || 'Sam'}"
Topic: "${favoriteTopic || 'Animals and Friendship'}"

Respond in JSON with:
{
  "titleEn": "...",
  "titleAr": "...",
  "emoji": "...",
  "pages": [
    { "pageNumber": 1, "textEn": "...", "textAr": "...", "emoji": "..." },
    { "pageNumber": 2, "textEn": "...", "textAr": "...", "emoji": "..." },
    { "pageNumber": 3, "textEn": "...", "textAr": "...", "emoji": "..." }
  ]
}
Ensure each page has only 1-2 simple, joyful sentences suitable for early learners. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json'
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate story' });
  }
});

// Vite middleware & Static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`GM English server is running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
