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

/**
 * Possible primary key types.
 */
export type TKey = number | string

/**
 * Possible array of primary key types.
 */
export type TKeyArray = number[] | string[]

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
	key?: TKey | TKeyArray,
}

/**
 * An abstract base class for entities containing a primary key.
 * This extends the base model class, with additional methods that assume the presence of a primary key in the underlying database.
 */
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
	 * Find a single entity of the model with the supplied key.
	 * This method internally calls the findOne method.
	 * @param this An instance of the KeyModel class.
	 * @param key A value that will be matched agains the primary key of all entities in the underlying database.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public async findByKey(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		options: IFindOptions = {},
	) {
		// Call the find one method with the primary key in the filter expression.
		return this.findOne({ key } as IFilterItem, options)
	}

	/**
	 * Modify a single entity of the model with a matching primary key using the supplied values.
	 * @param this An instance of the KeyModel class.
	 * @param key A value that will be matched agains the primary key of all entities in the underlying database.
	 * @param values Field values to be set on the matching entity.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public async modifyByKey(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		values: IModifyValues,
		options: IModifyOptions = {},
	) {
		// Call the update one method with the primary key in the filter expression and pass the submitted values.
		return this.modifyOne({ key } as IFilterItem, values, options)
	}

	/**
	 * Modify the entity indicated by the primary key that's part of the supplied entity, by storing its current field values.
	 * @param this An instance of the KeyModel class.
	 * @param entity An entity previously retrieved from the underlying database.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public async modifyEntity(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		entity: IEntity,
		options: IModifyOptions = {},
	) {
		// Call the modify by key method, using the entity's primary key and its field values.
		return this.modifyByKey(entity.key, lodash.pick(entity, lodash.without(this.fieldNames, 'key')) as IModifyValues, options)
	}

	/**
	 * Destroy a single entity of the model with a matching primary key.
	 * @param this An instance of the KeyModel class.
	 * @param key A value that will be matched agains the primary key of all entities in the underlying database.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public async destroyByKey(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		options: IDestroyOptions = {},
	) {
		// Call the destroy one method with the primary key in the filter expression.
		return this.destroyOne({ key } as IFilterItem, options)
	}

	/**
	 * Destroy the entity indicated by the primary key that's part of the supplied entity.
	 * @param this An instance of the KeyModel class.
	 * @param entity An entity previously retrieved from the underlying database.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public async destroyEntity(
		this: KeyModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		entity: IEntity,
		options: IDestroyOptions = {},
	) {
		// Call the destroy by key method, using the entity's primary key.
		return this.destroyByKey(entity.key, options)
	}
}
