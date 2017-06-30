// Load app modules.
import {
	BaseModel,
	IDestroyOptions,
	IFindOptions,
	IModifyOptions,
} from '.../src/model/base'

// Load npm modules.
import * as lodash from 'lodash'

// Define and expose the types that describe the table key and array of table keys.
export type TKey = number | string
export type TKeyArray = number[] | string[]

// Define the interfaces that describe input values and query items containing the table key or an array of table keys.
export interface IKeyEntity {
	key: TKey,
}
export interface IKeyFilterItem {
	key?: TKey | TKeyArray,
}

// Expose the base model class.
export abstract class KeyModel<
	IEntity extends IKeyEntity,
	ICreateValues extends object,
	IModifyValues extends object,
	IFilterItem extends IKeyFilterItem,
	IInsertValues extends object,
	IUpdateValues extends object,
	IWhereFilterItem extends IKeyFilterItem
> extends BaseModel<
	IEntity,
	ICreateValues,
	IModifyValues,
	IFilterItem,
	IInsertValues,
	IUpdateValues,
	IWhereFilterItem
> {
	/**
	 * Find a single entity of the model matching the key.
	 * @param key
	 * @param options
	 */
	public async findByKey(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		options: IFindOptions = {},
	) {
		// Call the find one method with only the key in the query.
		return this.findOne({ key } as IFilterItem, options)
	}

	/**
	 * Update a single entity of the model matching the key with the supplied values.
	 * @param key
	 * @param values
	 * @param options
	 */
	public async modifyByKey(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		values: IModifyValues,
		options: IModifyOptions = {},
	) {
		// Call the update one method with only the key in the query.
		return this.modifyOne({ key } as IFilterItem, values, options)
	}

	/**
	 * Update the entity indicated by the primary key that's part of the given entity.
	 * @param entity
	 * @param options
	 */
	public async modifyEntity(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		entity: IEntity,
		options: IModifyOptions = {},
	) {
		// Update the entity with the given document key using the given document values.
		return this.modifyByKey(entity.key, lodash.pick(entity, lodash.without(this.fieldNames, 'key')) as IModifyValues, options)
	}

	/**
	 * Destroy a single entity of the model matching the key.
	 * @param key
	 * @param options
	 */
	public async destroyByKey(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		options: IDestroyOptions = {},
	) {
		// Call the destroy one method with only the key in the query.
		return this.destroyOne({ key } as IFilterItem, options)
	}

	/**
	 * Destroy the entity indicated by the primary key that's part of the given entity.
	 * @param entity
	 * @param options
	 */
	public async destroyEntity(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		entity: IEntity,
		options: IDestroyOptions = {},
	) {
		// Destroy the entity with the given document key.
		return this.destroyByKey(entity.key, options)
	}
}
