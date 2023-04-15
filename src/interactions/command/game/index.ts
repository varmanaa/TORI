import type { ApplicationCommandInteraction, ToriClient } from '#structs'
import type { CommandInteraction } from '#types/interaction'
import {
    type APIEmbed,
    ApplicationCommandType,
    type RESTPostAPIApplicationCommandsJSONBody
} from '@discordjs/core'
import { GameCreateCommand } from './create.js'
import { GameDeleteCommand } from './delete.js'
import { GameListCommand } from './list.js'
import { GameUpdateCommand } from './update.js'

const enum GameCommandSubcommand {
    Create = 'create',
    Delete = 'delete',
    List = 'list',
    Update = 'update'
}

export const GameCommand: CommandInteraction = {
    getCommand(): RESTPostAPIApplicationCommandsJSONBody {
        return {
            description: 'Manage games',
            name: 'game',
            options: [
                GameCreateCommand.getCommand(),
                GameDeleteCommand.getCommand(),
                GameListCommand.getCommand(),
                GameUpdateCommand.getCommand()
            ],
            type: ApplicationCommandType.ChatInput
        }
    },
    async run(interaction: ApplicationCommandInteraction, client: ToriClient): Promise<void> {
        switch (interaction.subcommand) {
            case GameCommandSubcommand.Create: return GameCreateCommand.run(interaction, client)
            case GameCommandSubcommand.Delete: return GameDeleteCommand.run(interaction, client)
            case GameCommandSubcommand.List: return GameListCommand.run(interaction, client)
            case GameCommandSubcommand.Update: return GameUpdateCommand.run(interaction, client)
            default: {
                const embed: Partial<APIEmbed> = { color: 0xF8F8FF, description: 'Unknown subcommand' }

                await interaction.reply({ embeds: [embed] })
            }
        }
    }
}