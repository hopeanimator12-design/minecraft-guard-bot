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

console.log("Bot cuba connect...")

bot.on("join", () => {

console.log("Prabowo_Sawit masuk server!")

// anti AFK movement
setInterval(() => {

bot.queue("player_auth_input",{
pitch:0,
yaw:Math.random()*360,
position:{x:0,y:0,z:0},
move_vector:{x:0,z:0},
head_yaw:Math.random()*360,
input_data:[],
input_mode:1,
play_mode:0,
tick:0
})

console.log("Anti AFK bergerak")

},30000)

})

bot.on("add_entity",(entity)=>{

if(!entity) return

const name = entity.username || ""
const type = entity.entity_type || ""

// ignore owner
if(name === OWNER) return

// attack player lain
if(name && name !== OWNER){

console.log("Serang player:",name)

attack(bot,entity.runtime_id)

}

// attack mob jahat
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
console.log("Mode follow aktif")

}

if(msg === "!stay"){

followOwner =
