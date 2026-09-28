import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

// ── Inline mock data (mirrors frontend) ──────────────────────────────────────
function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const rand = mulberry32(42);
const randRange = (min, max) => min + rand() * (max - min);
const randInt = (min, max) => Math.round(randRange(min, max));

const district = { name: 'Dehradun', state: 'Uttarakhand' };

const blockSummaries = [
  { id: 'chakrata', name: 'Chakrata', elevation: 2100, tempHigh: 20, tempLow: 8, rainfall: 18, panchayatCount: 4 },
  { id: 'kalsi', name: 'Kalsi', elevation: 850, tempHigh: 28, tempLow: 16, rainfall: 14, panchayatCount: 4 },
  { id: 'vikasnagar', name: 'Vikasnagar', elevation: 620, tempHigh: 31, tempLow: 19, rainfall: 12, panchayatCount: 4 },
  { id: 'sahaspur', name: 'Sahaspur', elevation: 520, tempHigh: 33, tempLow: 20, rainfall: 10, panchayatCount: 4 },
  { id: 'raipur', name: 'Raipur', elevation: 430, tempHigh: 35, tempLow: 22, rainfall: 8, panchayatCount: 4 },
  { id: 'doiwala', name: 'Doiwala', elevation: 380, tempHigh: 36, tempLow: 23, rainfall: 7, panchayatCount: 4 },
];

// In-memory feedback store
const feedbackStore = [];

// ── Routes ───────────────────────────────────────────────────────────────────
app.get('/api/district', (req, res) => {
  res.json({ district, blocks: blockSummaries, totalPanchayats: 24 });
});

app.get('/api/blocks', (req, res) => {
  res.json(blockSummaries);
});

app.get('/api/blocks/:id', (req, res) => {
  const block = blockSummaries.find(b => b.id === req.params.id);
  if (!block) return res.status(404).json({ error: 'Block not found' });
  res.json(block);
});

app.get('/api/feedback', (req, res) => {
  res.json(feedbackStore.slice(-50));
});

app.post('/api/feedback', (req, res) => {
  const { panchayatId, date, event, notes } = req.body;
  if (!panchayatId || !date || !event) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const entry = {
    id: `fb_${Date.now()}`,
    panchayatId,
    date,
    event,
    notes: notes || '',
    verified: false,
    createdAt: new Date().toISOString(),
  };
  feedbackStore.push(entry);
  res.status(201).json({ success: true, entry });
});

app.get('/api/stats', (req, res) => {
  res.json({
    totalPanchayats: 24,
    verifiedReports: feedbackStore.filter(f => f.verified).length + 32,
    avgAccuracy: 82.4,
    activeAlerts: 3,
    lastUpdated: new Date().toISOString(),
  });
});

// ── Health ────────────────────────────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

const PORT = process.env.PORT || 3001;
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🌾 KrishiDrishti API server running on http://localhost:${PORT}`);
  });
}

export default app;
