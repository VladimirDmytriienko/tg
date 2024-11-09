import * as dotenv from 'dotenv';
dotenv.config();
import bot from './src/bot';
import http from 'http';
import https from 'https';

const port = process.env.PORT || 3000;

bot.launch()
  .then(() => {
    console.log('Bot is running with long polling...');
  })
  .catch((err) => {
    console.error('Failed to launch bot:', err);
  });

const server = http.createServer((req, res) => {
  if (req.url === '/healthcheck') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Healthcheck pass\n');
    console.log('Healthcheck pass');
  } else {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Bot is running\n');
  }
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  keepAlive();
});

const keepAlive = () => {
  setInterval(() => {
    const url = process.env.SERVER_URL || 'http://localhost:' + port;
    const client = url.startsWith('https') ? https : http;
    
    client.get(url + '/healthcheck', (res) => {
      res.on('data', () => {});
      res.on('end', () => {
        console.log('Healthcheck passed');
      });
    }).on('error', (err) => {
      console.error('Error in keepAlive:', err.message);
    });
  }, 45000);
};
