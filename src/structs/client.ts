import { Cache, Database } from '#structs'
import { BOT_TOKEN } from '#utility'
import { Client, GatewayIntentBits } from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { WebSocketManager } from '@discordjs/ws'

const rest = new REST().setToken(BOT_TOKEN)
const ws = new WebSocketManager({
	intents: GatewayIntentBits.Guilds | GatewayIntentBits.GuildMembers,
	rest,
    token: BOT_TOKEN
})

export class ToriClient extends Client {
    readonly cache: Cache
    readonly database: Database
    id?: bigint
    ping?: number

    constructor() {
        super({ rest, ws })

        this.cache = new Cache()
        this.database = new Database()
    }

    async login() {
        await ws.connect()
    }
}