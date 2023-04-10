import type { Tag } from '@prisma/client'

export class TagCache {
    #items: Map<string, bigint> = new Map()

    entries() {
        return this.#items.entries()
    }

    get(key: string): bigint | null {
        return this.#items.get(key) ?? null
    }

    insert(tag: Tag) {
        for (const keyword of tag.keywords)
            this.#items.set(keyword, tag.id)  
    }

    remove(key: string) {
        this.#items.delete(key)
    }
}