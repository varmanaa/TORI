import type {
    APIGuildChannelResolvable,
    APIOverwrite,
    ChannelType,
    ChannelFlags
} from '@discordjs/core'

interface Channel {
    flags: ChannelFlags | null
    name: string
    parentId: bigint | null
    permissionOverwrites?: APIOverwrite[]
    position: number
    type: Exclude<ChannelType, ChannelType.DM | ChannelType.GroupDM>
}

export class ChannelCache {
    #items: Map<bigint, Channel> = new Map()

    get(key: bigint): Channel | null {
        return this.#items.get(key) ?? null
    }

    insert(channel: APIGuildChannelResolvable) {
        this.#items.set(
            BigInt(channel.id),
            {
                flags: channel.flags,
                name: channel.name,
                parentId: channel.parent_id
                    ? BigInt(channel.parent_id)
                    : null,
                permissionOverwrites: channel?.permission_overwrites ?? [],
                position: channel.position,
                type: channel.type
            }
        )
    }

    remove(key: bigint) {
        this.#items.delete(key)
    }
}