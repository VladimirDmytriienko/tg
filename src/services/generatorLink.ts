import https from 'https';
import { IncomingMessage } from 'http';

export async function generatorLink(videoId: string): Promise<string> {
    return new Promise((resolve) => {
        const options = {
            hostname: 'youtube-mp36.p.rapidapi.com',
            path: `/dl?id=${videoId}`,
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string,
                'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
            }
        };

        const req = https.request(options, (res: IncomingMessage) => {
            let data = '';

            res.on('data', (chunk: any) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData.link || '');
                } catch (error) {
                    console.error('Error parsing response:', error);
                    resolve('');
                }
            });
        });

        req.on('error', (error: Error) => {
            console.error('Error making request:', error);
            resolve('');
        });

        req.end();
    });
}
