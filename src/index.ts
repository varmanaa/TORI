import { commands } from '#interactions'
import { ToriClient } from '#structs'
import { handleEvents } from './events.js'

const client = new ToriClient()
const commandJSON = [...commands.values()].map(command => command.getCommand())

await handleEvents(client)
await client.login()

if (process.env.NODE_ENV === 'production') {
    await client
        .api
        .applicationCommands
        .bulkOverwriteGlobalCommands(client.id.toString(), commandJSON)
    await client
        .api
        .applicationCommands
        .bulkOverwriteGuildCommands(client.id.toString(), process.env.DEVELOPMENT_GUILD_ID, [])
} else {
    await client
        .api
        .applicationCommands
        .bulkOverwriteGlobalCommands(client.id.toString(), [])
    await client
        .api
        .applicationCommands
        .bulkOverwriteGuildCommands(client.id.toString(), process.env.DEVELOPMENT_GUILD_ID, commandJSON)
}