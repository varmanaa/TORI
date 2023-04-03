import { APIUser } from '@discordjs/core'

interface User {
    discriminator: string
    mutualGuilds: number
    username: string
}

export class UserCache {
    #items: Map<bigint, User> = new Map()

    get(key: bigint): User | null {
        return this.#items.get(key) ?? null
    }

    insert(user: APIUser) {
        const id = BigInt(user.id)
        const cachedUser = this.get(id)
        const mutualGuilds = (cachedUser?.mutualGuilds ?? 0) + 1

        this.#items.set(
            id,
            {
                discriminator: user.discriminator,
                mutualGuilds,
                username: user.username
            }
        )
    }

    remove(key: bigint) {
        const cachedUser = this.get(key)

        if (!cachedUser)
            return
        if (cachedUser.mutualGuilds === 1)
            this.#items.delete(key)
        else
            cachedUser.mutualGuilds -= 1
    }
}