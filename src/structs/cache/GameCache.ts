export class GameCache {
    #items: Map<string, string> = new Map()

    entries() {
        return this.#items.entries()
    }

    get(d: string, l: string): string | null {
        return this.#items.get(`${ d } (${ l })`) ?? null
    }

    insert(d: string, l: string) {

        this.#items.set(`${ d } (${ l.charAt(0).toUpperCase() }${ l.slice(1).toLowerCase() })`, `${ d }_${ l }`)  
    }

    remove(d: string, l: string) {
        this.#items.delete(`${ d } (${ l })`)
    }
}