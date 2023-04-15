import type { ApplicationCommandAutocompleteInteraction, ToriClient } from '#structs'
import type { AutocompleteInteraction } from '#types/interaction'
import { APIApplicationCommandOptionChoice } from '@discordjs/core'

export const GameAutocomplete: AutocompleteInteraction = {
    getChoices(interaction: ApplicationCommandAutocompleteInteraction, client: ToriClient): APIApplicationCommandOptionChoice<string | number>[] {
        const valueLowercased = interaction.getFocusedOption().value.toString().toLowerCase()
        const guild = client.cache.guilds.get(interaction.guildId)
        const choices: APIApplicationCommandOptionChoice<string>[] = []

        for (const [name, value] of guild.games.entries()) {
            if (name.toLowerCase().includes(valueLowercased))
                choices.push({ name, value })
                
            if (choices.length > 25)
                break
        }

        return choices
    }
}