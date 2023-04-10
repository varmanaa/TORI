import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import type { RESTPostAPIApplicationCommandsJSONBody } from '@discordjs/core'

export const GameRemoveCommand: CommandInteraction = {
    getCommand(): RESTPostAPIApplicationCommandsJSONBody {
        throw new Error('Function not implemented.')
    },
    run(interaction: ApplicationCommandInteraction, client: ToriClient): void {
        throw new Error('Function not implemented.')
    }
}