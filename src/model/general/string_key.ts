// Load local modules.
import { StringKeyModel } from '.../src/model/string_key'

/**
 * A base entity interface containing the primary key.
 */
export interface IStringKeyEntity {
	key: string,
}

/**
 * A base values interface containing the optional primary key.
 */
export interface IStringKeyValues {
	key?: string,
}

/**
 * A base filter item interface containing the primary key or an array of primary keys.
 */
export interface IStringKeyFilterItem {
	key?: string | string[],
}

/**
 * An abstract class version of the KeyModel class with the generic parameters set to the most general type and assuming a string key type.
 */
export abstract class GeneralStringKeyModel extends StringKeyModel<
	IStringKeyEntity,
	IStringKeyValues,
	IStringKeyFilterItem,
	IStringKeyFilterItem,
	object,
	IStringKeyFilterItem,
	IStringKeyValues,
	IStringKeyFilterItem,
	IStringKeyFilterItem,
	object,
	IStringKeyFilterItem
> {}
