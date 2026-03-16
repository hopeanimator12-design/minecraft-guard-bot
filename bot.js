const bedrock = require("bedrock-protocol")

const OWNER = ".WateryDuck7656"
const HOST = "AsotaTheCat.aternos.me"
const PORT = 11362

let followOwner = true

function startBot(){

const bot = bedrock.createClient({
host: HOST,
port: PORT,
username: "Prabowo_Sawit",
offline: true
})

console.log("Bot cuba masuk server...")

bot.on("join", () => {
console.log("Prabowo_Sawit sudah masuk server!")
})

bot.on("add_entity", (entity) => {

if(!entity) return

const name = entity.username || ""
const type = entity.entity_type || ""

if(name === OWNER){
if(followOwner){
console.log("Owner dijumpai, bot akan ikut.")
}
return
}

if(name && name !== OWNER){
console.log("Serang player:", name)
attack(bot,entity.runtime_id)
}

if(
type.includes("zombie") ||
type.includes("skeleton") ||
type.includes("creeper")
){
console.log("Serang mob:",type)
attack(bot,entity.runtime_id)
}

})

bot.on("text",(packet)=>{

const msg = packet.message

if(!msg) return

if(msg === "!follow"){
followOwner = true
console.log("Bot ikut owner")
}

if(msg === "!stay"){
followOwner = false
console.log("Bot berhenti ikut")
}

if(msg === "!attack"){
console.log("Mode attack aktif")
}

})

bot.on("disconnect", () => {
console.log("Server offline. Cuba masuk lagi dalam 5 saat...")
setTimeout(startBot,5000)
})

bot.on("error",()=>{})

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
