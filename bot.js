const { createClient } = require('bedrock-protocol');
const http = require('http');

// 1. WEB SERVER (Wajib untuk Railway supaya tidak kena SIGTERM/Kill)
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write("Bot Minecraft Guard 1.26.0 Aktif!");
  res.end();
}).listen(process.env.PORT || 8080);

const CONFIG = {
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit',
  version: '1.26.0', // Kekal versi pilihan anda
  offline: true      // Aternos memerlukan mod offline untuk bot
};

const OWNER = 'WateryDuck7656';
let bot;
let entities = {}; 

function startBot() {
  console.log('--- Memulakan Bot Minecraft Guard (v1.26.0) ---');

  // Tutup client lama jika ada untuk elak memory leak
  if (bot) {
    try { bot.close(); } catch (e) {}
  }

  bot = createClient(CONFIG);

  bot.on('spawn', () => {
    console.log('✅ Bot berjaya masuk server!');
    
    // Pergerakan anti-AFK (Setiap 20 saat)
    setInterval(() => {
      if (bot.status === 'active') {
        bot.queue('player_auth_input', {
          pitch: 0, yaw: 0, position: { x: 0, y: 0, z: 0 },
          moveVector: { x: 0, z: 0.01 }, headYaw: 0, inputData: { forward: true }
        });
      }
    }, 20000);

    // Loop Serangan (Setiap 2 saat - lebih selamat)
    setInterval(() => {
      if (bot.status === 'active') {
        attackLogic();
      }
    }, 2000);
  });

  // Pantau Entity
  bot.on('add_entity', (packet) => {
    entities[packet.runtime_id] = packet;
  });

  bot.on('remove_entity', (packet) => {
    delete entities[packet.runtime_id];
  });

  // Logic Serangan yang lebih selamat (Fix Crash)
  function attackLogic() {
    for (const id in entities) {
      const entity = entities[id];
      
      // ABAIKAN JIKA: OWNER atau Bot sendiri
      if (entity.username === OWNER || entity.username === CONFIG.username) continue;

      try {
        bot.queue('inventory_transaction', {
          transaction_type: 'item_use_on_entity',
          action_type: 'attack',
          runtime_entity_id: id,
          position: { x: 0, y: 0, z: 0 },
          extra_data: 0
        });
        console.log(`⚔️ Menyerang ID: ${id}`);
        break; 
      } catch (err) {
        console.log("Gagal menghantar paket serangan, skip...");
      }
    }
  }

  bot.on('text', (packet) => {
    if (packet.message) {
      console.log(`[CHAT] ${packet.source_name || 'System'}: ${packet.message}`);
    }
  });

  bot.on('error', (err) => {
    console.error('⚠️ Error:', err.message);
    if (err.message.includes('timeout') || err.message.includes('closed')) {
      console.log('Menghubung semula dalam 10 saat...');
      setTimeout(startBot, 10000);
    }
  });

  bot.on('close', () => {
    console.log('❌ Putus sambungan. Cuba masuk balik...');
    setTimeout(startBot, 10000);
  });
}

// Jalankan bot
startBot();
