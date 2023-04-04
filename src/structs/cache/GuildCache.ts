import {
    type Cache,
    GameCache,
    MemberCache,
    TagCache
} from '#structs'
import type { Guild } from '#types/cache'
import { isGuildChannel } from '#utility'
import type {
    APIChannel,
    APIGuildMember,
    APIRole
} from '@discordjs/core'
import type { Tag } from '@prisma/client'

export class GuildCache {
    #cache: Cache
    #items: Map<bigint, Guild> = new Map()

    constructor(cache: Cache) {
        this.#cache = cache
    }

    get(key: bigint): Guild | null {
        return this.#items.get(key) ?? null
    }

    insert(channels: APIChannel[], games: { d: string, t: string }[], id: bigint, members: APIGuildMember[], name: string, roles: APIRole[], tags: Tag[]) {
        const channelIds: Set<bigint> = new Set()
        const gameCache = new GameCache()
        const memberCache = new MemberCache(this.#cache)
        const guildIdString = id.toString()
        const roleIds: Set<bigint> = new Set()
        const tagCache = new TagCache()

        for (const channel of channels) {
            if (!isGuildChannel(channel))
                continue

            this.#cache.channels.insert({ ...channel, guild_id: guildIdString })
            channelIds.add(BigInt(channel.id))
        }

        for (const { d, t } of games)
            gameCache.insert(d, t)

        for (const member of members)
            memberCache.insert({ ...member, guild_id: guildIdString })

        for (const role of roles) {
            this.#cache.roles.insert(id, role)
            roleIds.add(BigInt(role.id))
        }

        for (const tag of tags)
            tagCache.insert(tag)

        this.#cache.unavailableGuilds.remove(id)
        this.#items.set(
            id,
            {
                channelIds,
                games: gameCache,
                id,
                members: memberCache,
                name,
                roleIds,
                tags: tagCache
            }
        )
    }

    remove(key: bigint, unavailable: boolean) {
        this.#items.delete(key)

        if (unavailable)
            this.#cache.unavailableGuilds.insert(key)
    }

    update(guildId: bigint, name: string) {
        const guild = this.get(guildId)

        if (guild)
            guild.name = name
    }
}