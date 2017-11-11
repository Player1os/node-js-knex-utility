// Load local modules.
import { NumberKeyModel } from '.../src/model/number_key'

/**
 * A base entity interface containing the primary key.
 */
export interface INumberKeyEntity {
	key: number,
}

/**
 * A base values interface containing the optional primary key.
 */
export interface INumberKeyValues {
	key?: number,
}

/**
 * A base filter item containing the primary key or an array of primary keys.
 */
export interface INumberKeyFilterItem {
	key?: number | number[],
}

/**
 * An abstract class version of the KeyModel class with the generic parameters set to the most general type and assuming a number key type.
 */
export abstract class GeneralNumberKeyModel extends NumberKeyModel<
	INumberKeyEntity,
	INumberKeyValues,
	INumberKeyFilterItem,
	INumberKeyFilterItem,
	object,
	INumberKeyFilterItem,
	INumberKeyValues,
	INumberKeyFilterItem,
	INumberKeyFilterItem,
	object,
	INumberKeyFilterItem
> {}
