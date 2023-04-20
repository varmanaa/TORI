import type {
    AutocompleteInteraction,
    CommandInteraction,
    ModalInteraction
} from '#types/interaction'
import { DateAutocomplete, KeywordAutocomplete } from './autocomplete/index.js'
import { InPersonCommand, LatencyCommand, OnlineCommand, TagCommand } from './command/index.js'
import {
    CreateTagModal,
    RecordInPersonGameModal,
    UpdateInPersonGameModal,
    UpdateTagModal
} from './modal/index.js'

export const autocompletes: Map<string, AutocompleteInteraction> = new Map([
    ['date', DateAutocomplete],
    ['keyword', KeywordAutocomplete]
])
export const commands: Map<string, CommandInteraction> = new Map([
    ['in-person', InPersonCommand],
    ['latency', LatencyCommand],
    ['online', OnlineCommand],
    ['tag', TagCommand]
])
export const modals: Map<string, ModalInteraction> = new Map([
    ['create-tag', CreateTagModal],
    ['record-in-person-game', RecordInPersonGameModal],
    ['update-in-person-game', UpdateInPersonGameModal],
    ['update-tag', UpdateTagModal]
])
