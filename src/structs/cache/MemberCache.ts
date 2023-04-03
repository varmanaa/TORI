import type {
    APIGuildMember,
    GatewayGuildMemberAddDispatchData,
    GatewayGuildMemberUpdateDispatchData
} from '@discordjs/core'

interface Member {
    communicationDisabledUntil: Date | null
    roles: bigint[]
}

export class MemberCache {
    #items: Map<bigint, Member> = new Map()

    get(key: bigint): Member | null {
        return this.#items.get(key) ?? null
    }

    insert(member: APIGuildMember | GatewayGuildMemberAddDispatchData | GatewayGuildMemberUpdateDispatchData) {
        this.#items.set(
            BigInt(member.user.id),
            {
                communicationDisabledUntil: member.communication_disabled_until
                    ? new Date(member.communication_disabled_until)
                    : null,
                roles: member.roles.map(BigInt)
            }
        )
    }

    remove(key: bigint) {
        this.#items.delete(key)
    }
}