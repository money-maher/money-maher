import {useState} from 'react';
export default function MF(){
  const [clientCode, setClientCode] = useState('CLI001');
  const [schemeCode, setSchemeCode] = useState('120503');
  const [orderType, setOrderType] = useState('PURCHASE');
  const [amount, setAmount] = useState(5000);
  const [paymentMode, setPaymentMode] = useState('UPI');
  const [platform, setPlatform] = useState('bse');
  const [resp, setResp] = useState(null);
  const [msg, setMsg] = useState('');
  async function place(){
    setResp(null); setMsg('Submitting order...');
    try{
      const endpoint = platform === 'bse' ? '/api/bse/order' : '/api/nse/order';
      const r = await fetch(endpoint, {method:'POST',headers:{'Content-Type':'application/json'},body: JSON.stringify({ clientCode, schemeCode, orderType, amount: Number(amount), paymentMode, platform })});
      const j = await r.json();
      setResp(j); setMsg(r.ok ? 'Submitted' : 'Error');
    }catch(e){ setMsg('Network error: '+e.message); }
  }
  return (
    <>
      <header><h2>moneymaher — Investment Console</h2></header>
      <main>
        <article className="card">
          <h3>Place Order</h3>
          <label>Client Code <input value={clientCode} onChange={e=>setClientCode(e.target.value)} /></label>
          <label>Scheme Code <input value={schemeCode} onChange={e=>setSchemeCode(e.target.value)} /></label>
          <label>Order Type<select value={orderType} onChange={e=>setOrderType(e.target.value)}><option value="PURCHASE">PURCHASE</option><option value="REDEEM">REDEEM</option></select></label>
          <label>Amount (₹) <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} /></label>
          <label>Payment Mode<select value={paymentMode} onChange={e=>setPaymentMode(e.target.value)}><option>UPI</option><option>NETBANKING</option><option>CHEQUE</option></select></label>
          <label>Platform<select value={platform} onChange={e=>setPlatform(e.target.value)}><option value="bse">BSE StAR MF</option><option value="nse">NSE NMF II (soon)</option></select></label>
          <button className="cta" onClick={place}>Place Order</button>
          <p className="muted">{msg}</p>
          {resp && <pre style={{whiteSpace:'pre-wrap',background:'#f7f7f7',padding:12,borderRadius:8}}>{JSON.stringify(resp,null,2)}</pre>}
        </article>
      </main>
    </>
  );
}
