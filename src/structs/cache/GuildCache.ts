
import { ChannelCache } from './ChannelCache.js'
import { MemberCache } from './MemberCache.js'
import { RoleCache } from './RoleCache.js'
import { TagCache } from './TagCache.js'

interface Guild {
    channels: ChannelCache
    games: Map<string, string>
    members: MemberCache
    name: string
    roles: RoleCache,
    tags: TagCache
}

export class GuildCache {
    #items: Map<bigint, Guild> = new Map()

    get(key: bigint): Guild | null {
        return this.#items.get(key) ?? null
    }

    insert(guildId: bigint, name: string) {
        this.#items.set(
            guildId,
            {
                channels: new ChannelCache(),
                games: new Map(),
                members: new MemberCache(),
                name,
                roles: new RoleCache,
                tags: new TagCache()
            }
        )
    }

    remove(key: bigint) {
        this.#items.delete(key)
    }

    update(guildId: bigint, name: string) {
        const guild = this.get(guildId)

        guild.name = name
    }
}