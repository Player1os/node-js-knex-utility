// Load app modules.
import { KeyModel } from '.../src/model/key'

/**
 * A type for the primary key.
 */
export type TKey = number

/**
 * A base entity interface containing the primary key.
 */
export interface IKeyEntity {
	key: TKey,
}

/**
 * A base values interface containing the optional primary key.
 */
export interface IKeyValues {
	key?: TKey,
}

/**
 * A base filter item containing the primary key or an array of primary keys.
 */
export interface IKeyFilterItem {
	key?: TKey | TKey[],
}

/**
 * An abstract class version of the KeyModel class with the generic parameters set to the most general type and assuming a number key type.
 */
export abstract class GeneralNumberKeyModel
	extends KeyModel<TKey, IKeyEntity, IKeyValues, IKeyValues, IKeyFilterItem, IKeyValues, IKeyValues, IKeyFilterItem> {}
