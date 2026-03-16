// Ganti bahagian setInterval anda dengan ini
setInterval(() => {
  // Pastikan bot sudah spawn sebelum hantar paket
  if (!bot.entity || !bot.entity.position) return;

  try {
    bot.queue('player_auth_input', {
      pitch: 0,
      yaw: 0,
      position: bot.entity.position,
      move_vector: { x: 0, z: 0.1 }, // Gerak sikit ke depan
      head_yaw: 0,
      input_data: {
        _value: 0,
        forward: true // Data input yang betul
      },
      input_mode: 'mouse',
      play_mode: 'normal',
      interaction_model: 'touch',
      tick: BigInt(0),
      delta: { x: 0, y: 0, z: 0 }
    });
  } catch (e) {
    console.log("Gagal hantar paket pergerakan:", e.message);
  }
}, 10000); // Buat setiap 10 saat (jangan terlalu kerap untuk elak lag/kick)
