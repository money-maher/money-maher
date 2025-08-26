import fs from 'fs';
const rows = [
  ['CLI001','120503','PURCHASE',5000],
  ['CLI002','119546','PURCHASE',10000]
].map(r => r.join('|')).join('\n');
fs.writeFileSync('bulk_orders_sample.txt', rows);
console.log('bulk_orders_sample.txt generated');
