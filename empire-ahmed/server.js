const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'empire-ahmed-secret';
const SMM_API_KEY = process.env.SMM_AFRICA_API_KEY || '';
const SMM_API_BASE = 'https://smm.africa/api/v3';
const DB_PATH = path.join(__dirname, 'database.json');

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== 1. قاعدة البيانات (Auto-Save) =====
let db = { users: [], orders: [], servicesCache: { ts: 0, services: [] } };

function loadDB() {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, 'utf8');
      db = JSON.parse(raw);
      db.users = Array.isArray(db.users) ? db.users : [];
      db.orders = Array.isArray(db.orders) ? db.orders : [];
      db.servicesCache = db.servicesCache || { ts: 0, services: [] };
      console.log('✅ Database loaded.');
    } else {
      saveDB();
      console.log('✅ New database created.');
    }
  } catch (e) {
    console.error('❌ Error loading DB, starting fresh.', e);
    db = { users: [], orders: [], servicesCache: { ts: 0, services: [] } };
  }
}

function saveDB() {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');
  } catch (e) {
    console.error('❌ Error saving DB.', e);
  }
}
setInterval(saveDB, 5000);
process.on('exit', saveDB);
process.on('SIGINT', () => { saveDB(); process.exit(); });
process.on('SIGTERM', () => { saveDB(); process.exit(); });

// ===== 2. نظام التشفير والمصادقة =====
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${derived}`;
}
function verifyPassword(password, stored) {
  try {
    const [salt, key] = stored.split(':');
    const derived = crypto.scryptSync(password, salt, 64);
    const keyBuf = Buffer.from(key, 'hex');
    return crypto.timingSafeEqual(derived, keyBuf);
  } catch (e) {
    return false;
  }
}
function findUser(username) { return db.users.find(u => u.username.toLowerCase() === username.toLowerCase()); }
function sanitizeUser(u) { if (!u) return null; const { password, ...rest } = u; return rest; }
function generateToken(username) { return jwt.sign({ username }, JWT_SECRET, { expiresIn: '7d' }); }

function authMiddleware(req, res, next) {
  const token = (req.headers.authorization || '').replace(/^Bearer\s*/i, '').trim();
  if (!token) return res.status(401).json({ error: '❌ Token missing' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = findUser(payload.username);
    if (!user) return res.status(401).json({ error: '❌ Invalid token' });
    req.user = user;
    next();
  } catch (err) { return res.status(401).json({ error: '❌ Invalid token', details: err.message }); }
}

// ===== 3. أنظمة الحماية =====
const suspiciousIPs = {};
function securityMiddleware(req, res, next) {
  const ip = req.ip || req.connection.remoteAddress || 'unknown';
  const now = Date.now();
  if (suspiciousIPs[ip] && (now - suspiciousIPs[ip] < 60000)) {
    return res.status(403).json({ error: '🚫 Temporary block due to suspicious activity' });
  }
  if (req.path.includes('/order') && req.body.quantity > 10000) {
    suspiciousIPs[ip] = now;
    return res.status(400).json({ error: '🚫 Quantity exceeds limit, attempt logged' });
  }
  next();
}
app.use(securityMiddleware);

// ===== 4. بوت الاستيقاظ =====
setInterval(() => { fetch(`http://localhost:${PORT}/`).catch(() => {}); }, 4 * 60 * 1000);

// ===== 5. ترجمة الأسماء =====
const AR = { followers:'متابعين', likes:'إعجابات', views:'مشاهدات', instagram:'انستغرام', insta:'انستغرام', tiktok:'تيك توك', youtube:'يوتيوب', facebook:'فيسبوك', twitter:'تويتر' };
function translateName(name) {
  if (!name) return name;
  let out = name;
  Object.keys(AR).forEach(k => { out = out.replace(new RegExp(k, 'ig'), AR[k]); });
  return out;
}

// ===== 6. محرك جلب الخدمات =====
async function fetchSmmServices() {
  const now = Date.now();
  if (db.servicesCache && (now - db.servicesCache.ts) < 5 * 60 * 1000 && db.servicesCache.services.length) {
    return db.servicesCache.services;
  }
  try {
    const headers = {};
    if (SMM_API_KEY) { headers['x-api-key'] = SMM_API_KEY; headers['Authorization'] = `Bearer ${SMM_API_KEY}`; }
    const res = await fetch(`${SMM_API_BASE}/services`, { method: 'GET', headers, timeout: 10000 });
    if (!res.ok) throw new Error('smm.africa responded ' + res.status);
    let payload = await res.json();
    let services = [];
    if (Array.isArray(payload)) services = payload;
    else if (Array.isArray(payload.services)) services = payload.services;
    else if (Array.isArray(payload.data)) services = payload.data;
    else {
      for (const k of Object.keys(payload || {})) { if (Array.isArray(payload[k])) { services = payload[k]; break; } }
    }
    services = services.map((s, idx) => {
      const id = s.id || s.service || s.sid || `s_${idx}`;
      const name = s.name || s.title || s.service || `Service ${id}`;
      let price = parseFloat(s.price || s.rate || s.cost || 0);
      if (isNaN(price)) price = 0;
      return { id: String(id), name: String(name), price, raw: s };
    }).filter(s => (typeof s.price === 'number' && s.price <= 50) || Number(s.price) === 0)
      .map(s => ({ ...s, name_ar: translateName(s.name) }));
    db.servicesCache = { ts: now, services };
    return services;
  } catch (e) {
    console.warn('⚠️ SMM API failed, using fallback.');
    const fallback = [
      { id: 's1', name: 'Instagram Followers', price: 1.5 },
      { id: 's2', name: 'TikTok Likes', price: 0.8 },
      { id: 's3', name: 'Instagram Views', price: 0.2 },
      { id: 's4', name: 'YouTube Views', price: 2.0 },
    ].map(s => ({ ...s, name_ar: translateName(s.name) }));
    db.servicesCache = { ts: now, services: fallback };
    return fallback;
  }
}

// ===== 7. نقاط النهاية (API Endpoints) =====
app.post('/api/register', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  if (findUser(username)) return res.status(400).json({ error: 'User already exists' });
  const user = { username: username.trim(), password: hashPassword(password), balance: 10.0, orders: [], aiQuestionsRemaining: 5, isAdmin: false, createdAt: new Date().toISOString() };
  db.users.push(user);
  saveDB();
  res.json({ user: sanitizeUser(user), token: generateToken(user.username) });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) return res.status(400).json({ error: 'Username and password required' });
  const user = findUser(username);
  if (!user || !verifyPassword(password, user.password)) return res.status(401).json({ error: 'Invalid username/password' });
  res.json({ user: sanitizeUser(user), token: generateToken(user.username) });
});

app.get('/api/profile', authMiddleware, (req, res) => res.json({ user: sanitizeUser(req.user) }));

app.post('/api/fetch-services', authMiddleware, async (req, res) => {
  try {
    const services = await fetchSmmServices();
    res.json({ services });
  } catch (e) { res.status(500).json({ error: 'Failed to fetch services' }); }
});

app.post('/api/order', authMiddleware, async (req, res) => {
  const { link, quantity, serviceId } = req.body || {};
  if (!link || !quantity || !serviceId) return res.status(400).json({ error: 'Link, quantity, and service ID required' });
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty <= 0) return res.status(400).json({ error: 'Quantity must be a positive integer' });
  let services = db.servicesCache.services;
  if (!services || services.length === 0) services = await fetchSmmServices();
  const service = services.find(s => String(s.id) === String(serviceId));
  if (!service) return res.status(400).json({ error: 'Service not found' });
  const total = Number((service.price * qty).toFixed(2));
  if (req.user.balance < total) return res.status(400).json({ error: 'Insufficient balance' });
  req.user.balance = Number((req.user.balance - total).toFixed(2));
  const order = { id: 'ord-' + Date.now() + '-' + Math.random().toString(36).slice(2,8), username: req.user.username, serviceId: service.id, serviceName: service.name, serviceNameAr: service.name_ar, link, quantity: qty, priceEach: service.price, totalPrice: total, status: 'pending', createdAt: new Date().toISOString() };
  req.user.orders.push(order);
  db.orders.push(order);
  saveDB();
  res.json({ ok: true, order, balance: req.user.balance });
});

app.post('/api/auto-payment', authMiddleware, (req, res) => {
  const a = parseFloat(req.body.amount);
  if (isNaN(a) || a <= 0) return res.status(400).json({ error: 'Amount must be a positive number' });
  req.user.balance = Number((req.user.balance + a).toFixed(2));
  saveDB();
  res.json({ ok: true, balance: req.user.balance });
});

app.post('/api/ai/ask', authMiddleware, async (req, res) => {
  const { question } = req.body || {};
  if (!question) return res.status(400).json({ error: 'Question required' });
  if ((req.user.aiQuestionsRemaining || 0) <= 0) return res.status(402).json({ error: 'No free questions remaining. Please subscribe.' });
  req.user.aiQuestionsRemaining = Math.max(0, (req.user.aiQuestionsRemaining || 0) - 1);
  saveDB();
  let answer = `Empire Ahmed AI: Your question "${question}" is being processed.`;
  res.json({ ok: true, answer, remaining: req.user.aiQuestionsRemaining });
});

app.post('/api/ai/subscribe', authMiddleware, (req, res) => {
  const plans = { basic: { cost: 4.0, questions: 500 }, pro: { cost: 8.0, questions: 2000 } };
  const p = plans[String(req.body.plan || '').toLowerCase()];
  if (!p) return res.status(400).json({ error: 'Unknown plan' });
  if (req.user.balance < p.cost) return res.status(400).json({ error: 'Insufficient balance' });
  req.user.balance = Number((req.user.balance - p.cost).toFixed(2));
  req.user.aiQuestionsRemaining = (req.user.aiQuestionsRemaining || 0) + p.questions;
  saveDB();
  res.json({ ok: true, plan: p, balance: req.user.balance, remaining: req.user.aiQuestionsRemaining });
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(PORT, () => {
  console.log(`👑 Empire Ahmed running on port ${PORT}`);
  if (!SMM_API_KEY) console.log('⚠️ SMM_AFRICA_API_KEY not set. Using fallback services.');
});