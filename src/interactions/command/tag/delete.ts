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
                    name: 'keyword',
                    required: true,
                    type: ApplicationCommandOptionType.String
                }
            ],
            type: ApplicationCommandOptionType.Subcommand
        }
    },
    async run(interaction: ApplicationCommandInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })

        const keywordAndId = interaction.getStringOption('keyword')
        const lastHyphenIndex = keywordAndId.lastIndexOf('-')
        const id = Number(keywordAndId.slice(lastHyphenIndex + 1))
        const tag = await client.database.deleteTag(interaction.guildId, id)
        const embed: Partial<APIEmbed> = { color: 0xF8F8FF }

        if (!tag)
            embed.description = 'No tag found.'
        else {
            const guild = client.cache.guilds.get(interaction.guildId)

            for (const keyword of tag.keywords)
                guild.tags.remove(keyword)
    
            embed.description = 'Deleted tag!'
        }
            
        await interaction.updateReply({ embeds: [embed] })
    }
}