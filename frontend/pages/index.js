import Link from 'next/link';
export default function Home(){
  return (
    <>
      <header><h2>moneymaher</h2></header>
      <main>
        <article className="card">
          <h1 style={{marginTop:0}}>Mutual Fund investing made simple</h1>
          <p className="muted">Place orders via BSE StAR MF* and check live NAVs from AMFI.</p>
          <div className="grid" style={{marginTop:12}}>
            <Link className="card" href="/mf"><h3>Investment Console →</h3><p>Buy/Redeem, order status and more.</p></Link>
            <Link className="card" href="/nav"><h3>NAV Lookup →</h3><p>Fetch latest NAV for any scheme code.</p></Link>
          </div>
          <p className="muted" style={{marginTop:10,fontSize:13}}>* Exchange integration requires your member sandbox/production credentials configured on the backend.</p>
        </article>
        <article className="card"><h3>Contact</h3><p>Email: moneymaherservices@gmail.com • Phone: +91 70162 94207</p></article>
      </main>
      <footer>© {new Date().getFullYear()} moneymaher</footer>
    </>
  );
}
