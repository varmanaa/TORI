export class UnavailableGuildCache {
    #items: Set<bigint> = new Set()

    insert(id: bigint) {
        this.#items.add(id)
    }

    remove(id: bigint) {
        this.#items.delete(id)
    }
}