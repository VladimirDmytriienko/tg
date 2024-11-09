import { Telegraf, Context } from 'telegraf';
import { handleStart } from './commands/start';
import { generatorLink } from './services/generatorLink';
import { parser } from './services/parser';
const port = process.env.PORT || 3000;
const bot = new Telegraf<Context>(process.env.BOT_API_KEY as string);


bot.start(handleStart);


bot.on('message', async (ctx) => {
    console.log(ctx?.message?.chat);
    const url = (ctx.message as any)?.text || '';
    const videoId = parser(url);

    if (videoId) {
        await ctx.sendChatAction('upload_voice');
        const audioUrl = await generatorLink(videoId);
        if (audioUrl) {
            await ctx.replyWithAudio({ url: audioUrl });
        } else {
            await ctx.reply('Sorry, could not fetch audio link.');
        }
    } else {
        await ctx.reply('Please send a valid YouTube video link.');
    }
});

export default bot;
