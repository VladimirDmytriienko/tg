import * as dotenv from 'dotenv';
dotenv.config();
import bot from './src/bot';
import http from 'http';

const port = process.env.PORT || 3000;

bot.launch()
  .then(() => {
    console.log('Bot is running with long polling...');
  })
  .catch((err) => {
    console.error('Failed to launch bot:', err);
  });

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Bot is running\n');
});

server.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
  keepAlive(); 
});

const keepAlive = () => {
  setInterval(() => {
    const url = process.env.SERVER_URL || 'http://localhost:' + port;
    http.get(url, (res) => {
      res.on('data', () => {});
      res.on('end', () => {});
    }).on('error', (err) => {
      console.error('Error in keepAlive:', err.message);
    });
  }, 45000); 
};
