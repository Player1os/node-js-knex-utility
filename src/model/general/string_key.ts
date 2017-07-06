// Load app modules.
import { KeyModel } from '.../src/model/key'

/**
 * A type for the primary key.
 */
export type TKey = string

/**
 * A base entity interface containing the primary key.
 */
export interface IKeyEntity {
	key: TKey,
}

/**
 * A base filter item containing the primary key or an array of primary keys.
 */
export interface IKeyFilterItem {
	key?: TKey | TKey[],
}

/**
 * An abstract class version of the KeyModel class with the generic parameters set to the most general type and assuming a string key type.
 */
export abstract class GeneralStringKeyModel
	extends KeyModel<TKey, IKeyEntity, object, object, IKeyFilterItem, object, object, IKeyFilterItem> {}
