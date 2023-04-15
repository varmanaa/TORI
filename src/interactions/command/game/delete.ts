import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
    type APIEmbed,
    ApplicationCommandOptionType,
    MessageFlags
} from '@discordjs/core'
import dayjs from 'dayjs'

export const GameDeleteCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption {
        return {
            description: 'Delete game',
            name: 'delete',
            options: [
                {
                    description: 'The game ID',
                    name: 'id',
                    required: true,
                    type: ApplicationCommandOptionType.Number
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })
       
        const id = BigInt(interaction.getNumberOption('id'))
        const game = await client.database.deleteGame(id)
        const embed: Partial<APIEmbed> = { color: 0xF8F8FF }

        if (game) {
            const { createdAt, id, location } = game
            const d = dayjs(createdAt).format('YYYY-MM-DD')
            const games = await client.database.readGuildGames(interaction.guildId, d, location)

            if (!games.length) {
                const l = `${ location.charAt(0).toUpperCase() }${ location.slice(1).toLowerCase() }`

                client.cache.guilds.get(interaction.guildId).games.remove(d, l)
            }
                

            embed.description = `Deleted game #${ id }!`
        } else
            embed.description = 'No game found.'

        await interaction.updateReply({ embeds: [embed] })
    }
}