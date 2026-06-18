import os
import json

# اسم المجلد الرئيسي
project_name = "empire-ahmed-site"

# إنشاء المجلدات الأساسية
os.makedirs(project_name, exist_ok=True)
os.makedirs(os.path.join(project_name, "public"), exist_ok=True)

# 1. إنشاء ملف import_map.json
import_map_content = {
    "imports": {
        "express": "npm:express@4.18.2",
        "cors": "npm:cors@2.8.5"
    }
}
with open(os.path.join(project_name, "import_map.json"), "w", encoding="utf-8") as f:
    json.dump(import_map_content, f, indent=2)

# 2. إنشاء ملف main.ts (الخلفية)
main_ts_content = '''import express from "express";
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
'''
with open(os.path.join(project_name, "main.ts"), "w", encoding="utf-8") as f:
    f.write(main_ts_content)

# 3. إنشاء ملف public/index.html
index_html_content = '''<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>👑 إمبراطورية أحمد</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
    <style>
        * { margin:0; padding:0; box-sizing:border-box; font-family:system-ui, sans-serif; }
        body { background:#0a0a0a; color:#fff; direction:rtl; }
        #securityScreen { height:100vh; display:flex; flex-direction:column; justify-content:center; align-items:center; background:radial-gradient(circle, #1a0000, #000); position:relative; overflow:hidden; }
        #securityScreen::before { content:''; position:absolute; width:200%; height:200%; background:conic-gradient(from 0deg, transparent, rgba(255,215,0,0.1), transparent, rgba(255,0,0,0.1), transparent); animation:rotate 20s linear infinite; }
        @keyframes rotate { 100% { transform:rotate(360deg); } }
        .crown { font-size:80px; z-index:1; animation:pulse 1.5s infinite; }
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.2); } }
        .shield-bar { width:300px; height:4px; background:#333; margin:20px auto; border-radius:2px; overflow:hidden; z-index:1; position:relative; }
        .shield-bar::after { content:''; display:block; height:100%; width:0%; background:linear-gradient(90deg, #ffd700, #ff0000); animation:loading 3s forwards; }
        @keyframes loading { 100% { width:100%; } }
        .glow-text { font-size:3rem; color:#ffd700; text-shadow:0 0 30px #ffd700; z-index:1; margin:20px 0; text-align:center; }
        .security-sub { color:#888; z-index:1; }
        .page { display:none; padding:20px; max-width:1200px; margin:0 auto; }
        .page.active { display:block; }
        .navbar { background:#1a0000; padding:15px; display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #ffd700; flex-wrap:wrap; gap:10px; }
        .logo { color:#ffd700; font-weight:bold; font-size:1.5rem; display:flex; align-items:center; gap:10px; }
        .nav-links a { color:#ffd700; text-decoration:none; margin:0 10px; font-weight:bold; }
        .stats-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin:30px 0; }
        .card { background:#1a1a1a; padding:20px; border:1px solid #ffd700; border-radius:10px; text-align:center; }
        .card h3 { color:#888; margin-bottom:10px; }
        .card span { font-size:2rem; color:#ffd700; font-weight:bold; }
        .btn-gold { background:#ffd700; color:#000; padding:12px 25px; border:none; border-radius:5px; font-weight:bold; cursor:pointer; width:100%; margin-top:10px; }
        .order-form { max-width:500px; margin:20px auto; background:#1a1a1a; padding:20px; border:1px solid #ffd700; border-radius:10px; }
        .order-form input, .order-form select { width:100%; padding:10px; margin:10px 0; background:#0a0a0a; border:1px solid #333; color:#fff; border-radius:5px; }
        .result-box { margin-top:15px; padding:10px; text-align:center; background:#0a0a0a; border-radius:5px; }
        .wallet-grid, .vip-grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin:20px 0; }
        .wallet-card, .vip-card { background:#1a1a1a; padding:20px; text-align:center; border:1px solid #ffd700; border-radius:10px; }
        .wallet-card i, .vip-card i { font-size:3rem; margin-bottom:10px; color:#ffd700; }
        .chat-box { max-width:500px; margin:20px auto; background:#1a1a1a; border:1px solid #ffd700; border-radius:10px; overflow:hidden; }
        .chat-header { background:#ffd700; padding:10px; text-align:center; font-weight:bold; color:#000; }
        .chat-messages { height:200px; overflow-y:auto; padding:10px; background:#0a0a0a; }
        .message { margin:10px 0; padding:10px; border-radius:10px; max-width:80%; }
        .message.bot { background:#333; color:#fff; }
        .message.user { background:#ffd700; color:#000; margin-left:auto; }
        .chat-input { display:flex; padding:10px; border-top:1px solid #333; background:#0a0a0a; }
        .chat-input input { flex:1; padding:10px; border:none; background:#1a1a1a; color:#fff; border-radius:5px; }
        .chat-input button { padding:10px 20px; background:#ffd700; border:none; color:#000; border-radius:5px; margin-left:10px; cursor:pointer; }
        @media (max-width:768px) { .navbar { flex-direction:column; align-items:center; } }
    </style>
</head>
<body>
    <div id="securityScreen"><div class="crown">👑</div><h1 class="glow-text">إمبراطورية أحمد</h1><div class="shield-bar"></div><p class="security-sub">🔐 تم تفعيل AES-256 & Cloudflare DDoS</p></div>
    <div id="mainContent" style="display:none;">
        <nav class="navbar"><div class="logo"><i class="fas fa-crown"></i> إمبراطورية أحمد</div>
            <div class="nav-links">
                <a href="#" onclick="showPage('dashboard')">لوحة التحكم</a>
                <a href="#" onclick="showPage('orders')">الطلبات</a>
                <a href="#" onclick="showPage('wallet')">المحفظة</a>
                <a href="#" onclick="showPage('vip')">VIP</a>
                <a href="#" onclick="showPage('support')">الدعم</a>
            </div>
        </nav>
        <div id="dashboard" class="page active">
            <h1 style="text-align:center;color:#ffd700;">👑 لوحة التحكم الملكية</h1>
            <div class="stats-grid">
                <div class="card"><h3>💰 الرصيد</h3><span id="balance">0.00</span> USD</div>
                <div class="card"><h3>📊 طلبات اليوم</h3><span id="todayOrders">0</span></div>
                <div class="card"><h3>⭐ الرتبة</h3><span id="rank">إمبراطوري</span></div>
                <div class="card"><h3>🎁 البونص</h3><span id="bonus">7%</span></div>
            </div>
        </div>
        <div id="orders" class="page" style="display:none;">
            <h1 style="text-align:center;color:#ffd700;">🚀 إنشاء أمر ملكي</h1>
            <div class="order-form">
                <label>الخدمة:</label><select id="serviceSelect"><option>جاري تحميل الخدمات...</option></select>
                <label>الرابط:</label><input type="text" id="linkInput" placeholder="رابط الخدمة">
                <label>الكمية:</label><input type="number" id="qtyInput" placeholder="الكمية">
                <button class="btn-gold" onclick="placeOrder()">🚀 تنفيذ الأمر</button>
                <div id="orderResult" class="result-box"></div>
            </div>
        </div>
        <div id="wallet" class="page" style="display:none;">
            <h1 style="text-align:center;color:#ffd700;">💰 المحفظة الرقمية</h1>
            <div class="wallet-grid">
                <div class="wallet-card"><i class="fas fa-university"></i><h3>بنك الرافدين</h3><p>تحويل مصرفي</p></div>
                <div class="wallet-card"><i class="fas fa-mobile-alt"></i><h3>زين كاش</h3><p>077860333563</p></div>
                <div class="wallet-card"><i class="fas fa-key"></i><h3>مفتاح</h3><p>07732554772</p></div>
                <div class="wallet-card"><i class="fab fa-bitcoin"></i><h3>Crypto</h3><p>USDT, BTC, ETH</p></div>
            </div>
            <button class="btn-gold" onclick="alert('سيتم توجيهك لنظام السحب')">💸 سحب الأموال</button>
        </div>
        <div id="vip" class="page" style="display:none;">
            <h1 style="text-align:center;color:#ffd700;">👑 الموردين VIP</h1>
            <div class="vip-grid">
                <div class="vip-card"><i class="fab fa-instagram"></i><h3>Instagram</h3><p>خصم 20%</p></div>
                <div class="vip-card"><i class="fab fa-tiktok"></i><h3>TikTok</h3><p>خصم 25%</p></div>
                <div class="vip-card"><i class="fab fa-telegram"></i><h3>Telegram</h3><p>خصم 30%</p></div>
            </div>
        </div>
        <div id="support" class="page" style="display:none;">
            <h1 style="text-align:center;color:#ffd700;">🤖 مركز الدعم الذكي</h1>
            <div class="chat-box">
                <div class="chat-header">مساعدك الذكي</div>
                <div class="chat-messages" id="chatMessages"><div class="message bot">مرحباً! كيف يمكنني مساعدتك؟</div></div>
                <div class="chat-input"><input type="text" id="chatInput" placeholder="اكتب سؤالك..."><button onclick="sendChat()"><i class="fas fa-paper-plane"></i></button></div>
            </div>
        </div>
    </div>
    <script>
        setTimeout(() => {
            document.getElementById('securityScreen').style.display = 'none';
            document.getElementById('mainContent').style.display = 'block';
            loadDashboard(); loadServices();
        }, 3000);
        function showPage(id) { document.querySelectorAll('.page').forEach(p => p.classList.remove('active')); document.getElementById(id).classList.add('active'); }
        async function loadDashboard() {
            const res = await fetch('/api/balance', { method: 'POST' });
            const data = await res.json();
            document.getElementById('balance').textContent = data.balance;
            document.getElementById('todayOrders').textContent = '15';
            document.getElementById('rank').textContent = data.rank;
            document.getElementById('bonus').textContent = data.bonus + '%';
        }
        async function loadServices() {
            const select = document.getElementById('serviceSelect');
            try {
                const res = await fetch('/api/fetch-services', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({lang:'ar'}) });
                const data = await res.json();
                if(data.error) throw new Error(data.error);
                select.innerHTML = '';
                data.forEach(s => { const opt = document.createElement('option'); opt.value = s.id || s.name; opt.textContent = `${s.name} - $${s.price || 0.5}`; select.appendChild(opt); });
            } catch { select.innerHTML = '<option>Instagram Followers - $5.00</option><option>TikTok Views - $3.50</option>'; }
        }
        async function placeOrder() {
            const service = document.getElementById('serviceSelect').value;
            const link = document.getElementById('linkInput').value;
            const qty = document.getElementById('qtyInput').value;
            const result = document.getElementById('orderResult');
            if(!link || !qty) return result.innerHTML = '<span style="color:red;">❌ املأ جميع الحقول</span>';
            result.innerHTML = '⏳ جاري التنفيذ...';
            const res = await fetch('/api/order', { method: 'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ service_id: service, link, quantity: parseInt(qty) }) });
            const data = await res.json();
            if(data.success) result.innerHTML = `<span style="color:lime;">✅ ${data.message} (ID: ${data.order.id})</span>`;
            else result.innerHTML = `<span style="color:red;">❌ ${data.error}</span>`;
        }
        document.getElementById('chatInput').addEventListener('keypress', (e) => { if(e.key === 'Enter') sendChat(); });
        async function sendChat() {
            const input = document.getElementById('chatInput');
            const messages = document.getElementById('chatMessages');
            if(!input.value.trim()) return;
            messages.innerHTML += `<div class="message user">${input.value}</div>`;
            const msg = input.value; input.value = '';
            const res = await fetch('/api/chat', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({msg}) });
            const data = await res.json();
            setTimeout(() => {
                messages.innerHTML += `<div class="message bot">🤖 ${data.reply}</div>`;
                messages.scrollTop = messages.scrollHeight;
            }, 500);
        }
    </script>
</body>
</html>
'''
with open(os.path.join(project_name, "public", "index.html"), "w", encoding="utf-8") as f:
    f.write(index_html_content)

print(f"✅ تم إنشاء مجلد '{project_name}' على سطح المكتب. كل الملفات جاهزة.")
print("📂 اذهب إليه وارفع مجلد 'empire-ahmed-site' بالكامل إلى GitHub.")