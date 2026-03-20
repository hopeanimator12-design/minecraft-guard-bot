const { createClient } = require('bedrock-protocol');
const http = require('http');

// 1. WEB SERVER (Wajib untuk Railway supaya bot terus aktif)
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("Bot Minecraft Guard (v1.26.0) Online!");
}).listen(process.env.PORT || 8080);

const CONFIG = {
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit',
  version: '1.26.0', // Kekal ikut permintaan
  offline: true,
  connectTimeout: 45000 // Ditambah ke 45 saat untuk elak 'Ping timed out'
};

let bot;
let isConnected = false;
let reconnectTimer;

function startBot() {
  if (isConnected) return;
  
  console.log('--- Memulakan Bot Minecraft Guard (v1.26.0) ---');
  console.log(`Menyambung ke ${CONFIG.host}:${CONFIG.port}...`);

  try {
    bot = createClient(CONFIG);

    bot.on('spawn', () => {
      console.log('✅ Bot berjaya masuk server!');
      isConnected = true;
      
      // ANTI-AFK: Pergerakan kepala setiap 15 saat
      const afkInterval = setInterval(() => {
        if (isConnected) {
          const randomYaw = Math.floor(Math.random() * 360);
          bot.queue('player_auth_input', {
            pitch: 0,
            yaw: randomYaw,
            position: { x: 0, y: 0, z: 0 },
            moveVector: { x: 0, z: 0 },
            headYaw: randomYaw,
            inputData: { _value: 0n }
          });
        } else {
          clearInterval(afkInterval);
        }
      }, 15000);
    });

    // Pengurusan Ralat & Auto-Reconnect
    bot.on('error', (err) => {
      console.error('⚠️ Error:', err.message);
      isConnected = false;
      retryConnection();
    });

    bot.on('close', () => {
      console.log('❌ Putus sambungan dari server.');
      isConnected = false;
      retryConnection();
    });

    // Log Chat
    bot.on('text', (packet) => {
      if (packet.message) console.log(`[CHAT] ${packet.source_name || 'System'}: ${packet.message}`);
    });

  } catch (err) {
    console.error('Gagal memulakan bot:', err.message);
    retryConnection();
  }
}

function retryConnection() {
  if (reconnectTimer) clearTimeout(reconnectTimer);
  console.log('Cuba menyambung semula dalam 20 saat...');
  reconnectTimer = setTimeout(startBot, 20000);
}

// Tangkap ralat global supaya bot tidak mati terus (Crash)
process.on('uncaughtException', (err) => {
  console.error('Ralat Tidak Dijangka:', err.message);
  if (err.message.includes('timeout')) {
    console.log('Sila pastikan Server Aternos anda sudah ONLINE (Hijau) di dashboard.');
  }
});

startBot();
