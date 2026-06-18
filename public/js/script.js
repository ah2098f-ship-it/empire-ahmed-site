// ===== نظام الترجمة (عربي/إنجليزي) =====
const translations = {
    'ar': {
        'site_title': '👑 إمبراطورية أحمد',
        'dashboard': 'لوحة التحكم',
        'orders': 'الطلبات',
        'wallet': 'المحفظة',
        'vip': 'الموردين VIP',
        'security': 'الأمان',
        'support': 'الدعم',
        'balance': 'الرصيد',
        'today_orders': 'طلبات اليوم',
        'rank': 'الرتبة',
        'bonus': 'البونص',
        'place_order': 'تنفيذ الأمر',
        'order_success': '✅ تم تنفيذ الأمر الملكي بنجاح',
        'order_failed': '❌ فشل تنفيذ الأمر',
        'cancel_order': 'إلغاء الطلب',
        'refund': 'استرداد الأموال',
        'search_services': 'ابحث عن خدمة...',
        'link_placeholder': 'رابط الخدمة (Instagram/Telegram/TikTok)',
        'qty_placeholder': 'الكمية',
        'service_type': 'نوع الخدمة',
        'fast': 'سريع (Premium)',
        'medium': 'متوسط',
        'slow': 'بطيء (اقتصادي)',
        'guaranteed': 'مع ضمان 30 يوم',
        'withdraw': 'سحب الأموال',
        'deposit': 'إيداع',
        'chat_bot': 'البوت الذكي',
        'chat_placeholder': 'اكتب سؤالك هنا...',
        'security_encryption': 'تشفير AES-256',
        'security_ddos': 'حماية Cloudflare DDoS',
        'security_hash': 'تشفير SHA-256',
        'security_ai': 'كشف الاحتيال بالذكاء',
        'encryption_desc': 'تشفير كامل للبيانات',
        'ddos_desc': 'حماية من الهجمات',
        'hash_desc': 'تشفير كلمات المرور',
        'ai_desc': 'كشف الاحتيال بالذكاء',
        'rafidain': 'بنك الرافدين',
        'bank_transfer': 'حوالة مصرفية',
        'zaincash': 'زين كاش',
        'miftah': 'مفتاح',
        'crypto': 'Crypto',
        'crypto_text': 'USDT, BTC, ETH',
        'instagram_vip': 'Instagram VIP',
        'tiktok_vip': 'TikTok VIP',
        'telegram_vip': 'Telegram VIP',
        'discount_20': 'خصم 20%',
        'discount_25': 'خصم 25%',
        'discount_30': 'خصم 30%',
        'order_history': 'سجل الطلبات',
        'welcome_msg': 'مرحباً بك في إمبراطورية أحمد! كيف يمكنني مساعدتك؟',
        'link_label': 'رابط الخدمة',
        'qty_label': 'الكمية',
        'search_placeholder': 'ابحث عن خدمة...',
        'security_text': '🔐 تشغيل AES-256 & Cloudflare DDoS Protection'
    },
    'en': {
        'site_title': '👑 Empire Ahmed',
        'dashboard': 'Dashboard',
        'orders': 'Orders',
        'wallet': 'Wallet',
        'vip': 'VIP Suppliers',
        'security': 'Security',
        'support': 'Support',
        'balance': 'Balance',
        'today_orders': 'Today\'s Orders',
        'rank': 'Rank',
        'bonus': 'Bonus',
        'place_order': 'Execute Order',
        'order_success': '✅ Order executed successfully',
        'order_failed': '❌ Order failed',
        'cancel_order': 'Cancel Order',
        'refund': 'Refund',
        'search_services': 'Search services...',
        'link_placeholder': 'Service link (Instagram/Telegram/TikTok)',
        'qty_placeholder': 'Quantity',
        'service_type': 'Service Type',
        'fast': 'Fast (Premium)',
        'medium': 'Medium',
        'slow': 'Slow (Economy)',
        'guaranteed': '30-Day Guarantee',
        'withdraw': 'Withdraw',
        'deposit': 'Deposit',
        'chat_bot': 'Smart Bot',
        'chat_placeholder': 'Type your question here...',
        'security_encryption': 'AES-256 Encryption',
        'security_ddos': 'Cloudflare DDoS Protection',
        'security_hash': 'SHA-256 Hashing',
        'security_ai': 'AI Fraud Detection',
        'encryption_desc': 'Full data encryption',
        'ddos_desc': 'Attack protection',
        'hash_desc': 'Password hashing',
        'ai_desc': 'AI fraud detection',
        'rafidain': 'Rafidain Bank',
        'bank_transfer': 'Bank transfer',
        'zaincash': 'ZainCash',
        'miftah': 'Miftah',
        'crypto': 'Crypto',
        'crypto_text': 'USDT, BTC, ETH',
        'instagram_vip': 'Instagram VIP',
        'tiktok_vip': 'TikTok VIP',
        'telegram_vip': 'Telegram VIP',
        'discount_20': '20% discount',
        'discount_25': '25% discount',
        'discount_30': '30% discount',
        'order_history': 'Order History',
        'welcome_msg': 'Welcome to Empire Ahmed! How can I help you?',
        'link_label': 'Service Link',
        'qty_label': 'Quantity',
        'search_placeholder': 'Search services...',
        'security_text': '🔐 AES-256 & Cloudflare DDoS Protection Active'
    }
};

let currentLang = 'ar';

// ===== تطبيق الترجمة =====
function applyTranslations() {
    const t = translations[currentLang];
    if (!t) return;
    
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (t[key]) {
            el.textContent = t[key];
        }
    });
    
    document.querySelectorAll('[data-translate-placeholder]').forEach(el => {
        const key = el.getAttribute('data-translate-placeholder');
        if (t[key]) {
            el.placeholder = t[key];
        }
    });
    
    // تحديث عنوان الصفحة
    document.title = t.site_title;
    
    // تحديث اتجاه الصفحة
    document.documentElement.dir = currentLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = currentLang;
}

// ===== تبديل اللغة =====
function toggleLanguage(lang) {
    currentLang = lang;
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    applyTranslations();
    
    // حفظ التفضيل
    try {
        localStorage.setItem('empire_lang', lang);
        fetch('/api/save-lang', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ lang })
        });
    } catch(e) { /* تجاهل الأخطاء */ }
}

// ===== شاشة الحماية =====
setTimeout(() => {
    document.getElementById('securityScreen').style.display = 'none';
    document.getElementById('mainContent').style.display = 'block';
    
    // استعادة اللغة المحفوظة
    const savedLang = localStorage.getItem('empire_lang');
    if (savedLang) {
        toggleLanguage(savedLang);
    } else {
        applyTranslations();
    }
    
    loadDashboard();
    loadOrders();
    initChat();
}, 3500);

// ===== التنقل =====
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    if (pageId === 'dashboard') loadDashboard();
    if (pageId === 'orders') loadOrders();
}

// ===== لوحة التحكم =====
async function loadDashboard() {
    try {
        const response = await fetch('/api/balance', { method: 'POST' });
        const data = await response.json();
        document.getElementById('balance').textContent = data.balance.toFixed(2);
        document.getElementById('iqdBalance').textContent = (data.iqd_equivalent || 0).toLocaleString();
        document.getElementById('todayOrders').textContent = Math.floor(Math.random() * 50) + 10;
        document.getElementById('rank').textContent = 'Imperial';
        document.getElementById('bonus').textContent = '7%';
        
        const ctx = document.getElementById('mainChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
                datasets: [{
                    label: 'Profit (USD)',
                    data: [120, 190, 300, 500, 420, 650, 800],
                    borderColor: '#ffd700',
                    backgroundColor: 'rgba(255,215,0,0.1)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { labels: { color: '#fff' } }
                },
                scales: {
                    x: { ticks: { color: '#888' } },
                    y: { ticks: { color: '#888' } }
                }
            }
        });
    } catch(e) { console.log('Error loading dashboard'); }
}

// ===== إنشاء طلب =====
async function placeOrder() {
    const link = document.getElementById('link').value;
    const qty = document.getElementById('qty').value;
    const type = document.getElementById('serviceType').value;
    const result = document.getElementById('orderResult');
    const t = translations[currentLang];

    if (!link || !qty) { 
        result.innerHTML = `<span style="color:red;">❌ ${t.order_failed || 'املأ جميع الحقول'}</span>`; 
        return; 
    }

    result.innerHTML = `<span style="color:#ffd700;">⏳ ${t.place_order || 'جاري التنفيذ...'}</span>`;

    try {
        const response = await fetch('/api/order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ link, quantity: parseInt(qty), service_type: type })
        });
        const data = await response.json();
        if (data.success) {
            result.innerHTML = `<span style="color:lime;">✅ ${data.message} (ID: ${data.order.id})</span>`;
            loadOrders();
            loadDashboard();
        } else {
            result.innerHTML = `<span style="color:red;">❌ ${data.error}</span>`;
        }
    } catch(e) {
        result.innerHTML = `<span style="color:red;">❌ ${t.order_failed || 'فشل الاتصال'}</span>`;
    }
}

// ===== سجل الطلبات =====
function loadOrders() {
    const ordersList = document.getElementById('ordersList');
    ordersList.innerHTML = '';
    
    const orders = [
        { id: 'ORD-123456', service: 'Instagram', status: 'completed', date: '2026-01-15' },
        { id: 'ORD-123457', service: 'TikTok', status: 'processing', date: '2026-01-15' },
        { id: 'ORD-123458', service: 'Telegram', status: 'cancelled', date: '2026-01-14' }
    ];
    
    orders.forEach(order => {
        const div = document.createElement('div');
        div.className = 'order-item';
        const statusText = order.status === 'completed' ? 'Completed' : order.status === 'processing' ? 'Processing' : 'Cancelled';
        div.innerHTML = `
            <span>#${order.id} - ${order.service}</span>
            <span>${order.date}</span>
            <span class="status ${order.status}">${statusText}</span>
            ${order.status === 'processing' ? `<button onclick="cancelOrder('${order.id}')" style="background:#e74c3c;color:#fff;border:none;padding:5px 10px;border-radius:5px;cursor:pointer;">Cancel</button>` : ''}
        `;
        ordersList.appendChild(div);
    });
}

// ===== إلغاء الطلب =====
async function cancelOrder(orderId) {
    const t = translations[currentLang];
    if (!confirm(t.cancel_order || 'هل أنت متأكد؟')) return;
    
    try {
        const response = await fetch('/api/cancel-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId })
        });
        const data = await response.json();
        if (data.success) {
            alert(`✅ ${t.refund || 'تم الاسترداد'}: ${data.refunded_amount} USD`);
            loadOrders();
            loadDashboard();
        } else {
            alert('❌ ' + data.error);
        }
    } catch(e) {
        alert('❌ Error cancelling order');
    }
}

// ===== الدردشة =====
function initChat() {
    const chatInput = document.getElementById('chatInput');
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
}

async function sendMessage() {
    const input = document.getElementById('chatInput');
    const messages = document.getElementById('chatMessages');
    const text = input.value.trim();
    const t = translations[currentLang];
    
    if (!text) return;
    
    messages.innerHTML += `<div class="message user">${text}</div>`;
    input.value = '';
    messages.scrollTop = messages.scrollHeight;
    
    setTimeout(() => {
        const responses = [
            t.welcome_msg || 'Thank you for contacting Empire Ahmed!',
            'How can I help you?',
            'Your request has been received.',
            'Support will get back to you soon.'
        ];
        const random = responses[Math.floor(Math.random() * responses.length)];
        messages.innerHTML += `<div class="message bot">🤖 ${random}</div>`;
        messages.scrollTop = messages.scrollHeight;
    }, 1000);
}

// ===== بحث الخدمات =====
document.getElementById('searchService').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const results = document.getElementById('searchResults');
    
    if (query.length < 2) {
        results.style.display = 'none';
        return;
    }
    
    const services = [
        { name: 'Instagram Followers - 1000', price: 5.00 },
        { name: 'TikTok Views - 10000', price: 3.50 },
        { name: 'Telegram Members - 500', price: 8.00 },
        { name: 'Facebook Likes - 1000', price: 2.00 }
    ];
    
    const filtered = services.filter(s => s.name.toLowerCase().includes(query));
    results.innerHTML = '';
    results.style.display = 'block';
    
    filtered.forEach(s => {
        const div = document.createElement('div');
        div.className = 'result-item';
        div.innerHTML = `${s.name} - $${s.price.toFixed(2)}`;
        div.onclick = () => {
            document.getElementById('searchService').value = s.name;
            results.style.display = 'none';
        };
        results.appendChild(div);
    });
});

// ===== سحب الأموال =====
function withdrawMoney() {
    const t = translations[currentLang];
    alert(`💰 ${t.withdraw || 'سحب الأموال'}: Contact support for approval.`);
}

// ===== إيداع =====
function depositMoney() {
    const t = translations[currentLang];
    alert(`💳 ${t.deposit || 'إيداع'}: ZainCash 077860333563, Miftah 07732554772`);
}

// ===== تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏰 Empire Ahmed is ready');
    console.log('🔐 API Key: 290d9da4b0e8dbff9dca9173a2c2f6cf');
});
