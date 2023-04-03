import {
    APIChannel,
    APIGuildChannelResolvable,
    ChannelType
} from '@discordjs/core'

export function isGuildChannel(channel: APIChannel): channel is APIGuildChannelResolvable {
    return ![ChannelType.DM, ChannelType.GroupDM].includes(channel.type)
}