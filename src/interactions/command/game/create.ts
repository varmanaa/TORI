import type { ApplicationCommandInteraction } from '#structs'
import { CommandInteraction, GameBit } from '#types/interaction'
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
import { GameLocation, GameType } from '@prisma/client'

export const GameCreateCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption {
        return {
            description: 'Create game',
            name: 'create',
            options: [
                {
                    choices: [
                        { name: 'Meetup (Peel)', value: GameLocation.PEEL },
                        { name: 'Meetup (Toronto)', value: GameLocation.TORONTO },
                        { name: 'Meetup (Waterloo)', value: GameLocation.WATERLOO },
                        { name: 'Meetup (York)', value: GameLocation.YORK },
                        { name: 'Online', value: GameLocation.ONLINE }
                    ],
                    description: 'The game location',
                    name: 'location',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    description: 'Player 1',
                    name: 'player-one',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    description: 'Player 2',
                    name: 'player-two',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    description: 'Player 3',
                    name: 'player-three',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    description: 'Player 4',
                    name: 'player-four',
                    type: ApplicationCommandOptionType.String
                },
                {
                    choices: [
                        { name: 'Potluck', value: GameType.POTLUCK },
                        { name: 'Space', value: GameType.SPACE }
                    ],
                    description: 'The game type',
                    name: 'type',
                    type: ApplicationCommandOptionType.String
                },
                {
                    description: 'Is this game an east-only game?',
                    name: 'east-only',
                    type: ApplicationCommandOptionType.Boolean
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction): Promise<void> {
        const players: Record<string, string> = {}

        for (const name of ['player-one', 'player-two', 'player-three', 'player-four']) {
            const value = interaction.getStringOption(name)

            if (!value)
                continue

            const id = value.match(/^<@!?(?<id>\d{15,20})>$/)

            if (id?.[1]) {
                const { discriminator, username } = interaction.resolved.users[id[1]]

                players[id[1]] = `${ username }#${ discriminator }`
            }
            if (/^[a-zA-Z\d]+$/.test(value))
                players[value] = value
        }

        if (Object.keys(players).length < 3) {
            const embed: Partial<APIEmbed> = {
                color: 0xF8F8FF,
                description: `You have provided ${ Object.keys(players).length } valid player(s). Please provide either **three** or **four** valid players.`
            }

            await interaction.reply({ embeds: [embed] })
            return
        }

        let bits: number

        const location = interaction.getStringOption('location') as GameLocation
        const type = interaction.getStringOption('type') as GameType
        const isEastOnly = interaction.getBooleanOption('east-only')

        switch (location) {
            case 'ONLINE': { bits |= GameBit.Online; break; }
            case 'PEEL': { bits |= GameBit.Peel; break; }
            case 'TORONTO': { bits |= GameBit.Toronto; break; }
            case 'UNKNOWN': { bits |= GameBit.Unknown; break; }
            case 'WATERLOO': { bits |= GameBit.Waterloo; break; }
            case 'YORK': { bits |= GameBit.York; break; }
        }
        
        switch (type) {
            case 'POTLUCK': { bits |= GameBit.Potluck; break; }
            case 'SPACE': { bits |= GameBit.Space; break; }
        }

        if (isEastOnly)
            bits |= GameBit.IsEastOnly

        const playerComponents: APIActionRowComponent<APITextInputComponent>[] = Object
            .entries(players)
            .map(([custom_id, label]) => {
                return {
                    components: [{
                        custom_id,
                        label,
                        max_length: 8,
                        placeholder: `Score for ${ label }`,
                        required: true,
                        style: TextInputStyle.Short,
                        type: ComponentType.TextInput
                    }],
                    type: ComponentType.ActionRow
                }
            })
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
                            type: ComponentType.TextInput
                        }
                    ],
                    type: ComponentType.ActionRow
                }
            ],
            custom_id: `create-game-${ bits }`,
            title: 'Create game'
        }

        await interaction.replyWithModal(modal)
    }
}