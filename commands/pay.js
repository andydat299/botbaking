import {
  SlashCommandBuilder,
  EmbedBuilder,
  AttachmentBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

import axios from 'axios';
import * as dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import config from '../config.json' with { type: 'json' };

dotenv.config();

const ACCOUNT_NO = '0908101465';
const ACCOUNT_NAME = 'Van Thuy Vy';
const ACQ_ID = 970422;
const TEMPLATE = 'print';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Track processed interactions để tránh duplicate
const processedInteractions = new Set();

// Function để parse số tiền với k (nghìn) và m (triệu)
function parseAmount(input) {
  const cleanInput = input.toString().toLowerCase().trim();
  
  if (cleanInput.endsWith('k')) {
    const number = parseFloat(cleanInput.slice(0, -1));
    if (isNaN(number)) return NaN;
    return Math.floor(number * 1000);
  } else if (cleanInput.endsWith('m')) {
    const number = parseFloat(cleanInput.slice(0, -1));
    if (isNaN(number)) return NaN;
    return Math.floor(number * 1000000);
  } else {
    const number = parseInt(cleanInput, 10);
    return number;
  }
}

export default {
  data: new SlashCommandBuilder()
    .setName('pay')
    .setDescription('Tạo mã QR thanh toán')
    .addStringOption(o =>
      o.setName('sotien').setDescription('Số tiền VND (hỗ trợ k=nghìn, m=triệu. VD: 100k, 1.5m)').setRequired(true)),

  async execute(interaction) {
    try {
      // Kiểm tra nếu interaction đã được processed
      if (processedInteractions.has(interaction.id)) {
        console.warn('⚠️ Interaction đã được xử lý rồi, bỏ qua...');
        return;
      }

      // Thêm vào set để track
      processedInteractions.add(interaction.id);
      
      // Dọn dẹp old interactions (giữ 100 interactions gần nhất)
      if (processedInteractions.size > 100) {
        const arr = Array.from(processedInteractions);
        processedInteractions.clear();
        arr.slice(-50).forEach(id => processedInteractions.add(id));
      }

      await interaction.deferReply({ ephemeral: false });

      const startTime = Date.now();

      // 1. Kiểm tra quyền
      if (!interaction.memberPermissions?.has(PermissionsBitField.Flags.Administrator)) {
        return await interaction.editReply({
          content: '🚫 Bạn cần quyền **Administrator** để dùng lệnh này.'
        });
      }

      const amountInput = interaction.options.getString('sotien');
      const amount = parseAmount(amountInput);
      
      console.log(`📝 Parsing amount: "${amountInput}" -> ${amount}`);
      
      // Kiểm tra số tiền hợp lệ
      if (isNaN(amount) || amount <= 0) {
        return await interaction.editReply({
          content: '❌ Số tiền không hợp lệ! Vui lòng nhập số tiền dương.\n' +
                   'Ví dụ: `100000`, `100k`, `1.5m`'
        });
      }
      
      const randomNumbers = Math.floor(Math.random() * 900) + 100;
      const orderCode = `PAYMIDNIGHT${randomNumbers}`;

      // 2. Gọi API VietQR
      let qrBase64;
      try {
        const { data } = await axios.post(
          'https://api.vietqr.io/v2/generate',
          {
            accountNo: ACCOUNT_NO,
            accountName: ACCOUNT_NAME,
            acqId: ACQ_ID,
            amount,
            addInfo: orderCode,
            template: TEMPLATE
          },
          {
            headers: {
              'x-client-id': process.env.VIETQR_CLIENT_ID,
              'x-api-key': process.env.VIETQR_API_KEY
            }
          }
        );

        if (data.code !== '00') throw new Error(data.desc || 'VietQR lỗi');
        qrBase64 = data.data.qrDataURL;

      } catch (err) {
        console.error('❌ VietQR API error:', err?.response?.data || err.message);
        return await interaction.editReply({ content: '❌ Không thể tạo mã QR, thử lại sau!' });
      }

      // 3. Ghi đơn hàng
      const ordersPath = path.join(__dirname, '..', 'data', 'orders.json');
      const orders = await fs.readJSON(ordersPath).catch(() => []);
      orders.push({
        orderCode,
        amount: amount,
        userId: interaction.user.id,
        channelId: interaction.channelId,
        status: 'PENDING',
        createdAt: Date.now()
      });
      await fs.writeJSON(ordersPath, orders, { spaces: 2 });

      // 4. Gửi QR
      const buffer = Buffer.from(qrBase64.split(',')[1], 'base64');
      const attachment = new AttachmentBuilder(buffer, { name: 'qr.png' });

      const embed = new EmbedBuilder()
        .setTitle('🧾 Mã QR Thanh Toán')
        .setDescription(
          `• **Số tiền:** ${amount.toLocaleString('vi-VN')} VND\n` +
          `• **Nội dung:** \`${orderCode}\`\n\n` +
          'Quét QR để thanh toán. Hệ thống sẽ tự xác nhận khi nhận tiền.'
        )
        .setImage('attachment://qr.png')
        .setColor(0x00bcd4)
        .setFooter({ text: 'PayBot • VietQR' })
        .setTimestamp();

      // Tạo nút checkpay
      const checkPayButton = new ButtonBuilder()
        .setCustomId(`checkpay_${orderCode}`)
        .setLabel('🔍 Kiểm tra thanh toán')
        .setStyle(ButtonStyle.Primary);

      const row = new ActionRowBuilder()
        .addComponents(checkPayButton);

      await interaction.editReply({ 
        embeds: [embed], 
        files: [attachment], 
        components: [row] 
      });

      console.log(`✅ Pay command processed in ${Date.now() - startTime}ms`);

    } catch (err) {
      console.error('❌ Lỗi xử lý pay command:', err);
      
      if (interaction.deferred && !interaction.replied) {
        try {
          await interaction.editReply({
            content: '❌ Đã có lỗi xảy ra trong quá trình xử lý.'
          });
        } catch (replyError) {
          console.error('❌ Lỗi khi gửi error message:', replyError);
        }
      }
    }
  }
};
