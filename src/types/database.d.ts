import type { InPersonGameLocation, Tag } from '@prisma/client'

export type DatabaseGuildData = {
    inPersonGames: { date: Date, location: InPersonGameLocation }[],
    onlineGames: { date: Date }[],
    tags: Tag[]
}

// ref - https://github.com/sindresorhus/type-fest/blob/main/source/require-at-least-one.d.ts
export type RequireAtLeastOne<
	ObjectType,
	KeysType extends keyof ObjectType = keyof ObjectType,
> = {
	// For each `Key` in `KeysType` make a mapped type:
	[Key in KeysType]-?: Required<Pick<ObjectType, Key>> & // 1. Make `Key`'s type required
	// 2. Make all other keys in `KeysType` optional
	Partial<Pick<ObjectType, Exclude<KeysType, Key>>>;
}[KeysType] &
// 3. Add the remaining keys not in `KeysType`
Except<ObjectType, KeysType>