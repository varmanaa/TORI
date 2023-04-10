import type { ModalSubmitInteraction, ToriClient } from '#structs'
import type { ModalInteraction } from '#types/interaction'

export const UpdateGameModal: ModalInteraction = {
    handle(interaction: ModalSubmitInteraction, client: ToriClient): void {
        throw new Error('Function not implemented.')
    }
}