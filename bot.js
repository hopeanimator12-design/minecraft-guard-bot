const { createClient } = require('bedrock-protocol');
const http = require('http');

// 1. WEB SERVER (Wajib untuk Railway/Render supaya bot terus aktif)
// Gunakan URL dari hosting anda (contoh: https://bot-anda.railway.app) di UptimeRobot
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end("Bot Minecraft Guard (v1.26.0) is Running 24/7!");
}).listen(process.env.PORT || 8080);

const CONFIG = {
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit',
  version: '1.26.0',
  offline: true,
  connectTimeout: 60000 // Tingkatkan ke 60 saat untuk kestabilan
};

let bot;
let isConnected = false;
let reconnectTimer;
let afkInterval;

function startBot() {
  if (isConnected) return;
  
  console.log('--- [SISTEM] Memulakan Bot Minecraft Guard ---');
  console.log(`Menyambung ke ${CONFIG.host}:${CONFIG.port}...`);

  try {
    bot = createClient(CONFIG);

    bot.on('spawn', () => {
      console.log('✅ [BERJAYA] Bot masuk ke server!');
      isConnected = true;
      
      // ANTI-AFK YANG LEBIH BAIK (Hayun tangan & Gerak kepala)
      if (afkInterval) clearInterval(afkInterval);
      afkInterval = setInterval(() => {
        if (isConnected) {
          // 1. Hayun tangan (Swing arm)
          bot.queue('animate', { action_id: 1 });
          
          // 2. Pandang arah berbeza sedikit
          const randomYaw = Math.floor(Math.random() * 360);
          bot.queue('player_auth_input', {
            pitch: 0,
            yaw: randomYaw,
            position: { x: 0, y: 0, z: 0 },
            moveVector: { x: 0, z: 0 },
            headYaw: randomYaw,
            inputData: { _value: 0n }
          });
          console.log('🕒 [ANTI-AFK] Bot melakukan aktiviti...');
        }
      }, 30000); // Setiap 30 saat
    });

    bot.on('error', (err) => {
      console.error('⚠️ [RALAT]:', err.message);
      handleDisconnect();
    });

    bot.on('close', () => {
      console.log('❌ [PUTUS] Sambungan terputus dari server.');
      handleDisconnect();
    });

    bot.on('text', (packet) => {
      if (packet.message) console.log(`[CHAT] ${packet.source_name || 'System'}: ${packet.message}`);
    });

  } catch (err) {
    console.error('Gagal memulakan bot:', err.message);
    handleDisconnect();
  }
}

function handleDisconnect() {
  isConnected = false;
  if (afkInterval) clearInterval(afkInterval);
  
  if (reconnectTimer) clearTimeout(reconnectTimer);
  console.log('🔄 Mencuba menyambung semula dalam 20 saat...');
  reconnectTimer = setTimeout(startBot, 20000);
}

// Elakkan bot mati terus jika ada ralat luar jangka
process.on('uncaughtException', (err) => {
  console.error('🔥 [CRITICAL ERROR]:', err.message);
  if (err.message.includes('timeout')) {
    console.log('Tip: Pastikan Server Aternos sudah ON (Warna Hijau).');
  }
});

startBot();
