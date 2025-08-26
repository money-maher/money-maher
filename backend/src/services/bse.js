import fetch from 'node-fetch';
export async function placeBseOrder(input){
  const url = process.env.BSE_API_URL;
  if(!url) throw new Error('BSE_API_URL not set');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <OrderRequest>
    <Header>
      <MemberId>${process.env.BSE_MEMBER_ID || ''}</MemberId>
      <Password>${process.env.BSE_PASSWORD || ''}</Password>
      <RequestId>REQ${Math.floor(Math.random()*1e9)}</RequestId>
    </Header>
    <Order>
      <ClientCode>${input.clientCode}</ClientCode>
      <SchemeCode>${input.schemeCode}</SchemeCode>
      <OrderType>${input.orderType}</OrderType>
      <Amount>${input.amount}</Amount>
      <Folio>${input.folio || ''}</Folio>
      <PaymentMode>${input.paymentMode || 'UPI'}</PaymentMode>
      <InvestorName>${input.investorName || ''}</InvestorName>
      <InvestorPAN>${input.investorPAN || ''}</InvestorPAN>
    </Order>
  </OrderRequest>`;
  const resp = await fetch(url,{method:'POST',headers:{'Content-Type':'application/xml','Accept':'application/xml'},body: xml});
  const text = await resp.text();
  if(!resp.ok) return { ok:false, error:`HTTP ${resp.status}`, raw:text };
  const ref = (text.match(/<(?:OrderNo|OrderRef|ReferenceNo)>([^<]+)<\/(?:OrderNo|OrderRef|ReferenceNo)>/i)||[])[1];
  if(ref) return { ok:true, ref, raw:text };
  return { ok:false, error:'No reference found', raw:text };
}
