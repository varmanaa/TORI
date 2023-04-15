import type {
    AutocompleteInteraction,
    CommandInteraction,
    ModalInteraction
} from '#types/interaction'
import { GameAutocomplete, TagAutocomplete } from './autocomplete/index.js'
import {
    GameCommand,
    LatencyCommand,
    TagCommand
} from './command/index.js'
import {
    CreateGameModal,
    CreateTagModal,
    UpdateGameModal,
    UpdateTagModal
} from './modal/index.js'

export const autocompletes: Map<string, AutocompleteInteraction> = new Map([
    ['game', GameAutocomplete],
    ['tag', TagAutocomplete]
])
export const commands: Map<string, CommandInteraction> = new Map([
    ['game', GameCommand],
    ['latency', LatencyCommand],
    ['tag', TagCommand]
])
export const modals: Map<string, ModalInteraction> = new Map([
    ['create-game', CreateGameModal],
    ['create-tag', CreateTagModal],
    ['update-game', UpdateGameModal],
    ['update-tag', UpdateTagModal]
])
