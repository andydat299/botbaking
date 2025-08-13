import { SlashCommandBuilder } from 'discord.js';
import { listTransactions } from '../libs/casso.js';
import fs from 'fs-extra';
import path from 'path';

export default {
  data: new SlashCommandBuilder()
    .setName('checkpay')
    .setDescription('Quét Casso & xác nhận đơn PENDING hôm nay'),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    try {
      console.log('🔍 Bắt đầu kiểm tra giao dịch Casso...');
      
      const today = new Date().toISOString().slice(0, 10);
      console.log(`📅 Kiểm tra giao dịch ngày: ${today}`);
      
      // Kiểm tra xem Casso API có hoạt động không
      let txs;
      try {
        txs = await listTransactions(today);
        console.log(`📊 Tìm thấy ${txs.length} giao dịch từ Casso`);
      } catch (cassoError) {
        console.error('❌ Lỗi Casso API:', cassoError);
        return await interaction.editReply('❌ Không thể kết nối Casso API. Kiểm tra API key và network!');
      }
      
      const ordersPath = path.join(process.cwd(), 'data', 'orders.json');
      const orders = await fs.readJSON(ordersPath).catch(() => []);
      
      const pendingOrders = orders.filter(o => o.status === 'PENDING');
      console.log(`📋 Có ${pendingOrders.length} đơn hàng PENDING`);

      let hit = 0;
      
      for (const tx of txs) {
        const od = orders.find(o =>
          o.status === 'PENDING' &&
          o.amount === tx.amount &&
          tx.description && tx.description.includes(o.orderCode)
        );
        
        if (!od) continue;

        od.status = 'PAID';
        od.paidAt = tx.when;
        hit++;

        // Gửi thông báo
        try {
          const ch = await interaction.client.channels.fetch(od.channelId);
          await ch.send(
            `✅ **Đã nhận ${tx.amount.toLocaleString('vi-VN')} VND**\n` +
            `Đơn \`${od.orderCode}\` của <@${od.userId}>.`
          );
        } catch (e) { 
          console.warn('Không gửi được thông báo:', e.message); 
        }
      }

      await fs.writeJSON(ordersPath, orders, { spaces: 2 });
      
      await interaction.editReply(
        `🔍 **Kết quả kiểm tra:**\n` +
        `• Tìm thấy ${txs.length} giao dịch hôm nay\n` +
        `• Có ${pendingOrders.length} đơn PENDING\n` +
        `• Đã khớp **${hit}** giao dịch ✅`
      );
      
    } catch (err) {
      console.error('❌ Lỗi checkpay:', err);
      await interaction.editReply('⚠️ Đã có lỗi xảy ra khi kiểm tra giao dịch!');
    }
  }
};