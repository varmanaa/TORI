import type { ApplicationCommandAutocompleteInteraction, ToriClient } from '#structs'
import type { AutocompleteInteraction } from '#types/interaction'
import { APIApplicationCommandOptionChoice } from '@discordjs/core'

export const GameAutocomplete: AutocompleteInteraction = {
    getChoices(interaction: ApplicationCommandAutocompleteInteraction, client: ToriClient): APIApplicationCommandOptionChoice<string | number>[] {
        throw new Error('Function not implemented.')
    }
}