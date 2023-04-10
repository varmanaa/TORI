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
    RESTPostAPIApplicationCommandsJSONBody,
    RESTPostAPIBaseApplicationCommandsJSONBody
} from '@discordjs/core'

export type AutocompleteFocusedOption = 
    | APIApplicationCommandInteractionDataIntegerOption
    | APIApplicationCommandInteractionDataNumberOption
    | APIApplicationCommandInteractionDataStringOption
    
export interface AutocompleteInteraction {
    getChoices(interaction: ApplicationCommandAutocompleteInteraction, client: ToriClient): APIApplicationCommandOptionChoice<string | number>[]
}

export interface CommandInteraction {
    getCommand(): RESTPostAPIApplicationCommandsJSONBody | RESTPostAPIBaseApplicationCommandsJSONBody
    run(interaction: ApplicationCommandInteraction, client: ToriClient): void
}

export interface ModalInteraction {
    handle(interaction: ModalSubmitInteraction, client: ToriClient): void
}