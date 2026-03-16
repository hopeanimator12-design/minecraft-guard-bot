const { createClient } = require('bedrock-protocol');

const bot = createClient({
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit'
});

const OWNER = '.WateryDuck7656';

bot.on('spawn', () => {
  console.log('Bot dah masuk!');
});

// Contoh basic (BELUM attack AI penuh)
bot.on('text', (packet) => {
  console.log(packet);
});
