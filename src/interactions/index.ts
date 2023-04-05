import type {
    AutocompleteInteraction,
    CommandInteraction,
    ModalInteraction
} from '#types/interaction'
// import {
    
// } from './autocomplete/index.js'
import {
    LatencyCommand
} from './command/index.js'
// import {

// } from './modal/index.js'

export const autocompletes: Map<string, AutocompleteInteraction> = new Map([
    
])
export const commands: Map<string, CommandInteraction> = new Map([
    ['latency', LatencyCommand]
])
export const modals: Map<string, ModalInteraction> = new Map([
    
])
