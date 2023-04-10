import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
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
        const id = BigInt(keywordAndId.slice(lastHyphenIndex + 1))
        const { content: c } = await client.database.readTag(id)
        const content = `${ title }\n${ c }`

        await interaction.updateReply({ content })
    }
}