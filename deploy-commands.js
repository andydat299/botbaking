/**
 * Đăng ký slash command cục bộ hoặc toàn cục.
 */
import { REST, Routes } from 'discord.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import config from './config.json' assert { type: 'json' };
import * as dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  commands.push(command.default.data.toJSON());
}

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

try {
  console.log('Started refreshing application (/) commands.');
  if (config.GUILD_ID && config.GUILD_ID !== 'OPTIONAL_TEST_GUILD_ID') {
    await rest.put(
      Routes.applicationGuildCommands(process.env.CLIENT_ID, config.GUILD_ID),
      { body: commands },
    );
    console.log('Successfully reloaded guild application (/) commands.');
  } else {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: commands },
    );
    console.log('Successfully reloaded global application (/) commands.');
  }
} catch (error) {
  console.error(error);
}
