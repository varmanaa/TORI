import type { User } from '#types/cache'
import { APIUser } from '@discordjs/core'

export class UserCache {
    #items: Map<bigint, User> = new Map()

    decrementMutualGuilds(key: bigint) {
        const cachedUser = this.get(key)

        if (cachedUser.mutualGuilds === 1)
            this.remove(key)
        else
            cachedUser.mutualGuilds -= 1
    }

    get(key: bigint): User | null {
        return this.#items.get(key) ?? null
    }

    insert(user: APIUser) {
        const id = BigInt(user.id)
        const mutualGuilds = (this.get(id)?.mutualGuilds ?? 0) + 1

        this.#items.set(
            id,
            {
                discriminator: user.discriminator,
                id,
                mutualGuilds,
                username: user.username
            }
        )
    }

    remove(key: bigint) {
        this.#items.delete(key)
    }
}