import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
    type APIModalInteractionResponseCallbackData,
    ApplicationCommandOptionType,
    ComponentType,
    TextInputStyle
} from '@discordjs/core'

export const TagUpdateCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption {
        return {
            description: 'Update a tag',
            name: 'update',
            options: [
                {
                    autocomplete: true,
                    description: 'The tag to update',
                    name: 'tag',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction, client: ToriClient): Promise<void> {
        const keywordAndId = interaction.getStringOption('tag')
        const lastHyphenIndex = keywordAndId.lastIndexOf('-')
        const id = BigInt(keywordAndId.slice(lastHyphenIndex + 1))
        const { keywords, content } = await client.database.readTag(id)
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
                            value: keywords.join(',')
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
                            value: content
                        }
                    ],
                    type: ComponentType.ActionRow
                }
            ],
            custom_id: `update-tag-${ id }`,
            title: 'Update tag'
        }

        await interaction.replyWithModal(modal)
    }
}