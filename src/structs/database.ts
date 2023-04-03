import { PrismaClient, type Tag } from '@prisma/client'

export class Database {
    #prisma = new PrismaClient()

    async getGuildGames(guildId: bigint): Promise<{ d: string, t: string }[]> {
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

    async getGuildTags(guildId: bigint): Promise<Tag[]> {
        const tags = await this.#prisma.tag.findMany({ where: { guildId } })

        return tags
    }
}