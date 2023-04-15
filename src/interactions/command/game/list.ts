import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
    type APIEmbed,
    type APIEmbedField,
    ApplicationCommandOptionType,
    MessageFlags
 } from '@discordjs/core'

export const GameListCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption  {
        return {
            description: 'List games (by date)',
            name: 'list',
            options: [
                {
                    autocomplete: true,
                    description: 'The games to look for',
                    name: 'game',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })

        const dateAndType = interaction.getStringOption('game')
        const lastUnderscoreIndex = dateAndType.lastIndexOf('_')
        const d = dateAndType.slice(0, lastUnderscoreIndex)
        const l = dateAndType.slice(lastUnderscoreIndex + 1)
        const games = await client.database.readGuildGames(interaction.guildId, d, l)
        const embeds: Partial<APIEmbed>[] = games.length
            ? Array
                .from({ length: Math.ceil(games.length / 5) }, (_, i) => games.slice(5 * i, 5 * (i + 1)))
                .map((gameChunk, i) => {
                    const fields: APIEmbedField[] = gameChunk.map(game => {
                        const players: Record<string, number> = {
                            [game.player_one_id]: game.player_one_score,
                            [game.player_two_id]: game.player_two_score,
                            [game.player_three_id]: game.player_three_score
                        }
                
                        if (game.player_four_id)
                            players[game.player_four_id] = game.player_four_score

                        const value = Object
                            .entries(players)
                            .sort((playerOne, playerTwo) => playerTwo[1] - playerOne[1])
                            .map(([id, score]) => {
                                const formattedScore = score
                                    .toString()
                                    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
                                const formattedId = (/^\d{17,20}$/.test(id))
                                    ? `<@${ id }>`
                                    : id
                
                                return `${ formattedId } - ${ formattedScore }`
                            })

                        if (game.notes?.length)
                            value.push(`\n__**Notes**__\n${ game.notes }`)

                        return {
                            inline: false,
                            name: `Game #${ game.id }`,
                            value: value.join('\n')
                        }
                    })

                    return {
                        color: 0xF8F8FF,
                        fields,
                        footer: { text: `Showing game${ gameChunk.length === 1 ? '' : 's' } ${ (5 * i) + 1}${ gameChunk.length === 1 ? '' : ` - ${ (5 * i) + gameChunk.length }` } of ${ games.length }` }
                    }
                })
            : [{ color: 0xF8F8FF, description: 'No games found!' }]

        await interaction.updateReply({ embeds })
    }
}