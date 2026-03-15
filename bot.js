const bedrock = require("bedrock-protocol")

const OWNER = ".WateryDuck7656"
const HOST = "AsotaTheCat.aternos.me"
const PORT = 11362

function startBot(){

const bot = bedrock.createClient({
host: HOST,
port: PORT,
username: "Prabowo_Sawit",
offline: true
})

console.log("Bot cuba masuk server...")

bot.on("join", () => {
console.log("Bot berjaya masuk server dan menjaga owner!")
})

bot.on("add_entity", (entity) => {

if(!entity) return

const name = entity.username || ""
const type = entity.entity_type || ""

if(name === OWNER) return

// serang player lain
if(name && name !== OWNER){
attack(bot, entity.runtime_id)
console.log("Serang player:", name)
}

// serang mob jahat
if(
type.includes("zombie") ||
type.includes("skeleton") ||
type.includes("creeper")
){
attack(bot, entity.runtime_id)
console.log("Serang mob:", type)
}

})

bot.on("disconnect", () => {
console.log("Server tutup. Bot cuba masuk semula dalam 5 saat...")
setTimeout(startBot,5000)
})

bot.on("error", () => {})

}

function attack(bot,id){

try{

bot.queue("inventory_transaction",{
transaction:{
legacy:{legacy_request_id:0},
transaction_type:"item_use_on_entity",
entity_runtime_id:id,
action_type:"attack"
}
})

}catch(e){}

}

startBot()
