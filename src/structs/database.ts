import { PrismaClient, type Tag } from '@prisma/client'

export class Database {
    #prisma = new PrismaClient()

    async deleteTag(id: bigint): Promise<Tag> {
        const tag = await this.#prisma.tag.delete({ where: { id } })

        return tag
    }

    async insertTag(guildId: bigint, keywords: string[], content: string): Promise<Tag> {
        const tag = await this.#prisma.tag.create({ data: { guildId, keywords, content } })

        return tag
    }

    async readTag(id: bigint): Promise<Tag> {
        const tag = await this.#prisma.tag.findUnique({ where: { id } })

        return tag
    }

    async readGuildGames(guildId: bigint): Promise<{ d: string, t: string }[]> {
        const result = await this.#prisma.$queryRawUnsafe<{ d: string, t: string }[]>(
            `
                SELECT DISTINCT
                    TO_CHAR(public.game.created_at AT TIME ZONE 'America/Toronto', 'YYYY-MM-DD') AS d,
                    INITCAP(public.game.type::TEXT) AS t
                FROM
                    public.game
                WHERE
                    public.game.guild_id = $1;
            `,
            guildId
        )

        return result
    }

    async readGuildTags(guildId: bigint): Promise<Tag[]> {
        const tags = await this.#prisma.tag.findMany({ where: { guildId } })

        return tags
    }

    async updateTag(id: bigint, keywords: string[], content: string): Promise<Tag> {
        const tag = await this.#prisma.tag.update({ data: { keywords, content }, where: { id } })

        return tag
    }
}