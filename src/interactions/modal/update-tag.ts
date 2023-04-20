import type { ModalSubmitInteraction, ToriClient } from '#structs'
import type { ModalInteraction } from '#types/interaction'
import { type APIEmbed, MessageFlags } from '@discordjs/core'

export const UpdateTagModal: ModalInteraction = {
    async handle(interaction: ModalSubmitInteraction, client: ToriClient): Promise<void> {
        await interaction.defer({ flags: MessageFlags.Ephemeral })

        const guild = client.cache.guilds.get(interaction.guildId)
        const tagId = Number(interaction.data.custom_id.split('-')[2])

        for (const [keyword, id] of guild.tags.entries())
            if (id === tagId)
                guild.tags.remove(keyword)

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

        const existingKeywords = keywordsArray.filter(keyword => Boolean(guild.tags.get(keyword)))
    
        if (existingKeywords.length) {
            embed.description = `The following keyword(s) are already used - ${ new Intl.ListFormat('en').format(existingKeywords) }.`
        
            await interaction.updateReply({ embeds: [embed] })
            return 
        }

        const tag = await client.database.updateTag(interaction.guildId, tagId, keywordsArray, content)

        guild.tags.insert(tag)
        embed.description = 'Updated tag!'

        await interaction.updateReply({ embeds: [embed] })
    }
}