import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIActionRowComponent,
    type APIApplicationCommandOption,
    type APIEmbed,
    type APIModalInteractionResponseCallbackData,
    type APITextInputComponent,
    ApplicationCommandOptionType,
    ComponentType,
    TextInputStyle
} from '@discordjs/core'

export const GameUpdateCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption  {
        return {
            
            description: 'Update game scores',
            name: 'update',
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
        const id = BigInt(interaction.getNumberOption('id'))
        const game = await client.database.readGame(interaction.guildId, id)


        if (!game) {
            const embed: Partial<APIEmbed> = { color: 0xF8F8FF, description: 'No game found.' }

            await interaction.updateReply({ embeds: [embed] })
            return
        }

        const players: Record<string, number> = {
            [game.playerOneId]: game.playerOneScore,
            [game.playerTwoId]: game.playerTwoScore,
            [game.playerThreeId]: game.playerThreeScore
        }

        if (game.playerFourScore)
            players[game.playerFourId] = game.playerFourScore

        const playerComponents: APIActionRowComponent<APITextInputComponent>[] = []

        for (const [id, score] of Object.entries(players)) {
            let label = id

            if (/^\d{17,20}$/.test(id)) {
                await client.fetchMember(interaction.guildId, id)

                const { username = 'unknown-user', discriminator = '-1' } = client.cache.users.get(BigInt(id)) ?? {}
                
                label = `${ username }#${ discriminator }`
            }

            playerComponents.push({
                components: [{
                    custom_id: id,
                    label,
                    max_length: 8,
                    placeholder: `Score for ${ label }`,
                    required: true,
                    style: TextInputStyle.Short,
                    type: ComponentType.TextInput,
                    value: score.toString()
                }],
                type: ComponentType.ActionRow
            })
        }

        const modal: APIModalInteractionResponseCallbackData = {
            components: [
                ...playerComponents,                
                {
                    components: [
                        {
                            custom_id: 'notes',
                            label: 'Notes',
                            max_length: 200,
                            placeholder: 'Add any notes (if applicable)',
                            required: false,
                            style: TextInputStyle.Paragraph,
                            type: ComponentType.TextInput,
                            value: game.notes
                        }
                    ],
                    type: ComponentType.ActionRow
                }
            ],
            custom_id: `update-game-${ id }`,
            title: 'Update game'
        }

        await interaction.replyWithModal(modal)
    }
}