import type {
    ApplicationCommandAutocompleteInteraction,
    ApplicationCommandInteraction,
    ModalSubmitInteraction,
    ToriClient
} from '#structs'
import type {
    APIApplicationCommandInteractionDataIntegerOption,
    APIApplicationCommandInteractionDataNumberOption,
    APIApplicationCommandInteractionDataStringOption,
    APIApplicationCommandOptionChoice,
    RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core'

export type AutocompleteFocusedOption = 
    | APIApplicationCommandInteractionDataIntegerOption
    | APIApplicationCommandInteractionDataNumberOption
    | APIApplicationCommandInteractionDataStringOption
    
export interface AutocompleteInteraction {
    getChoices(interaction: ApplicationCommandAutocompleteInteraction, client?: ToriClient): APIApplicationCommandOptionChoice[]
}

export interface CommandInteraction {
    getCommand(): RESTPostAPIApplicationCommandsJSONBody
    run(interaction: ApplicationCommandInteraction, client?: ToriClient): void
}

export interface ModalInteraction {
    handle(interaction: ModalSubmitInteraction, client?: ToriClient): void
}