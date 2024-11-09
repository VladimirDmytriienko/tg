import { Context } from 'telegraf';

export const handleStart = (ctx: Context) => {
    ctx.reply('Hello! Send me a YouTube video link, and I’ll provide an audio file.');
};
