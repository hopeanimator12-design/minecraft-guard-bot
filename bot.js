const { createClient } = require('bedrock-protocol');

const CONFIG = {
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit',
  version: '1.26.0' // guna version betul
};

let bot;

function startBot() {
  console.log('Starting bot...');

  bot = createClient(CONFIG);

  // Bila dah masuk world
  bot.on('spawn', () => {
    console.log('✅ Bot masuk server!');

    // Anti AFK movement
    setInterval(() => {
      if (!bot.entity || !bot.entity.position) return;

      try {
        bot.queue('player_auth_input', {
          pitch: 0,
          yaw: Math.random() * 360,
          position: bot.entity.position,
          moveVector: { x: 0, z: 0.2 },
          headYaw: 0,
          inputData: {
            forward: true,
            jumping: Math.random() > 0.8
          }
        });
      } catch (e) {
        console.log("Movement error:", e.message);
      }
    }, 5000);
  });

  // Log chat
  bot.on('text', (packet) => {
    console.log('CHAT:', packet.message);
  });

  // Auto reconnect (24 jam)
  bot.on('disconnect', () => {
    console.log('❌ Disconnect! Reconnecting 5s...');
    setTimeout(startBot, 5000);
  });

  bot.on('error', (err) => {
    console.log('Error:', err.message);
  });
}

// Start pertama kali
startBot();
