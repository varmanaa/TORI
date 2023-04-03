import type { APIRole, Permissions } from '@discordjs/core'

interface Role {
    permissions: Permissions
    position: number
}

export class RoleCache {
    #items: Map<bigint, Role> = new Map()

    get(key: bigint): Role | null {
        return this.#items.get(key) ?? null
    }

    insert(role: APIRole) {
        this.#items.set(
            BigInt(role.id),
            {
                permissions: role.permissions,
                position: role.position
            }
        )
    }


    remove(key: bigint) {
        this.#items.delete(key)
    }
}