import express from 'express';
import crypto  from 'crypto';
import fs      from 'fs-extra';
import path    from 'path';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

export const app = express();

/* Lấy raw body để verify chữ ký */
app.use(express.json({
  verify: (req, res, buf) => { req.rawBody = buf; }
}));

app.post('/webhook/casso', async (req, res) => {
  /* --- 1. Xác thực chữ ký --- */
  const sig = req.headers['x-casso-signature'];
  const hmac = crypto.createHmac('sha256', process.env.CASSO_WEBHOOK_SECRET)
                     .update(req.rawBody)
                     .digest('hex');
  if (sig !== hmac) {
    console.warn('❌ Sai chữ ký, bỏ qua webhook');
    return res.status(401).end();
  }

  /* --- 2. Lấy client Discord --- */
  const client = global.discordClient;
  if (!client) {
    console.error('⚠️  Discord client chưa sẵn sàng!');
    return res.status(503).end();
  }

  /* --- 3. Đọc & đối chiếu đơn hàng --- */
  const ordersPath = path.join(__dirname, '..', 'data', 'orders.json');
  const orders = await fs.readJSON(ordersPath).catch(() => []);

  for (const tx of req.body.data || []) {
    const amount = parseInt(tx.amount, 10);
    const desc   = tx.description?.trim() || '';

    const order = orders.find(o =>
      o.status === 'PENDING' &&
      o.amount === amount &&
      desc.includes(o.orderCode)           // so khớp “contains”
    );

    if (order) {
      order.status = 'PAID';
      order.paidAt = Date.now();

      try {
        const channel = await client.channels.fetch(order.channelId);
        await channel.send(
          `✅ **Thanh toán thành công:** ${amount.toLocaleString()} VND\n` +
          `Đơn \`${order.orderCode}\` của <@${order.userId}> đã được ghi nhận.`
        );
      } catch (err) {
        console.error('Lỗi gửi tin nhắn:', err);
      }
    }
  }

  await fs.writeJSON(ordersPath, orders, { spaces: 2 });
  res.json({ ok: true });
});
