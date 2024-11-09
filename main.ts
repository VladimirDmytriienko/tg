import * as dotenv from 'dotenv';
dotenv.config();
import bot from './src/bot';

bot.launch();
console.log('Bot is running...');
