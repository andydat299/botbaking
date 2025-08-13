import {
  Client,
  GatewayIntentBits,
  Collection,
  Events
} from 'discord.js';
import * as dotenv from 'dotenv';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.json' with { type: 'json' };   // ↔ tránh cảnh báo 'assert'

/* ───────────────────────── ENV & WEBHOOK ───────────────────────── */
dotenv.config();
import './server.js';          // webhook Express (casso)
import { initializeDataStructure } from './libs/dataInit.js';

/* ───────────────────────── INIT CLIENT ─────────────────────────── */
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

// Khởi tạo data structure
await initializeDataStructure();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();

/* ───── Load tất cả command .js trong /commands ───── */
const cmdPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(cmdPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const cmd = await import(`./commands/${file}`);
    const command = cmd.default;
    
    if (command && command.data && command.data.name) {
      client.commands.set(command.data.name, command);
      console.log(`✅ Loaded command: ${command.data.name}`);
    } else {
      console.warn(`⚠️ Command file ${file} không có cấu trúc hợp lệ`);
    }
  } catch (error) {
    console.error(`❌ Lỗi load command ${file}:`, error.message);
  }
}

/* ───────────────────────── READY ─────────────────────────── */
client.once(Events.ClientReady, () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
  global.discordClient = client;              // webhook sẽ dùng
});

/* ───────────────────────── INTERACTION HANDLER ───────────── */
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      // Kiểm tra nếu interaction đã được xử lý
      if (interaction.replied || interaction.deferred) {
        console.warn('⚠️ Interaction đã được xử lý rồi, bỏ qua...');
        return;
      }

      const command = client.commands.get(interaction.commandName);
      if (!command) {
        console.error(`❌ Không tìm thấy command: ${interaction.commandName}`);
        return;
      }

      await command.execute(interaction);
    }
    // Xử lý button interactions
    else if (interaction.isButton()) {
      if (interaction.customId.startsWith('checkpay_')) {
        const orderCode = interaction.customId.replace('checkpay_', '');
        await handleCheckPayButton(interaction, orderCode);
      }
    }
  } catch (error) {
    console.error('❌ Lỗi xử lý interaction:', error);
    
    // Chỉ reply khi chưa có response
    if (!interaction.replied && !interaction.deferred) {
      try {
        await interaction.reply({
          content: '❌ Đã có lỗi xảy ra khi xử lý lệnh!',
          ephemeral: true
        });
      } catch (replyError) {
        console.error('❌ Không thể gửi error reply:', replyError);
      }
    }
  }
});

// Function xử lý nút kiểm tra thanh toán
async function handleCheckPayButton(interaction, orderCode) {
  await interaction.deferReply({ ephemeral: true });

  try {
    // Import listTransactions function
    const { listTransactions } = await import('./libs/casso.js');
    
    const today = new Date().toISOString().slice(0, 10);
    const txs = await listTransactions(today);
    
    const ordersPath = path.join(__dirname, 'data', 'orders.json');
    const orders = await fs.readJSON(ordersPath).catch(() => []);
    
    // Tìm đơn hàng
    const order = orders.find(o => o.orderCode === orderCode);
    if (!order) {
      return await interaction.editReply('❌ Không tìm thấy đơn hàng!');
    }
    
    if (order.status === 'PAID') {
      return await interaction.editReply('✅ Đơn hàng đã được thanh toán rồi!');
    }
    
    // Tìm giao dịch khớp
    const matchingTx = txs.find(tx => 
      tx.amount === order.amount && 
      tx.description && tx.description.includes(orderCode)
    );
    
    if (matchingTx) {
      // Cập nhật trạng thái
      order.status = 'PAID';
      order.paidAt = matchingTx.when;
      
      await fs.writeJSON(ordersPath, orders, { spaces: 2 });
      
      // Thông báo thành công
      await interaction.editReply(
        `✅ **Thanh toán thành công!**\n` +
        `• Đơn hàng: \`${orderCode}\`\n` +
        `• Số tiền: ${order.amount.toLocaleString('vi-VN')} VND\n` +
        `• Thời gian: ${new Date(matchingTx.when).toLocaleString('vi-VN')}`
      );
      
      // Gửi thông báo public
      try {
        await interaction.followUp({
          content: `🎉 <@${order.userId}> đã thanh toán thành công ${order.amount.toLocaleString('vi-VN')} VND!`,
          ephemeral: false
        });
      } catch (e) {
        console.warn('Không thể gửi thông báo public:', e.message);
      }
      
    } else {
      await interaction.editReply(
        `⏳ **Chưa nhận được thanh toán**\n` +
        `• Đơn hàng: \`${orderCode}\`\n` +
        `• Số tiền: ${order.amount.toLocaleString('vi-VN')} VND\n` +
        `• Vui lòng thử lại sau vài phút`
      );
    }
    
  } catch (error) {
    console.error('❌ Lỗi kiểm tra thanh toán:', error);
    await interaction.editReply('❌ Lỗi khi kiểm tra thanh toán. Vui lòng thử lại sau!');
  }
}

/* ───────────────────────── LOGIN ─────────────────────────── */
client.login(process.env.TOKEN);

/* Bắt mọi unhandled promise để log ra console (giúp debug) */
process.on('unhandledRejection', console.error);
