import type { ApplicationCommandInteraction } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
    type APIModalInteractionResponseCallbackData,
    ApplicationCommandOptionType,
    ComponentType,
    TextInputStyle
} from '@discordjs/core'

export const TagAddCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption  {
        return {
            description: 'Add a tag',
            name: 'add',
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction): Promise<void> {
        const modal: APIModalInteractionResponseCallbackData = {
            components: [
                {
                    components: [
                        {
                            custom_id: 'keywords',
                            label: 'Tag keywords',
                            max_length: 50,
                            placeholder: 'Comma-separated list of tag keywords',
                            required: true,
                            style: TextInputStyle.Short,
                            type: ComponentType.TextInput,
                            value: null
                        }
                    ],
                    type: ComponentType.ActionRow
                },
                {
                    components: [
                        {
                            custom_id: 'content',
                            label: 'Tag content',
                            max_length: 2500,
                            placeholder: 'To ron, to riichi...',
                            required: true,
                            style: TextInputStyle.Paragraph,
                            type: ComponentType.TextInput,
                            value: null
                        }
                    ],
                    type: ComponentType.ActionRow
                }
            ],
            custom_id: 'create-tag',
            title: 'Create tag'
        }

        await interaction.replyWithModal(modal)
    }
}