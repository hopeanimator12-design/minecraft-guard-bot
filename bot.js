const { createClient } = require('bedrock-protocol');

const bot = createClient({
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit',
  version: '1.26.0' // versi yang kau nak letak
});

const OWNER = '.WateryDuck7656';

bot.on('spawn', () => {
  console.log('Bot dah masuk server!');
});

// Auto reconnect (24 JAM AKTIF)
bot.on('disconnect', () => {
  console.log('Disconnected... reconnecting');
  setTimeout(() => startBot(), 5000);
});

bot.on('error', (err) => {
  console.log('Error:', err);
});

// FUNCTION START BOT
function startBot() {
  console.log('Restart bot...');
}

// Basic movement (gerak sikit supaya tak AFK)
setInterval(() => {
  bot.queue('player_auth_input', {
    pitch: 0,
    yaw: Math.random() * 360,
    position: bot.entity?.position || { x: 0, y: 0, z: 0 },
    moveVector: { x: 0, z: 1 },
    headYaw: 0,
    inputData: {
      forward: true
    }
  });
}, 3000);

// Detect player (basic je)
bot.on('add_player', (player) => {
  if (player.username !== OWNER) {
    console.log('Player musuh:', player.username);
  }
});
