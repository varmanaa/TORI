import type { ToriClient } from '#structs'
import { isGuildChannel } from '#utility'
import { GatewayDispatchEvents } from '@discordjs/core'
import { WebSocketShardEvents } from '@discordjs/ws'

export async function handleEvents(client: ToriClient) {
    client.on(GatewayDispatchEvents.ChannelCreate, payload => {
        const channel = payload.data

        if (!isGuildChannel(channel))
            return
        if (!channel?.guild_id)
            return
        
        const guild = client.cache.guilds.get(BigInt(channel.guild_id))

        if (guild)
            guild.channels.insert(channel)
    })
    client.on(GatewayDispatchEvents.ChannelDelete, payload => {
        const channel = payload.data

        if (!isGuildChannel(channel))
            return
        if (!channel?.guild_id)
            return
        
        const guild = client.cache.guilds.get(BigInt(channel.guild_id))

        if (guild)
            guild.channels.remove(BigInt(channel.id))
    })
    client.on(GatewayDispatchEvents.ChannelUpdate, payload => {
        const channel = payload.data

        if (!isGuildChannel(channel))
            return
        if (!channel?.guild_id)
            return
        
        const guild = client.cache.guilds.get(BigInt(channel.guild_id))

        if (guild)
            guild.channels.insert(channel)
    })
    client.on(GatewayDispatchEvents.GuildCreate, async payload => {
        const guildId = BigInt(payload.data.id)

        client.cache.guilds.insert(guildId, payload.data.name)
        client.cache.unavailableGuilds.remove(guildId)

        const guild = client.cache.guilds.get(guildId)

        for (const channel of payload.data.channels) {
            if (!isGuildChannel(channel))
                continue

            guild.channels.insert(channel)
        }

        for (const { d, t } of await client.database.getGuildGames(guildId))
            guild.games.set(`${ d } (${ t })`, `${ d }_${ t.toUpperCase() }`)

        for (const member of payload.data.members) {
            guild.members.insert(member)
            client.cache.users.insert(member.user)
        }

        for (const role of payload.data.roles)
            guild.roles.insert(role)

        for (const tag of await client.database.getGuildTags(guildId))
            guild.tags.insert(tag)
    })
    client.on(GatewayDispatchEvents.GuildDelete, payload => {
        const guildId = BigInt(payload.data.id)

        client.cache.guilds.remove(guildId)

        if (payload.data.unavailable)
            client.cache.unavailableGuilds.insert(guildId)
    })
    client.on(GatewayDispatchEvents.GuildMemberAdd, payload => {
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)

        guild.members.insert(payload.data)
        client.cache.users.insert(payload.data.user)
    })
    client.on(GatewayDispatchEvents.GuildMemberRemove, payload => {
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)
        const userId = BigInt(payload.data.user.id)

        guild.members.remove(userId)
        client.cache.users.remove(userId)
    })
    client.on(GatewayDispatchEvents.GuildMemberUpdate, payload => {
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)

        guild.members.insert(payload.data)
        client.cache.users.insert(payload.data.user)
    })
    client.on(GatewayDispatchEvents.GuildMembersChunk, payload => {
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)

        for (const member of payload.data.members) {
            guild.members.insert(member)
            client.cache.users.insert(member.user)
        }
    })
    client.on(GatewayDispatchEvents.GuildRoleCreate, payload => {
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)

        guild.roles.insert(payload.data.role)
    })
    client.on(GatewayDispatchEvents.GuildRoleDelete, payload => {
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)
        const roleId = BigInt(payload.data.role_id)

        guild.roles.remove(roleId)
    })
    client.on(GatewayDispatchEvents.GuildRoleUpdate, payload => {
        const guildId = BigInt(payload.data.guild_id)
        const guild = client.cache.guilds.get(guildId)

        guild.roles.insert(payload.data.role)
    })
    client.on(GatewayDispatchEvents.GuildUpdate, payload => {
        const guildId = BigInt(payload.data.id)
        const guild = client.cache.guilds.get(guildId)

        client.cache.guilds.update(guildId, payload.data.name)

        for (const role of payload.data.roles)
            guild.roles.insert(role)
    })
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