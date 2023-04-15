import { GameBit } from '#types/interaction'
import {
    type Game, GameLocation,
    PrismaClient,
    type Tag,
    GameType
} from '@prisma/client'

type PartialGame = {
    id: bigint
    player_one_id: string
    player_two_id: string
    player_three_id: string
    player_four_id: string
    player_one_score: number
    player_two_score: number
    player_three_score: number
    player_four_score: number
    notes: string
}

export class Database {
    #prisma = new PrismaClient()

    async deleteGame(id: bigint): Promise<Game> {
        try {
            const game = await this.#prisma.game.delete({ where: { id } })

            return game
        } catch (error) {
            return null
        }
    }

    async deleteTag(id: bigint): Promise<Tag> {
        try {
            const tag = await this.#prisma.tag.delete({ where: { id } })

            return tag
        } catch (error) {
            return null
        }
    }

    async insertGame(guildId: bigint, results: Record<string, number>, notes: string, bits: GameBit): Promise<Game> {
        let location: GameLocation
        let type: GameType

        if (Boolean(bits & GameBit.Online))
            location = GameLocation.ONLINE
        if (Boolean(bits & GameBit.Peel))
            location = GameLocation.PEEL
        if (Boolean(bits & GameBit.Toronto))
            location = GameLocation.TORONTO
        if (Boolean(bits & GameBit.Unknown))
            location = GameLocation.UNKNOWN
        if (Boolean(bits & GameBit.Waterloo))
            location = GameLocation.WATERLOO
        if (Boolean(bits & GameBit.York))
            location = GameLocation.YORK
        if (Boolean(bits & GameBit.Potluck))
            type = GameType.POTLUCK
        if (Boolean(bits & GameBit.Space))
            type = GameType.SPACE

        const isEastOnly = Boolean(bits & GameBit.IsEastOnly)
        const players = Object.keys(results)
        const scores = Object.values(results)
        const game = await this.#prisma.game.create({
            data: {
                guildId,
                location,
                playerOneId: players[0],
                playerTwoId: players[1],
                playerThreeId: players[2],
                playerFourId: players?.[3] ?? null,
                playerOneScore: scores[0],
                playerTwoScore: scores[1],
                playerThreeScore: scores[2],
                playerFourScore: scores?.[3] ?? null,
                type,
                isEastOnly,
                notes
            }
        })

        return game
    }

    async insertTag(guildId: bigint, keywords: string[], content: string): Promise<Tag> {
        const tag = await this.#prisma.tag.create({ data: { guildId, keywords, content } })

        return tag
    }

    async readGame(guildId: bigint, id: bigint): Promise<Game> {
        const game = await this.#prisma.game.findFirst({ where: { guildId, id } })

        return game
    }

    async readGuildGames(guildId: bigint, d: string, l: string): Promise<PartialGame[]> {
        try {
            const result = await this.#prisma.$queryRawUnsafe<PartialGame[]>(
                `
                    SELECT
                        id,
                        player_one_id,
                        player_two_id,
                        player_three_id,
                        player_four_id,
                        player_one_score,
                        player_two_score,
                        player_three_score,
                        player_four_score,
                        notes
                    FROM
                        public.game
                    WHERE
                        public.game.guild_id = $1
                        AND (public.game.created_at AT TIME ZONE 'America/Toronto')::DATE >= $2::DATE
                        AND public.game.location = $3::"GameLocation"
                    ORDER BY
                        public.game.id
                `,
                guildId,
                d,
                l
            )
    
            return result  
        } catch (error) {
            return []
        }

    }

    async readGuildGameKeys(guildId: bigint): Promise<{ d: string, l: string }[]> {
        const result = await this.#prisma.$queryRawUnsafe<{ d: string, l: string }[]>(
            `
                SELECT DISTINCT
                    TO_CHAR(public.game.created_at AT TIME ZONE 'America/Toronto', 'YYYY-MM-DD') AS d,
                    public.game.location::TEXT AS l
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

    async readTag(id: bigint): Promise<Tag> {
        const tag = await this.#prisma.tag.findUnique({ where: { id } })

        return tag
    }

    async updateTag(id: bigint, keywords: string[], content: string): Promise<Tag> {
        const tag = await this.#prisma.tag.update({ data: { keywords, content }, where: { id } })

        return tag
    }

    async updateGame(id: bigint, results: Record<string, number>, notes: string): Promise<Game> {
        const scores = Object.values(results)
        const game = await this.#prisma.game.update({
            data: {
                playerOneScore: scores[0],
                playerTwoScore: scores[1],
                playerThreeScore: scores[2],
                playerFourScore: scores?.[3] ?? null,
                notes
            },
            where: { id }
        })

        return game
    }
}