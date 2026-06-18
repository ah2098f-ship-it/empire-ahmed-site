import express from "express";
import cors from "cors";
import { serve } from "https://deno.land/std@0.208.0/http/server.ts";

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ===== مفاتيحك الملكية =====
const API_KEY = Deno.env.get("API_KEY") || "290d9da4b0e8dbff9dca9173a2c2f6cf";
const JAP_API_URL = Deno.env.get("JAP_API_URL") || "https://api.example.com/v2";

console.log(`🔐 المفتاح: ${API_KEY}`);
console.log(`🌐 رابط السيرفر: ${JAP_API_URL}`);

let data = { balance: 4500.75, orders: [], users: [], settings: { lang: 'ar' } };

const getRank = (spend) => {
  if (spend >= 1000) return { name: 'إمبراطوري', bonus: 7, discount: 20 };
  if (spend >= 500) return { name: 'ذهبي', bonus: 4, discount: 10 };
  if (spend >= 100) return { name: 'فضي', bonus: 2, discount: 5 };
  return { name: 'برونزي', bonus: 0, discount: 0 };
};

async function fetchJAPServices(lang = 'ar') {
  try {
    const res = await fetch(`${JAP_API_URL}/services?key=${API_KEY}`);
    const json = await res.json();
    const translations = {
      'Instagram': { ar: 'إنستغرام', en: 'Instagram' },
      'TikTok': { ar: 'تيك توك', en: 'TikTok' },
      'Telegram': { ar: 'تيليجرام', en: 'Telegram' }
    };
    return (json.services || []).map((s) => ({
      ...s,
      name: translations[s.name]?.[lang] || s.name
    }));
  } catch {
    return { error: 'فشل الاتصال بـ JAP', services: [] };
  }
}

app.post('/api/fetch-services', async (req, res) => {
  const { lang = 'ar' } = req.body;
  const services = await fetchJAPServices(lang);
  res.json(services);
});

app.post('/api/balance', (req, res) => {
  res.json({ balance: data.balance, currency: 'USD', iqd: data.balance * 1500, rank: getRank(1000).name, bonus: getRank(1000).bonus });
});

app.post('/api/order', (req, res) => {
  const { link, quantity } = req.body;
  const total = quantity * 0.50;
  if (total > data.balance) return res.status(400).json({ error: '❌ الرصيد غير كافي' });
  data.balance -= total;
  const order = { id: 'ORD-' + Math.floor(Math.random() * 999999), link, quantity, price: total, status: 'processing', date: new Date().toISOString() };
  data.orders.push(order);
  res.json({ success: true, order, message: '✅ تم تنفيذ الأمر الملكي' });
});

app.post('/api/cancel-order', (req, res) => {
  const { orderId } = req.body;
  const index = data.orders.findIndex((o) => o.id === orderId);
  if (index === -1) return res.status(404).json({ error: 'طلب غير موجود' });
  const order = data.orders[index];
  if (order.status === 'completed') return res.status(400).json({ error: 'لا يمكن الإلغاء' });
  data.balance += order.price;
  data.orders[index].status = 'cancelled';
  res.json({ success: true, refunded: order.price });
});

app.post('/api/chat', (req, res) => {
  const { msg } = req.body;
  const lower = msg.toLowerCase();
  if (lower.includes('حال')) return res.json({ reply: 'جارٍ التحقق من حالة طلبك...' });
  if (lower.includes('استرداد')) return res.json({ reply: 'سيتم معالجة الاسترداد خلال 24 ساعة.' });
  return res.json({ reply: 'شكراً لتواصلك مع إمبراطورية أحمد!' });
});

const port = 3000;
console.log(`🏰 إمبراطورية أحمد تعمل على المنفذ ${port}`);
await serve(app.handle, { port });
