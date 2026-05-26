// db.js — JSON file-based database using lowdb
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const dbPath = join(__dirname, 'data', 'db.json');

// Default data structure (mirrors what frontend used in localStorage)
const defaultData = {
  bills: [],          // All billing records
  menuItems: [        // Menu items list
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
    bizName: 'Ashok Mess',
    location: 'Uppiliyapuram',
    phone: '8489690007',
    address: 'No -7, AGM Medical back side, Main Road, UPPILIAPURAM-621011',
    footer: 'Thank you for your order!',
    autoDate: true,
    preview: true,
    confirm: true,
    sound: false
  },
  users: [],          // Staff/admin users
  nextBillId: 1       // Auto-increment counter for bill IDs
};

let db;

export async function initDB() {
  // Ensure data directory exists
  const { mkdir } = await import('fs/promises');
  const dataDir = join(__dirname, 'data');
  await mkdir(dataDir, { recursive: true });

  const adapter = new JSONFile(dbPath);
  db = new Low(adapter, defaultData);
  await db.read();

  // Merge any missing keys from default (safe migration)
  let dirty = false;
  for (const [key, val] of Object.entries(defaultData)) {
    if (db.data[key] === undefined) {
      db.data[key] = val;
      dirty = true;
    }
  }
  if (dirty) await db.write();

  console.log(`✅ Database ready at ${dbPath}`);
  return db;
}

export function getDB() {
  if (!db) throw new Error('Database not initialized. Call initDB() first.');
  return db;
}