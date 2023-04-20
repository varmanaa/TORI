import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
    type APIEmbed,
    ApplicationCommandOptionType,
    MessageFlags
} from '@discordjs/core'
import dayjs from 'dayjs'

export const InPersonUpdateDateCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption {
        return {
            description: 'Update the date for an in-person game',
            name: 'update-date',
            options: [
                {
                    description: 'The in-person game to update',
                    name: 'id',
                    required: true,
                    type: ApplicationCommandOptionType.Number
                },
                {
                    description: 'The date (in "YYYY-MM-DD" format)',
                    max_length: 8,
                    min_length: 8,
                    name: 'date',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })

        const id = interaction.getNumberOption('id')
        const date = interaction.getStringOption('date')
        const embed: Partial<APIEmbed> = { color: 0xF8F8FF }
        const inPersonGame = await client.database.readInPersonGame(interaction.guildId, id)

        if (!inPersonGame) 
            embed.description = 'No in-person game found.'
        else if (!/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/.test(date) && !dayjs(date).isValid())
            embed.description = 'The provided date is not a valid date.'
        else {
            await client.database.updateInPersonGame(interaction.guildId, id, { date })

            embed.description = `Updated in-person game #${ id }!`
        }

        await interaction.updateReply({ embeds: [embed] })
    }
}