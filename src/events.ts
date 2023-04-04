import type { ToriClient } from '#structs'
import { isGuildChannel } from '#utility'
import { GatewayDispatchEvents } from '@discordjs/core'
import { WebSocketShardEvents } from '@discordjs/ws'

export async function handleEvents(client: ToriClient) {
    client.on(GatewayDispatchEvents.ChannelCreate, payload => {
        const channel = payload.data

        if (!isGuildChannel(channel))
            return

        client.cache.channels.insert(channel)
    })
    client.on(GatewayDispatchEvents.ChannelDelete, payload => client.cache.channels.remove(BigInt(payload.data.id)))
    client.on(GatewayDispatchEvents.ChannelUpdate, payload => {
        const channel = payload.data

        if (!isGuildChannel(channel))
            return

        client.cache.channels.insert(channel)
    })
    client.on(GatewayDispatchEvents.GuildCreate, async payload => {
        const guild = payload.data
        const guildId = BigInt(guild.id)
        const games = await client.database.getGuildGames(guildId)
        const tags = await client.database.getGuildTags(guildId)

        client.cache.guilds.insert(
            guild.channels,
            games,
            guildId,
            guild.members,
            guild.name,
            guild.roles,
            tags
        )
    })
    client.on(GatewayDispatchEvents.GuildDelete, payload => client.cache.guilds.remove(BigInt(payload.data.id), payload.data.unavailable))
    client.on(GatewayDispatchEvents.GuildMemberAdd, payload => {
        const member = payload.data
        const guildId = BigInt(member.guild_id)
        const guild = client.cache.guilds.get(guildId)

        if (guild)
            guild.members.insert(member)
    })
    client.on(GatewayDispatchEvents.GuildMemberRemove, payload => {
        const userId = BigInt(payload.data.user.id)
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)

        if (guild)
            guild.members.remove(userId)
    })
    client.on(GatewayDispatchEvents.GuildMemberUpdate, payload => {
        const member = payload.data
        const guildId = BigInt(member.guild_id)
        const guild = client.cache.guilds.get(guildId)

        if (guild)
            guild.members.update(member)
    })
    client.on(GatewayDispatchEvents.GuildMembersChunk, payload => {
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)

        if (guild) {
            for (const member of payload.data.members)
                guild.members.insert({ ...member, guild_id: payload.data.guild_id })
        }
    })
    client.on(GatewayDispatchEvents.GuildRoleCreate, payload => client.cache.roles.insert(BigInt(payload.data.guild_id), payload.data.role))
    client.on(GatewayDispatchEvents.GuildRoleDelete, payload => client.cache.roles.remove(BigInt(payload.data.role_id)))
    client.on(GatewayDispatchEvents.GuildRoleUpdate, payload => client.cache.roles.insert(BigInt(payload.data.guild_id), payload.data.role))
    client.on(GatewayDispatchEvents.GuildUpdate, payload => client.cache.guilds.update(BigInt(payload.data.id), payload.data.name))
    client.on(GatewayDispatchEvents.InteractionCreate, payload => { return -1 })
    client.on(GatewayDispatchEvents.Ready, payload => {
        const { user } = payload.data
        const unavailableGuildIds = payload.data.guilds.map(guild => BigInt(guild.id))

        for (const unavailableGuildId of unavailableGuildIds)
            client.cache.unavailableGuilds.insert(unavailableGuildId)

        client.id = BigInt(user.id)
        console.log(`${ user.username }#${ user.discriminator } is online!`)
    })
    client.ws.on(WebSocketShardEvents.HeartbeatComplete, payload => {
        client.ping = payload.latency
    })
}