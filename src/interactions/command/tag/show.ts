import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
    type APIEmbed,
    ApplicationCommandOptionType,
    MessageFlags
 } from '@discordjs/core'

export const TagShowCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption {
        return {
            description: 'Show a tag',
            name: 'show',
            options: [
                {
                    autocomplete: true,
                    description: 'The tag to show',
                    name: 'tag',
                    required: true,
                    type: ApplicationCommandOptionType.String
                },
                {
                    description: 'The user to suggest this tag for',
                    name: 'user',
                    type: ApplicationCommandOptionType.User
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })

        const keywordAndId = interaction.getStringOption('tag')
        const lastHyphenIndex = keywordAndId.lastIndexOf('-')
        const keyword = keywordAndId.slice(0, lastHyphenIndex)
        const userId = interaction.getStringOption('user')
        const title = `*Tag suggestion (${ keyword })${ userId ? ` for <@${ userId }>` : '' }:*`
        const id = Number(keywordAndId.slice(lastHyphenIndex + 1))
        const tag = await client.database.readTag(interaction.guildId, id) 

        if (!tag) {
            const embed: Partial<APIEmbed> = { color: 0xF8F8FF, description: 'No tag found.' }

            await interaction.updateReply({ embeds: [embed] })
        } else {
            const content = `${ title }\n${ tag.content }`

            await interaction.updateReply({ content })
        }
    }
}