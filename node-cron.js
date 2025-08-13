// server.js (hoặc file riêng)
import cron from 'node-cron';
import { listTransactions } from './libs/casso.js';
import fs from 'fs-extra';
import path from 'path';

cron.schedule('*/1 * * * *', async () => {     // cứ 1 phút chạy
  const client = global.discordClient;
  if (!client) return;

  const today  = new Date().toISOString().slice(0,10);
  const txs    = await listTransactions(today);
  const ordersPath = path.join(process.cwd(),'data','orders.json');
  const orders = await fs.readJSON(ordersPath).catch(()=>[]);

  for (const tx of txs) {
    const od = orders.find(o =>
      o.status==='PENDING' &&
      o.amount===tx.amount &&
      tx.description.includes(o.orderCode)
    );
    if (!od) continue;

    od.status='PAID'; od.paidAt=tx.when;
    try {
      const ch = await client.channels.fetch(od.channelId);
      await ch.send(
        `✅ **Đã nhận ${tx.amount.toLocaleString()} VND**\n` +
        `Đơn \`${od.orderCode}\` của <@${od.userId}>.`
      );
    } catch(e){ console.warn('Gửi tin lỗi:',e.message);}
  }
  await fs.writeJSON(ordersPath, orders,{spaces:2});
});
