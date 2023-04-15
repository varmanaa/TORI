import type { ModalSubmitInteraction, ToriClient } from '#structs'
import type { ModalInteraction } from '#types/interaction'
import { type APIEmbed, MessageFlags } from '@discordjs/core'
import dayjs from 'dayjs'

export const CreateGameModal: ModalInteraction = {
    async handle(interaction: ModalSubmitInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })

        const embed: Partial<APIEmbed> = { color: 0xF8F8FF }
        const values = Object.entries(interaction.values())
        const notes = values.pop()[1]
        const results: Record<string, number> = {}

        let totalScore = 0

        for (const [player, submittedScore] of values) {
            if (!/^((0|-?100,?000|-?([1-9]|[1-9]\d?,?\d)00)|(-?(0?\.[1-9]|100(\.0)?|([1-9]\d?(\.\d)?))k?))$/g.test(submittedScore)) {
                embed.description = 'One or more scores are in an invalid format. Please try again.'

                await interaction.updateReply({ embeds: [embed] })

                return  
            }

            let score = Number(submittedScore.replace(/[^0-9.]/g, ''))

            if (score % 100 !== 0)
                score = score * 1_000

            totalScore += score

            if (totalScore > 100_000) {
                embed.description = 'The total score exceeds 100,000 points. Please ensure that all scores sum to a maximum of 100,000 points.'

                await interaction.updateReply({ embeds: [embed] })

                return  
            }

            results[player] = score
        }

        const bits = Number(interaction.data.custom_id.split('-')[2])
        const { createdAt, id, location } = await client.database.insertGame(interaction.guildId, results, notes, bits)
        const d = dayjs(createdAt).format('YYYY-MM-DD')
        const l = `${ location.charAt(0).toUpperCase() }${ location.slice(1).toLowerCase() }`

        client.cache.guilds.get(interaction.guildId).games.insert(d, l)
        embed.description = `Created game #${ id }!`
        
        await interaction.updateReply({ embeds: [embed] })
    }
}