import { GuildCache } from './GuildCache.js'
import { UnavailableGuildCache } from './UnavailableGuildCache.js'
import { UserCache } from './UserCache.js'

export class Cache {
    guilds = new GuildCache()
    unavailableGuilds = new UnavailableGuildCache()
    users = new UserCache()
}