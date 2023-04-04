import type {
    GameCache,
    MemberCache,
    TagCache
} from '#structs'
import type {
    APIGuildCategoryChannel,
    APIGuildForumChannel,
    APIGuildStageVoiceChannel,
    APIGuildVoiceChannel,
    APINewsChannel,
    APIOverwrite,
    APITextChannel,
    APIThreadChannel,
    ChannelFlags,
    ChannelType,
    Permissions
} from '@discordjs/core'

export type Channel = {
    flags: ChannelFlags | null
    guildId: bigint
    id: bigint
    parentId: bigint | null
    permissionOverwrites: APIOverwrite[]
    position: number
    type: Omit<ChannelType, ChannelType.DM | ChannelType.GroupDM>
}

export type APIGuildChannel =
    | APIGuildCategoryChannel
    | APIGuildForumChannel
    | APIGuildStageVoiceChannel
    | APIGuildVoiceChannel
    | APINewsChannel
    | APITextChannel
    | APIThreadChannel

export type Guild = {
    channelIds: Set<bigint>
    games: GameCache
    id: bigint
    members: MemberCache
    name: string
    roleIds: Set<bigint>,
    tags: TagCache
}

export type Member = {
    communicationDisabledUntil: Date | null
    guildId: bigint
    id: bigint
    roleIds: bigint[]
}

export type Role = {
    guildId: bigint
    id: bigint
    permissions: Permissions
    position: number
}

export type User = {
    discriminator: string
    id: bigint
    mutualGuilds: number
    username: string
}