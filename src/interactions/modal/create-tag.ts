import type { ModalSubmitInteraction, ToriClient } from '#structs'
import type { ModalInteraction } from '#types/interaction'
import { type APIEmbed, MessageFlags } from '@discordjs/core'

export const CreateTagModal: ModalInteraction = {
    async handle(interaction: ModalSubmitInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })

        const { keywords, content } = interaction.values()
        const keywordsArray = keywords
            .split(',')
            .map(s => s.trim())
        const embed: Partial<APIEmbed> = { color: 0xF8F8FF }

        if (keywordsArray.some(keyword => !keyword.length)) {
            embed.description = 'Some of the provided keywords do not contain any characters. Please try again and ensure that all keywords contain at least one character.'
            
            await interaction.updateReply({ embeds: [embed] })
            return
        }

        const guild = client.cache.guilds.get(interaction.guildId)
        const existingKeywords = keywordsArray.filter(keyword => Boolean(guild.tags.get(keyword)))
    
        if (existingKeywords.length) {
            embed.description = `The following keyword(s) are already used - ${ new Intl.ListFormat('en').format(existingKeywords) }.`
        
            await interaction.updateReply({ embeds: [embed] })
            return 
        }

        const tag = await client.database.insertTag(interaction.guildId, keywordsArray, content)

        guild.tags.insert(tag)
        embed.description = 'Created tag!'

        await interaction.updateReply({ embeds: [embed] })
    }
}