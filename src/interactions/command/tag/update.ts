import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
    type APIEmbed,
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
                    name: 'keyword',
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
        const id = Number(keywordAndId.slice(lastHyphenIndex + 1))
        const tag = await client.database.readTag(interaction.guildId, id)

        if (!tag) {
            const embed: Partial<APIEmbed> = { color: 0xF8F8FF, description: 'No tag found.' }

            await interaction.reply({ embeds: [embed] })
        } else {
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
                                value: tag.keywords.join(',')
                            }
                        ],
                        type: ComponentType.ActionRow
                    },
                    {
                        components: [
                            {
                                custom_id: 'content',
                                label: 'Tag content',
                                max_length: 1500,
                                placeholder: 'To ron, to riichi...',
                                required: true,
                                style: TextInputStyle.Paragraph,
                                type: ComponentType.TextInput,
                                value: tag.content
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
}