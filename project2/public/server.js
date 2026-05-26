// server.js — Ashok Mess Full-Stack Backend (Node 18+, no lowdb)
import express from 'express';
import cors from 'cors';
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR  = join(__dirname, 'data');
const DB_PATH   = join(DATA_DIR, 'db.json');

// ─── Simple JSON DB ───────────────────────────────────────────────────────────
const DEFAULT = {
  bills: [],
  menuItems: [
    'இட்லி', 'ஆட்டோ வாடகை', 'பொங்கல்', 'தோசை', 'வெஜ் பிரியாணி',
    'காளான் பிரியாணி', 'சாப்பாடு', 'கேசரி', 'ஊத்தாப்பம்', 'இடியாப்பம்',
    'பூரி (set)', 'சப்பாத்தி (set)', 'புரோட்டா', 'சர்க்கரை பொங்கல்(kg)',
    'புளி சாதம் (kg)', 'தக்காளி சாதம்(kg)', 'தயிர் சாதம்(kg)',
    'லெமன் சாதம்(kg)', 'தேங்காய் சாதம்(kg)', 'மல்லி சாதம்(kg)',
    'வளைகாப்பு சாப்பாடு', 'கோதுமை கிச்சடி', 'சுண்டல் (kg)',
    'தண்ணீர் கேன்', 'பாயாசம்', 'ரவா தோசை', 'முட்டை',
    'சாம்பார்', 'வடை', 'கலக்கி', 'ஆம்லெட்', 'Custom'
  ],
  settings: {
    bizName:  'Ashok Mess',
    location: 'Uppiliyapuram',
    phone:    '8489690007',
    address:  'No -7, AGM Medical back side, Main Road, UPPILIAPURAM-621011',
    footer:   'Thank you for your order!',
    autoDate: true,
    preview:  true,
    confirm:  true,
    sound:    false
  },
  nextBillId: 1
};

function readDB() {
  try {
    if (!existsSync(DB_PATH)) return structuredClone(DEFAULT);
    const raw = readFileSync(DB_PATH, 'utf8');
    const data = JSON.parse(raw);
    // fill any missing keys from DEFAULT
    for (const [k, v] of Object.entries(DEFAULT)) {
      if (data[k] === undefined) data[k] = v;
    }
    return data;
  } catch {
    return structuredClone(DEFAULT);
  }
}

function writeDB(data) {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
}

// Initialise on startup
if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
if (!existsSync(DB_PATH))  writeDB(structuredClone(DEFAULT));
console.log(`✅ Database ready at ${DB_PATH}`);

// ─── Express app ──────────────────────────────────────────────────────────────
const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));   // serves index.html

// ─── HEALTH ──────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  const db = readDB();
  res.json({ ok: true, bills: db.bills.length });
});

// ─── SETTINGS ────────────────────────────────────────────────────────────────
app.get('/api/settings', (req, res) => {
  res.json({ settings: readDB().settings });
});

app.put('/api/settings', (req, res) => {
  const db = readDB();
  db.settings = { ...db.settings, ...req.body };
  writeDB(db);
  res.json({ settings: db.settings });
});

// ─── MENU ────────────────────────────────────────────────────────────────────
app.get('/api/menu', (req, res) => {
  res.json({ menuItems: readDB().menuItems });
});

app.post('/api/menu', (req, res) => {
  const db   = readDB();
  const name = (req.body.name || '').trim();
  if (!name) return res.status(400).json({ error: 'Name required' });
  if (db.menuItems.includes(name)) return res.status(409).json({ error: 'Item already exists' });
  db.menuItems.push(name);
  writeDB(db);
  res.json({ menuItems: db.menuItems });
});

app.delete('/api/menu/:name', (req, res) => {
  const db   = readDB();
  const name = decodeURIComponent(req.params.name);
  db.menuItems = db.menuItems.filter(m => m !== name);
  writeDB(db);
  res.json({ menuItems: db.menuItems });
});

// ─── BILLS — List / Filter / Paginate ────────────────────────────────────────
app.get('/api/bills', (req, res) => {
  const db = readDB();
  let bills = [...db.bills];

  if (req.query.date)   bills = bills.filter(b => b.date === req.query.date);
  if (req.query.search) {
    const q = req.query.search.toLowerCase();
    bills = bills.filter(b =>
      (b.name    || '').toLowerCase().includes(q) ||
      (b.address || '').toLowerCase().includes(q)
    );
  }

  const sort = req.query.sort || 'newest';
  if (sort === 'newest')  bills.sort((a, b) => b.id - a.id);
  if (sort === 'oldest')  bills.sort((a, b) => a.id - b.id);
  if (sort === 'highest') bills.sort((a, b) => b.total - a.total);
  if (sort === 'lowest')  bills.sort((a, b) => a.total - b.total);

  const page  = parseInt(req.query.page)  || 1;
  const limit = parseInt(req.query.limit) || 10;
  const total = bills.length;
  const paged = bills.slice((page - 1) * limit, page * limit);

  res.json({ bills: paged, total, page, limit });
});

// ─── BILLS — Single ───────────────────────────────────────────────────────────
app.get('/api/bills/:id', (req, res) => {
  const db   = readDB();
  const bill = db.bills.find(b => b.id === parseInt(req.params.id));
  if (!bill) return res.status(404).json({ error: 'Bill not found' });
  res.json({ bill });
});

// ─── BILLS — Create ───────────────────────────────────────────────────────────
app.post('/api/bills', (req, res) => {
  const db = readDB();
  const { name, number, address, shipto, date, time, advance, discount, notes, items } = req.body;
  if (!name)                  return res.status(400).json({ error: 'Customer name required' });
  if (!items || !items.length) return res.status(400).json({ error: 'At least one item required' });

  const sub   = items.reduce((s, i) => s + (i.qty * i.price), 0);
  const total = Math.max(0, sub - (discount || 0) - (advance || 0));

  const bill = {
    id:        db.nextBillId++,
    name,
    number:    number   || '',
    address:   address  || '',
    shipto:    shipto   || '',
    date:      date     || new Date().toISOString().split('T')[0],
    time:      time     || new Date().toTimeString().slice(0, 5),
    advance:   advance  || 0,
    discount:  discount || 0,
    notes:     notes    || '',
    items,
    sub,
    total,
    createdAt: new Date().toISOString()
  };

  db.bills.push(bill);
  writeDB(db);
  res.status(201).json({ bill });
});

// ─── BILLS — Update ───────────────────────────────────────────────────────────
app.put('/api/bills/:id', (req, res) => {
  const db  = readDB();
  const idx = db.bills.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Bill not found' });

  const u = req.body;
  if (u.items) {
    u.sub   = u.items.reduce((s, i) => s + (i.qty * i.price), 0);
    u.total = Math.max(0, u.sub - (u.discount || 0) - (u.advance || 0));
  }
  db.bills[idx] = { ...db.bills[idx], ...u, updatedAt: new Date().toISOString() };
  writeDB(db);
  res.json({ bill: db.bills[idx] });
});

// ─── BILLS — Delete ───────────────────────────────────────────────────────────
app.delete('/api/bills/:id', (req, res) => {
  const db  = readDB();
  const idx = db.bills.findIndex(b => b.id === parseInt(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Bill not found' });
  db.bills.splice(idx, 1);
  writeDB(db);
  res.json({ ok: true });
});

// ─── DELETE ALL DATA ─────────────────────────────────────────────────────────
app.delete('/api/data', (req, res) => {
  const db = readDB();
  db.bills      = [];
  db.nextBillId = 1;
  writeDB(db);
  res.json({ ok: true });
});

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
app.get('/api/dashboard', (req, res) => {
  const db    = readDB();
  const bills = db.bills;
  const now   = new Date();
  const ym    = d => `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
  const today = now.toISOString().split('T')[0];
  const thisM = ym(now);
  const lastM = ym(new Date(now.getFullYear(), now.getMonth()-1, 1));
  const sum   = arr => arr.reduce((s, b) => s + (b.total || 0), 0);

  const monthBills = bills.filter(b => b.date && b.date.startsWith(thisM));
  const lastMBills = bills.filter(b => b.date && b.date.startsWith(lastM));
  const todayBills = bills.filter(b => b.date === today);
  const monthRev   = sum(monthBills);
  const lastMRev   = sum(lastMBills);
  const trend      = lastMRev === 0 ? null : Math.round(((monthRev - lastMRev) / lastMRev) * 100);

  const custMap = {};
  monthBills.forEach(b => { custMap[b.name] = (custMap[b.name] || 0) + (b.total || 0); });
  const topEntry   = Object.entries(custMap).sort((a, b) => b[1] - a[1])[0];
  const topCustomer = topEntry ? { name: topEntry[0], amount: topEntry[1] } : null;

  const chart7Days = Array.from({ length: 7 }, (_, i) => {
    const d   = new Date(now);
    d.setDate(now.getDate() - (6 - i));
    const key = d.toISOString().split('T')[0];
    return { label: d.toLocaleDateString('en-IN', { weekday: 'short' }), revenue: sum(bills.filter(b => b.date === key)) };
  });

  const itemMap = {};
  bills.forEach(b => (b.items || []).forEach(it => { itemMap[it.desc] = (itemMap[it.desc] || 0) + (it.qty || 0); }));
  const topItems = Object.entries(itemMap).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, qty]) => ({ name, qty }));

  res.json({
    stats: {
      monthOrders:  monthBills.length,
      monthRevenue: monthRev,
      monthAvg:     monthBills.length ? Math.round(monthRev / monthBills.length) : 0,
      todayOrders:  todayBills.length,
      todayRevenue: sum(todayBills),
      topCustomer,
      trend
    },
    chart7Days,
    topItems,
    recentBills: [...bills].sort((a, b) => b.id - a.id).slice(0, 5)
  });
});

// ─── REPORTS ─────────────────────────────────────────────────────────────────
app.get('/api/reports', (req, res) => {
  const db = readDB();
  let bills = db.bills;
  if (req.query.from) bills = bills.filter(b => b.date >= req.query.from);
  if (req.query.to)   bills = bills.filter(b => b.date <= req.query.to);

  const totalRevenue = bills.reduce((s, b) => s + (b.total || 0), 0);
  const totalOrders  = bills.length;
  const custMap = {}, itemMap = {}, dayMap = {};

  bills.forEach(b => {
    custMap[b.name] = (custMap[b.name] || 0) + (b.total || 0);
    if (b.date) dayMap[b.date] = (dayMap[b.date] || 0) + (b.total || 0);
    (b.items || []).forEach(it => { itemMap[it.desc] = (itemMap[it.desc] || 0) + (it.qty || 0); });
  });

  const now = new Date();
  const dailyRevenue = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(now);
    d.setDate(now.getDate() - (13 - i));
    const key = d.toISOString().split('T')[0];
    return { date: key, revenue: dayMap[key] || 0 };
  });

  res.json({
    summary: {
      totalOrders,
      totalRevenue,
      avgBill:         totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
      maxBill:         bills.length ? Math.max(...bills.map(b => b.total || 0)) : 0,
      uniqueCustomers: new Set(bills.map(b => b.name)).size,
      menuItemsUsed:   Object.keys(itemMap).length
    },
    topCustomers: Object.entries(custMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, amount]) => ({ name, amount })),
    topMenuItems: Object.entries(itemMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, qty])    => ({ name, qty })),
    dailyRevenue
  });
});

// ─── EXPORT CSV ──────────────────────────────────────────────────────────────
app.get('/api/export/csv', (req, res) => {
  const db   = readDB();
  const rows = [['ID','Name','Phone','Address','Date','Time','Items','Subtotal','Discount','Advance','Total','Notes']];
  db.bills.forEach(b => {
    const itemStr = (b.items || []).map(i => `${i.desc}x${i.qty}@${i.price}`).join(' | ');
    rows.push([b.id, b.name, b.number||'', b.address||'', b.date, b.time||'',
               itemStr, b.sub||0, b.discount||0, b.advance||0, b.total||0, b.notes||'']);
  });
  const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n');
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename=ashok_bills_${new Date().toISOString().split('T')[0]}.csv`);
  res.send(csv);
});

// ─── BACKUP & RESTORE ────────────────────────────────────────────────────────
app.get('/api/backup', (req, res) => {
  res.json({ backup: readDB() });
});

app.post('/api/restore', (req, res) => {
  const db = readDB();
  const { bills, menuItems, settings } = req.body;
  if (bills)     db.bills      = bills;
  if (menuItems) db.menuItems  = menuItems;
  if (settings)  db.settings   = { ...db.settings, ...settings };
  db.nextBillId = bills && bills.length ? Math.max(...bills.map(b => b.id)) + 1 : 1;
  writeDB(db);
  res.json({ ok: true, bills: db.bills.length });
});

// ─── START ───────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🍽️  Ashok Mess Server → http://localhost:${PORT}\n`);
});