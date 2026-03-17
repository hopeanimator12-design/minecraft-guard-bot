const { createClient } = require('bedrock-protocol');

const CONFIG = {
  host: 'AsotaTheCat.aternos.me',
  port: 11362,
  username: 'Prabowo_Sawit',
  version: '1.21.0' // Pastikan version ni betul dengan server
};

const OWNER = 'WateryDuck7656';
let bot;

function startBot() {
  bot = createClient(CONFIG);

  bot.on('spawn', () => {
    console.log('✅ Bot sedia untuk berkhidmat!');
    
    // Loop untuk check sekeliling setiap 1 saat
    setInterval(() => {
      attackNearby();
    }, 1000);
  });

  // Fungsi Pukul Mob & Player (Kecuali Owner)
  function attackNearby() {
    // Nota: bedrock-protocol perlukan anda simpan data entity sendiri 
    // daripada packet 'add_player' atau 'add_entity'
    // Ini adalah contoh logic cara hantar packet pukul:
    
    /* 
    bot.queue('inventory_transaction', {
      transaction_type: 'item_use_on_entity',
      action_type: 'attack',
      runtime_entity_id: targetID, // ID mob/player
      // ... data lain
    });
    */
  }

  // Fungsi Cari Katil (Perlu scan chunk data)
  // Sangat berat untuk bedrock-protocol biasa tanpa plugin tambahan
  
  bot.on('error', (err) => console.log('Error:', err));
  bot.on('close', () => setTimeout(startBot, 5000));
}

startBot();
