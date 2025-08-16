import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(express.json());

// BSE order placement endpoint
app.post('/api/bse/order', async (req, res) => {
  const { clientCode, schemeCode, orderType, amount, paymentMode } = req.body;
  const xmlReq = `<?xml version="1.0"?>
    <order>
      <memberId>${process.env.BSE_MEMBER_ID}</memberId>
      <password>${process.env.BSE_PASSWORD}</password>
      <clientCode>${clientCode}</clientCode>
      <schemeCode>${schemeCode}</schemeCode>
      <buySell>${orderType}</buySell>
      <amount>${amount}</amount>
      <paymentMode>${paymentMode}</paymentMode>
    </order>`;
  const resp = await fetch(process.env.BSE_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/xml' },
    body: xmlReq
  });
  const text = await resp.text();
  res.json({ ok: true, rawResponse: text });
});

// BSE batch file generator
app.post('/api/bse/batch', (req, res) => {
  const orders = req.body.orders || [];
  const rows = orders.map(o => [
    process.env.BSE_MEMBER_ID,
    o.clientCode,
    o.schemeCode,
    o.orderType,
    o.amount
  ].join("|"));
  const file = rows.join("\n");
  res.setHeader('Content-Disposition','attachment; filename=batch.txt');
  res.send(file);
});

// Webhook handler
app.post('/api/bse/webhook', (req,res) => {
  console.log("BSE Webhook:", req.body);
  res.json({ ok:true });
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log("Backend running on port", port));
