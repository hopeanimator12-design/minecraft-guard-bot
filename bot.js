const bedrock = require("bedrock-protocol")

const OWNER = ".WateryDuck7656"

const bot = bedrock.createClient({
  host: "AsotaTheCat.aternos.me",
  port: 11362,
  username: "GuardBot",
  offline: true
})

console.log("Bot starting...")

bot.on("join", () => {
  console.log("Bot joined server")
})

bot.on("add_entity", (entity) => {

  if (!entity) return

  if (entity.username === OWNER) return

  console.log("Target:", entity.username || entity.runtime_id)

})
