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

export const enum GameBit {
    Online = 1 << 0,
    Peel = 1 << 1,
    Toronto = 1 << 2,
    Unknown = 1 << 3,
    Waterloo = 1 << 4,
    York = 1 << 5,
    Potluck = 1 << 6,
    Space = 1 << 7,
    IsEastOnly = 1 << 8
}