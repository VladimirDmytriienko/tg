import https from 'https';

export async function generatorLink(videoId: string): Promise<string> {
    const options = {
        hostname: 'youtube-mp36.p.rapidapi.com',
        path: `/dl?id=${videoId}`,
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': process.env.RAPIDAPI_KEY as string,
            'X-RapidAPI-Host': 'youtube-mp36.p.rapidapi.com'
        }
    };

    return new Promise((resolve, reject) => {
        https.get(options, (res) => {
            let data = '';

            res.on('data', (chunk) => (data += chunk));
            res.on('end', () => {
                try {
                    const parsedData = JSON.parse(data);
                    resolve(parsedData.link || '');
                } catch (error) {
                    console.error('Error parsing response:', error);
                    reject(error);
                }
            });
        }).on('error', (error) => {
            console.error('Request error:', error);
            reject(error);
        });
    });
}
