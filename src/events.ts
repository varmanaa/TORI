import {
    autocompletes,
    commands,
    modals
} from '#interactions'
import {
    ApplicationCommandAutocompleteInteraction,
    ApplicationCommandInteraction,
    ModalSubmitInteraction,
    type ToriClient
} from '#structs'
import {
    isApplicationCommandAutocompleteInteraction,
    isChatInputApplicationCommandInteraction,
    isGuildChannel,
    isModalSubmitInteraction
} from '#utility'
import {
    type APIEmbed,
    GatewayDispatchEvents,
    InteractionResponseType,
    MessageFlags,
    Routes
} from '@discordjs/core'
import { WebSocketShardEvents } from '@discordjs/ws'
import { isGuildInteraction } from 'discord-api-types/utils'

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
        const games = await client.database.readGuildGames(guildId)
        const tags = await client.database.readGuildTags(guildId)

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
    client.on(GatewayDispatchEvents.InteractionCreate, async payload => {
        const p = payload.data

        if (!isGuildInteraction(p))
            return
        if (isApplicationCommandAutocompleteInteraction(p)) {
            const interaction = new ApplicationCommandAutocompleteInteraction(client.rest, p)
            const { name } = interaction.getFocusedOption()
            const autocomplete = autocompletes.get(name)
            const choices = autocomplete.getChoices(interaction, client)

            await interaction.autocomplete(choices)
        } else if (isChatInputApplicationCommandInteraction(p)) {
            const interaction = new ApplicationCommandInteraction(client.rest, p)
            const command = commands.get(p.data.name)

            await command.run(interaction, client)
        } else if (isModalSubmitInteraction(p)) {
            const interaction = new ModalSubmitInteraction(client.rest, p)
            const key = [...modals.keys()].find(key => p.data.custom_id.startsWith(key))
            const modal = modals.get(key)

            await modal.handle(interaction, client)
        } else {
            const embed: Partial<APIEmbed> = { color: 0xF8F8FF, description: 'Unknown interaction' }

            await client.rest.post(
                Routes.interactionCallback(p.id, p.token),
                {
                    auth: false,
                    body: {
                        data: { embeds: [embed], flags: MessageFlags.Ephemeral },
                        type: InteractionResponseType.ChannelMessageWithSource
                    }
                }
            )
        }
    })
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