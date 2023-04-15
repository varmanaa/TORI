import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIApplicationCommandOption,
    type APIEmbed,
    ApplicationCommandOptionType,
    MessageFlags
} from '@discordjs/core'

export const TagDeleteCommand: CommandInteraction = {
    getCommand(): APIApplicationCommandOption  {
        return {
            description: 'Delete a tag',
            name: 'delete',
            options: [
                {
                    autocomplete: true,
                    description: 'The tag to delete',
                    name: 'tag',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })

        const keywordAndId = interaction.getStringOption('tag')
        const lastHyphenIndex = keywordAndId.lastIndexOf('-')
        const id = BigInt(keywordAndId.slice(lastHyphenIndex + 1))
        const tag = await client.database.deleteTag(id)
        const embed: Partial<APIEmbed> = { color: 0xF8F8FF }

        if (tag) {
            const guild = client.cache.guilds.get(interaction.guildId)

            for (const keyword of tag.keywords)
                guild.tags.remove(keyword)
    
            embed.description = 'Deleted tag!'
        } else
            embed.description = 'No tag found.'


        await interaction.updateReply({ embeds: [embed] })
    }
}