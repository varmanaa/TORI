import type { ApplicationCommandAutocompleteInteraction, ToriClient } from '#structs'
import type { AutocompleteInteraction } from '#types/interaction'
import type { APIApplicationCommandOptionChoice } from '@discordjs/core'

export const KeywordAutocomplete: AutocompleteInteraction = {
    getChoices(interaction: ApplicationCommandAutocompleteInteraction, client: ToriClient): APIApplicationCommandOptionChoice<string>[] {
        const valueLowercased = interaction.getFocusedOption().value.toString().toLowerCase()
        const guild = client.cache.guilds.get(interaction.guildId)
        const choices: APIApplicationCommandOptionChoice<string>[] = []

        for (const [keyword, id] of guild.tags.entries()) {
            if (keyword.toLowerCase().includes(valueLowercased))
                choices.push({ name: keyword, value: `${ keyword }-${ id }` })
                
            if (choices.length > 25)
                break
        }

        return choices
    }
}