import type { AutocompleteFocusedOption } from '#types/interaction'
import {
    type APIApplicationCommandAutocompleteInteraction,
    type APIApplicationCommandInteractionDataOption,
    type APIApplicationCommandOptionChoice,
    InteractionResponseType,
    Routes
} from '@discordjs/core'
import type { REST } from '@discordjs/rest'

export class ApplicationCommandAutocompleteInteraction {
    protected readonly id: string
    protected readonly options: APIApplicationCommandInteractionDataOption[]
    protected readonly rest: REST
    protected readonly token: string

    constructor(rest: REST, interaction: APIApplicationCommandAutocompleteInteraction ) {
        this.id = interaction.id
        this.rest = rest
        this.token = interaction.token
    }

    async autocomplete(choices: APIApplicationCommandOptionChoice[]) {
        await this.rest.post(
            Routes.interactionCallback(this.id, this.token),
            {
                auth: false,
                body: {
                    data: {
                        choices
                    },
                    type: InteractionResponseType.ApplicationCommandAutocompleteResult
                }
            }
        )
    }

    getFocusedOption(): AutocompleteFocusedOption {
        const option = this.options.find(o => ('focused' in o) && Boolean(o.focused)) as AutocompleteFocusedOption

        return option
    }
}