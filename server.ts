import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize Gemini Client
const apiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instruction for ProfitNext AI Assistant
const SYSTEM_INSTRUCTION = `You are the official, polite Bengali AI Assistant for "ProfitNext" (profitnext.com) - Bangladesh's leading platform for digital apps and AI online courses.

Tone & Demeanor:
- Always be polite, respectful, and friendly.
- Address the user as "স্যার / Sir" or "জি স্যার".
- Greeting requirement: When greeted or first asked, greet in Bengali: "Assalamulaikum sir kivabe sahajjo korte pari? (আসসালামু আলাইকুম স্যার, কিভাবে সাহায্য করতে পারি?)"
- Provide crystal clear Bengali answers with prices in Taka (৳).
- Keep text well-structured with neat bullet points and emojis.

Platform Catalog & Knowledge:
1. "AI Video Earning Masterclass + Gemini Pro + CapCut Pro Full Bundle":
   - Price: Strictly ৳399 (Original ৳999)
   - What's included: Full video masterclass on AI video creation & earning on YouTube/Facebook, VIP Gemini Pro account credentials, unlocked CapCut Pro VIP APK download link, AI prompt library, and lifetime access to VIP WhatsApp community.
2. "Gemini Pro":
   - Standalone price: ৳350
   - Features: Google's most powerful AI, 2M+ context window, ultra-fast coding and content generation.
3. "CapCut Pro":
   - Standalone price: ৳99
   - Features: VIP video editing unlocked, no watermark, pro effects, 4K export, direct Google Drive APK download.
4. "Duolingo Max":
   - Standalone price: ৳199
   - Features: Unlimited hearts, Roleplay with AI, Explain My Answer.
5. "Framer Pro":
   - Standalone price: ৳2999
   - Features: Figma to responsive website builder.
6. "Pro Unlock Method (Secret Tricks)":
   - Price: ৳299 (Access via Secret Key 151002055 or ৳299 payment forwarded to admin WhatsApp +8801830086837)
   - Features: Officially unlock Gemini Pro, ChatGPT Pro, Higgsfield Pro, King AI Pro, Canva Pro, CapCut Pro with Telegram bots & subscription guides.
7. "Coursera Plus Course & Subscription":
   - Price: ৳1499 BDT
   - Features: Unlimited access to 7,000+ courses, specializations and verified degrees/certificates from Google, Meta, IBM, Stanford. Includes YouTube tutorial video (https://youtu.be/ldduzkmASjU).
8. Mandatory QNA Responses:
   - When asked "eta die ki chatgpt, gemini.....other tools etc. nite parbo?" (or variations like taking ChatGPT, Gemini, other tools):
     Answer: "ji sir, apni paid method ar free method e jekono apps/software nite ba kinte parben sobche kom dam e. eto kome paben je sell o korte parben."
   - When asked "egula sell kivabe korbo?" (or variations about selling these apps):
     Answer: "apni facebook e ad chalie sell korte parben. amader Ai die video bananor course ta dekhun."
8. Payment & Delivery:
   - Payment methods: bKash, Nagad, Rocket (Send Money to personal number: 01625449778).
   - Once payment is sent, submit TrxID and phone on checkout page.
   - Automated Delivery: As soon as the order is placed, credentials and links appear immediately in the Automated Credentials Modal and Customer Portal.
7. Support & WhatsApp:
   - Official WhatsApp: +8801830086837
8. Affiliate Program:
   - Earn ৳80 per course sale + multi-tier commissions. Joining fee is ৳199.

When answering, guide the user to take action (e.g. suggesting they click on the ৳399 bundle or check out the apps).`;

// Local domain fallback
function getLocalFallbackAnswer(query: string): string {
  const q = query.toLowerCase();

  // Specific User QNA 1
  if (
    (q.includes('chatgpt') && (q.includes('nite') || q.includes('parbo'))) ||
    q.includes('other tools') ||
    q.includes('eta die ki') ||
    q.includes('tools etc')
  ) {
    return 'ji sir, apni paid method ar free method e jekono apps/software nite ba kinte parben sobche kom dam e. eto kome paben je sell o korte parben.';
  }

  // Specific User QNA 2
  if (
    q.includes('sell kivabe') || 
    q.includes('sell korbo') || 
    q.includes('kivabe sell') || 
    q.includes('egula sell') || 
    q.includes('ad chalie')
  ) {
    return 'apni facebook e ad chalie sell korte parben. amader Ai die video bananor course ta dekhun.';
  }

  // Pro Unlock Method General Query
  if (q.includes('pro unlock') || q.includes('secret trick') || q.includes('151002055')) {
    return 'ji sir! Pro Unlock Method (Secret Tricks)-এর মাধ্যমে আপনি নিজেই অফিসিয়ালভাবে আনলক করুন Gemini Pro, Chatgpt Pro, Higgsfeild Pro, King Ai Pro, Canva pro, Capcut pro সাথে আরও অ্যাপস ও সফটওয়্যার। এর প্রাইস মাত্র ৳২৯৯ টাকা। থ্রি ডট মেন্যু থেকে সরাসরি এই পেজে গিয়ে আনলক করতে পারেন!';
  }

  // Coursera Plus Query
  if (q.includes('coursera') || q.includes('কোর্সেরা') || q.includes('1499') || q.includes('১৪৯৯')) {
    return 'ji sir! আমাদের নতুন Coursera Plus কোর্স ও মেম্বারশিপ পেজে আপনি পাচ্ছেন Google, Meta, IBM, Stanford-এর ৭,০০০+ অফিসিয়াল কোর্স ও ভেরিফাইড সার্টিফিকেট সম্পূর্ণ আনলিমিটেড এক্সেস মাত্র ১৪৯৯ BDT-তে! ভিডিও দেখে সরাসরি পপআপ থেকে বিকাশ/নগদে ১৪৯৯ টাকা পেমেন্ট করে অর্ডার করতে পারবেন।';
  }

  if (
    q.includes('assalam') || 
    q.includes('salam') || 
    q.includes('সালাম') || 
    q.includes('hello') || 
    q.includes('hi') || 
    q.includes('হাই')
  ) {
    return 'Assalamulaikum sir kivabe sahajjo korte pari? (আসসালামু আলাইকুম স্যার, কিভাবে সাহায্য করতে পারি?) \n\nআমি ProfitNext-এর এআই অ্যাসিস্ট্যান্ট। আপনি কি আমাদের ৩৯৯ টাকার AI কোর্স বান্ডেল, Gemini Pro, CapCut Pro নাকি অন্য কোনো প্রিমিয়াম অ্যাপস সম্পর্কে জানতে চান?';
  }
  if (
    q.includes('course') || 
    q.includes('কোর্স') || 
    q.includes('399') || 
    q.includes('৩৯৯') || 
    q.includes('masterclass') || 
    q.includes('বান্ডেল')
  ) {
    return `জি স্যার! আমাদের স্পেশাল **AI Video Earning Masterclass Bundle** মাত্র **৳৩৯৯** টাকায় পাচ্ছেন (রেগুলার ৳৯৯৯)। 

🎁 **বান্ডেলে যা যা পাচ্ছেন:**
1. 🎬 সম্পূর্ণ AI ভিডিও এডিটিং ও আর্নিং মাস্টারক্লাস
2. 🤖 **Gemini Pro** VIP একাউন্ট অ্যাক্সেস
3. ✨ **CapCut Pro** আনলকড VIP APK ডাউনলোড লিঙ্ক
4. 📂 সম্পূর্ণ রিসোর্স ড্রাইভ প্যাক ও প্রম্পট গাইড
5. 💬 আজীবন ভিআইপি WhatsApp কমিউনিটি সাপোর্ট

আপনি কি এই কোর্সটি এখনই অর্ডার করতে চান? নিচে দেওয়া বাটনে চাপ দিয়ে সহজেই বিকাশ/নগদে পেমেন্ট করে তাৎক্ষণিক ক্রেডেনশিয়াল পেতে পারেন।`;
  }
  if (q.includes('capcut') || q.includes('ক্যাপকাট')) {
    return `জি স্যার! **CapCut Pro** আমাদের কাছে আলাদাভাবে মাত্র **৳৯৯** টাকায় পাওয়া যাচ্ছে। 

তবে স্যার, সবচেয়ে সেরা অফার হলো আমাদের **৳৩৯৯ টাকার কোর্স বান্ডেল**—যেখানে আপনি কোর্স + Gemini Pro + CapCut Pro একসাথে পাচ্ছেন! 

আপনি কি শুধু CapCut Pro (৳৯৯) চান নাকি পুরো বান্ডেল (৳৩৯৯)?`;
  }
  if (q.includes('gemini') || q.includes('জেমিনাই')) {
    return `জি স্যার! **Gemini Pro (Google AI)** সাবস্ক্রিপশন আলাদাভাবে মাত্র **৳৩৫০** টাকা। 

তবে মাত্র **৳৩৯৯** টাকায় আমাদের ফুল AI ভিডিও আর্নিং কোর্স বান্ডেল নিলে আপনি কোর্স + Gemini Pro + CapCut Pro সব একসাথে পেয়ে যাবেন!`;
  }
  if (q.includes('app') || q.includes('অ্যাপ') || q.includes('list') || q.includes('লিস্ট')) {
    return `জি স্যার! ProfitNext-এ বর্তমানে যেসকল ডিজিটাল অ্যাপস ও কোর্স রয়েছে:

1. 🔥 **AI Course + Gemini Pro + CapCut Pro Bundle** - ৳৩৯৯
2. 🤖 **Gemini Pro** - ৳৩৫০
3. 🎬 **CapCut Pro VIP** - ৳৯৯
4. 🦉 **Duolingo Max** - ৳১৯৯
5. 🎨 **Framer Pro** - ৳২৯৯৯

কোনটি সম্পর্কে বিস্তারিত জানতে চান স্যার?`;
  }
  if (
    q.includes('kivabe') || 
    q.includes('কিভাবে') || 
    q.includes('kinbo') || 
    q.includes('পেমেন্ট') || 
    q.includes('payment') || 
    q.includes('bkash') || 
    q.includes('বিকাশ')
  ) {
    return `স্যার, কেনার প্রক্রিয়া অত্যন্ত সহজ ও দ্রুত:

1. আপনার পছন্দের কোর্স বা অ্যাপ সিলেক্ট করে 'Buy Now' বাটনে ক্লিক করুন।
2. আমাদের পার্সোনাল বিকাশ/নগদ/রকেট নম্বর **01625449778**-এ Send Money করুন।
3. পেমেন্টের Transaction ID (TrxID) ও ফোন নম্বর বসিয়ে সাবমিট করুন।
4. সাথে সাথে স্ক্রিনে **Automated Credentials Modal** চলে আসবে এবং আপনার Gemini Pro ও CapCut Pro লগইন ডিটেইলস পেয়ে যাবেন!`;
  }
  return `Assalamulaikum sir kivabe sahajjo korte pari? 

আমি ProfitNext-এর এআই অ্যাসিস্ট্যান্ট। আপনি কি আমাদের ৩৯৯ টাকার AI ভিডিও আর্নিং মাস্টারক্লাস বান্ডেল, CapCut Pro (৳৯৯), Gemini Pro (৳৩৫০), নাকি অন্য কোনো প্রিমিয়াম অ্যাপস বা পেমেন্ট পদ্ধতি সম্পর্কে জানতে চান? আমাকে নির্দ্বিধায় বলুন স্যার!`;
}

// Chat API endpoint
app.post('/api/assistant/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (ai) {
      try {
        const contents: any[] = [];
        if (Array.isArray(history)) {
          for (const item of history.slice(-6)) {
            contents.push({
              role: item.role === 'assistant' ? 'model' : 'user',
              parts: [{ text: item.content }],
            });
          }
        }
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });

        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: contents,
          config: {
            systemInstruction: SYSTEM_INSTRUCTION,
            temperature: 0.7,
          },
        });

        const reply = response.text || getLocalFallbackAnswer(message);
        return res.json({ reply });
      } catch (err: any) {
        console.warn('Gemini API call failed, falling back to local engine:', err.message);
        const fallback = getLocalFallbackAnswer(message);
        return res.json({ reply: fallback });
      }
    } else {
      const reply = getLocalFallbackAnswer(message);
      return res.json({ reply });
    }
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
