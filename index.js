require('dotenv').config();
const https = require('https');
const { Telegraf } = require('telegraf');

const bot = new Telegraf(process.env.BOT_API_KEY);

// Function to parse YouTube ID from URL
function parser(url) {
    const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
}

// Function to get audio link without axios
async function generatorLink(videoId) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'youtube-mp36.p.rapidapi.com',
            path: `/dl?id=${videoId}`,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY,
                'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';

            // A chunk of data has been received.
            res.on('data', (chunk) => {
                data += chunk;
            });

            // The whole response has been received.
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData.link);
                } catch (error) {
                    console.log('Error parsing response:', error);
                    resolve('');
                }
            });
        });

        req.on('error', (error) => {
            console.error('Error making request:', error);
            resolve('');
        });

        req.end();
    });
}

// Bot command to greet users
bot.start((ctx) => {
    ctx.reply('Hello! Send me a YouTube video link, and I’ll provide an audio file.');
});

// Main message handler
bot.on('message', async (ctx) => {
    const url = ctx.message.text;
    const videoId = parser(url);

    if (videoId) {
        const audioUrl = await generatorLink(videoId);
        if (audioUrl) {
            // Sending the audio file directly without additional text
            ctx.replyWithAudio({ url: audioUrl });
        } else {
            ctx.reply('Sorry, could not fetch audio link.');
        }
    } else {
        ctx.reply('Please send a valid YouTube video link.');
    }
});

// Launch the bot
bot.launch();
console.log('Bot is running...');
