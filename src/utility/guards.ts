import type { APIGuildChannel } from '#types/cache'
import type { APIChannel } from '@discordjs/core'

export function isGuildChannel(channel: APIChannel): channel is APIGuildChannel & { guild_id: string } {
    return Reflect.has(channel, 'guild_id')
}