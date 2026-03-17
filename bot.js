const { createClient } = require('bedrock-protocol');
const http = require('http');

// 1. WEB SERVER (Sangat penting supaya hosting tak 'SIGTERM' bot anda)
http.createServer((req, res) => {
  res.write("Bot Minecraft Guard Sedang Aktif!");
  res.end();
}).listen(8080);

const CONFIG = {
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit',
  version: '1.26.0' // Ikut version yang anda minta
};

const OWNER = 'WateryDuck7656';
let bot;
let entities = {}; // Untuk simpan senarai mob/player di sekeliling

function startBot() {
  console.log('--- Memulakan Bot Minecraft Guard ---');

  bot = createClient(CONFIG);

  bot.on('spawn', () => {
    console.log('✅ Bot masuk server!');
    
    // Bergerak sikit supaya tak kena Kick AFK
    setInterval(() => {
      if (bot.entity) {
        bot.queue('player_auth_input', {
          pitch: 0, yaw: 0, position: bot.entity.position,
          moveVector: { x: 0, z: 0.1 }, headYaw: 0, inputData: { forward: true }
        });
      }
    }, 10000);

    // Loop Serangan (Setiap 1.5 saat)
    setInterval(() => {
      attackLogic();
    }, 1500);
  });

  // Pantau Entity (Mob & Player)
  bot.on('add_entity', (packet) => {
    entities[packet.runtime_id] = packet;
  });

  bot.on('remove_entity', (packet) => {
    delete entities[packet.runtime_id];
  });

  // Logic Serangan
  function attackLogic() {
    for (const id in entities) {
      const entity = entities[id];
      
      // ABAIKAN JIKA: Itu adalah OWNER (anda)
      if (entity.username === OWNER) continue;

      // Pukul entity terdekat (Packet Attack)
      bot.queue('inventory_transaction', {
        transaction_type: 'item_use_on_entity',
        action_type: 'attack',
        runtime_entity_id: id,
        position: { x: 0, y: 0, z: 0 },
        extra_data: 0
      });
      
      console.log(`⚔️ Menyerang entity ID: ${id}`);
      break; // Pukul satu demi satu
    }
  }

  bot.on('text', (packet) => {
    console.log(`[CHAT] ${packet.source_name}: ${packet.message}`);
  });

  bot.on('disconnect', (packet) => {
    console.log('❌ Putus sambungan:', packet.reason);
    setTimeout(startBot, 5000);
  });

  bot.on('error', (err) => {
    console.error('⚠️ Error:', err.message);
  });
}

startBot();
