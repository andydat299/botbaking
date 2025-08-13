import {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField
} from 'discord.js';

import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  data: new SlashCommandBuilder()
    .setName('thunhap')
    .setDescription('Kiểm tra tổng thu nhập từ thanh toán (chỉ admin)')
    .addStringOption(o =>
      o.setName('filter')
      .setDescription('Bộ lọc thời gian')
      .setRequired(false)
      .addChoices(
        { name: 'Hôm nay', value: 'today' },
        { name: '7 ngày qua', value: 'week' },
        { name: 'Tháng này', value: 'month' },
        { name: 'Tất cả', value: 'all' }
      )),

  async execute(interaction) {
    try {
      await interaction.deferReply({ ephemeral: true });

      // 1. Kiểm tra quyền admin
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.editReply({
          content: '🚫 Bạn cần quyền **Administrator** để dùng lệnh này.'
        });
      }

      // 2. Đọc dữ liệu đơn hàng
      const ordersPath = path.join(__dirname, '..', 'data', 'orders.json');
      const orders = await fs.readJSON(ordersPath).catch(() => []);

      // 3. Lọc đơn hàng đã thanh toán
      const paidOrders = orders.filter(order => order.status === 'PAID');

      if (paidOrders.length === 0) {
        return await interaction.editReply({
          content: '📊 Chưa có đơn hàng nào được thanh toán thành công.'
        });
      }

      // 4. Áp dụng bộ lọc thời gian
      const filter = interaction.options.getString('filter') || 'all';
      const now = new Date();
      let filteredOrders = paidOrders;

      switch (filter) {
        case 'today':
          const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
          filteredOrders = paidOrders.filter(order => order.paidAt >= todayStart);
          break;
        
        case 'week':
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).getTime();
          filteredOrders = paidOrders.filter(order => order.paidAt >= weekAgo);
          break;
        
        case 'month':
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).getTime();
          filteredOrders = paidOrders.filter(order => order.paidAt >= monthStart);
          break;
        
        case 'all':
        default:
          filteredOrders = paidOrders;
          break;
      }

      // 5. Tính toán thống kê
      const totalRevenue = filteredOrders.reduce((sum, order) => sum + order.amount, 0);
      const totalOrders = filteredOrders.length;
      const averageAmount = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

      // 6. Tạo embed thống kê
      const filterNames = {
        'today': 'Hôm nay',
        'week': '7 ngày qua',
        'month': 'Tháng này',
        'all': 'Tất cả thời gian'
      };

      const embed = new EmbedBuilder()
        .setTitle('📊 Báo Cáo Thu Nhập')
        .setDescription(`**Thời gian:** ${filterNames[filter]}`)
        .addFields(
          {
            name: '💰 Tổng Thu Nhập',
            value: `${totalRevenue.toLocaleString('vi-VN')} VND`,
            inline: true
          },
          {
            name: '📦 Số Đơn Hàng',
            value: `${totalOrders} đơn`,
            inline: true
          },
          {
            name: '📈 Trung Bình/Đơn',
            value: `${averageAmount.toLocaleString('vi-VN')} VND`,
            inline: true
          }
        )
        .setColor(0x00ff00)
        .setFooter({ text: 'PayBot • Revenue Report' })
        .setTimestamp();

      // 7. Thêm danh sách đơn hàng gần nhất (tối đa 5 đơn)
      if (filteredOrders.length > 0) {
        const recentOrders = filteredOrders
          .sort((a, b) => b.paidAt - a.paidAt)
          .slice(0, 5);

        const ordersList = recentOrders.map((order, index) => {
          const date = new Date(order.paidAt).toLocaleDateString('vi-VN');
          return `${index + 1}. \`${order.orderCode}\` - ${order.amount.toLocaleString('vi-VN')} VND (${date})`;
        }).join('\n');

        embed.addFields({
          name: '🕒 Đơn Hàng Gần Nhất',
          value: ordersList,
          inline: false
        });
      }

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error('❌ Lỗi xử lý revenue command:', err);
      await interaction.editReply({
        content: '❌ Đã có lỗi xảy ra khi tạo báo cáo thu nhập.'
      });
    }
  }
};
