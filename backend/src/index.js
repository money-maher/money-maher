import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import fetch from 'node-fetch';
import { placeBseOrder } from './services/bse.js';
dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json({limit:'1mb'}));
app.use(cors({ origin: (process.env.CORS_ORIGIN||'*').split(',') }));
app.use(rateLimit({ windowMs: 15*60*1000, max: 300 }));

app.get('/api/health', (_req, res) => res.json({ ok:true, ts: new Date().toISOString() }));

app.get('/api/amfi/nav', async (req, res) => {
  const code = req.query.code;
  if(!code) return res.status(400).json({ ok:false, error:'Missing code' });
  try{
    const r = await fetch(process.env.AMFI_NAV_URL);
    const txt = await r.text();
    const line = txt.split(/\r?\n/).find(l => l.startsWith(code + ';') || l.startsWith(code + '|'));
    if(!line) return res.status(404).json({ ok:false, error:'Scheme not found' });
    const parts = line.split(/\||;/);
    const nav = Number(parts[4] || parts[3] || 0);
    const name = parts[3] || 'Unknown';
    const date = parts[5] || '';
    return res.json({ ok:true, code, name, nav, date });
  }catch(e){ return res.status(500).json({ ok:false, error: e.message }); }
});

app.post('/api/bse/order', async (req, res) => {
  const body = req.body || {};
  if(!body.clientCode || !body.schemeCode || !body.amount){
    return res.status(400).json({ ok:false, error:'Missing fields' });
  }
  try{
    const result = await placeBseOrder(body);
    if(result.ok) return res.json({ ok:true, ref: result.ref });
    return res.status(400).json({ ok:false, error: result.error, raw: result.raw });
  }catch(e){ return res.status(500).json({ ok:false, error: e.message }); }
});

app.post('/api/bse/batch', (req, res) => {
  const orders = req.body?.orders || [];
  const rows = orders.map(o => [process.env.BSE_MEMBER_ID, o.clientCode, o.schemeCode, o.orderType, o.amount].join('|'));
  const file = rows.join('\n');
  res.setHeader('Content-Disposition','attachment; filename=batch.txt');
  res.type('text/plain').send(file);
});

app.post('/api/bse/webhook', (req, res) => {
  console.log('BSE webhook payload:', req.body); // TODO: verify signature
  res.json({ ok:true });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Backend up on', port));
