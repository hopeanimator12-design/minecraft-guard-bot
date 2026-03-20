const { createClient } = require('bedrock-protocol');
const http = require('http');

// 1. WEB SERVER (Wajib untuk Railway)
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("Bot Minecraft Guard Online!");
}).listen(process.env.PORT || 8080);

const CONFIG = {
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit',
  version: '1.26.0',
  offline: true
};

let bot;
let isConnected = false; // Penanda status sambungan

function startBot() {
  console.log('--- Memulakan Bot Minecraft Guard (v1.26.0) ---');

  bot = createClient(CONFIG);

  bot.on('spawn', () => {
    console.log('✅ Bot berjaya masuk server!');
    isConnected = true;
    
    // ANTI-AFK: Pergerakan kepala (Yaw/Pitch) lebih berkesan daripada moveVector
    setInterval(() => {
      if (isConnected) {
        const randomYaw = Math.floor(Math.random() * 360);
        bot.queue('player_auth_input', {
          pitch: 0,
          yaw: randomYaw,
          position: { x: 0, y: 0, z: 0 },
          moveVector: { x: 0, z: 0 },
          headYaw: randomYaw,
          inputData: { _value: 0n } // Menggunakan BigInt untuk input data
        });
      }
    }, 15000); // Setiap 15 saat
  });

  // Pengurusan Ralat & Auto-Reconnect
  bot.on('error', (err) => {
    console.error('⚠️ Error:', err.message);
    isConnected = false;
  });

  bot.on('close', () => {
    console.log('❌ Putus sambungan. Cuba masuk balik dalam 15 saat...');
    isConnected = false;
    setTimeout(startBot, 15000); // Delay lebih lama sedikit untuk elak IP ban
  });

  // Log Chat untuk pantau status server
  bot.on('text', (packet) => {
    if (packet.message) console.log(`[CHAT] ${packet.message}`);
  });
}

startBot();
