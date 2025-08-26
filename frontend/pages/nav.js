import { useState } from 'react';
export default function NAV(){
  const [code, setCode] = useState('120503');
  const [data, setData] = useState(null);
  const [err, setErr] = useState('');
  async function load(){
    setErr(''); setData(null);
    try{
      const res = await fetch('/api/amfi/nav?code='+encodeURIComponent(code));
      const j = await res.json();
      if(res.ok && j.ok) setData(j); else setErr(j.error || 'Unknown error');
    }catch(e){ setErr(e.message); }
  }
  return (
    <>
      <header><h2>moneymaher — NAV Lookup</h2></header>
      <main>
        <article className="card">
          <label>Scheme Code <input value={code} onChange={e=>setCode(e.target.value)} /></label>
          <button className="cta" onClick={load}>Fetch NAV</button>
          {err && <p className="muted">Error: {err}</p>}
          {data && <div style={{marginTop:12}}><b>{data.name}</b><br/>Code: {data.code}<br/>NAV: ₹{data.nav}<br/>Date: {data.date}</div>}
        </article>
      </main>
    </>
  );
}
