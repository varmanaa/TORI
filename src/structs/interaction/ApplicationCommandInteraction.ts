import {
    type APIApplicationCommandInteractionDataOption,
    type APIChatInputApplicationCommandInteraction,
    type APIInteractionDataResolved,
    type APIInteractionResponseCallbackData,
    type APIMessage,
    type APIModalInteractionResponseCallbackData,
    ApplicationCommandOptionType,
    InteractionResponseType,
    Routes
} from '@discordjs/core'
import type { REST } from '@discordjs/rest'

export class ApplicationCommandInteraction {
    protected readonly applicationId: string
    readonly id: string
    protected readonly options: APIApplicationCommandInteractionDataOption[]
    protected readonly resolved: APIInteractionDataResolved
    protected readonly rest: REST
    protected readonly subcommand: string | null
    protected readonly token: string

    constructor(rest: REST, interaction: APIChatInputApplicationCommandInteraction ) {
        this.applicationId = interaction.application_id
        this.id = interaction.id
        this.options = interaction.data.options
        this.resolved = interaction.data.resolved
        this.rest = rest
        this.token = interaction.token

        if (this.options?.[0]?.type === ApplicationCommandOptionType.Subcommand) {
            this.subcommand = this.options[0].name
            this.options = this.options[0].options ?? []
        }
    }

    async defer({ ...data }: Pick<APIInteractionResponseCallbackData, 'flags'> = {}) {
        await this.rest.post(
            Routes.interactionCallback(this.id, this.token),
            {
                auth: false,
                body: {
                    data,
                    type: InteractionResponseType.DeferredChannelMessageWithSource
                }
            }
        )
    }

    async reply({ ...data }: Pick<APIInteractionResponseCallbackData, 'content' | 'components' | 'embeds' | 'flags'> = {}) {
        await this.rest.post(
            Routes.interactionCallback(this.id, this.token),
            {
                auth: false,
                body: {
                    data,
                    type: InteractionResponseType.ChannelMessageWithSource
                }
            }
        )
    }

    async replyWithModal(data: APIModalInteractionResponseCallbackData): Promise<void> {
        await this.rest.post(
            Routes.interactionCallback(this.id, this.token),
            {
                auth: false,
                body: {
                    data,
                    type: InteractionResponseType.Modal
                }
            }
        )
    }

    async response(): Promise<APIMessage> {
        const message = await this.rest.get(Routes.webhookMessage(this.applicationId, this.token)) as APIMessage

        return message
    }

    async updateReply({ ...body }: Pick<APIInteractionResponseCallbackData, 'content' | 'components' | 'embeds' | 'flags'> = {}) {
        await this.rest.patch(
            Routes.webhookMessage(this.applicationId, this.token),
            { auth: false, body }
        )
    }
}