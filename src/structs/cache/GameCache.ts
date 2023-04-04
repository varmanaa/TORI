export class GameCache {
    #items: Map<string, string> = new Map()

    get(key: string): string | null {
        return this.#items.get(key) ?? null
    }

    insert(d: string, t: string) {
        this.#items.set(`${ d } (${ t })`, `${ d }_${ t }`)  
    }

    remove(key: string) {
        this.#items.delete(key)
    }
}