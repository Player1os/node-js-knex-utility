// Load app modules.
import {
	BaseModel,
	IDestroyOptions,
	IFindOptions,
	IModifyOptions,
} from '.../src/model/base'

/**
 * An abstract base class for entities containing a primary key.
 * This extends the base model class, with additional methods that assume the presence of a primary key in the underlying database.
 */
export abstract class KeyModel<
	TKey extends (number | string),
	IEntity extends { key: TKey },
	ICreateValues extends object,
	IModifyValues extends object,
	IFilterItem extends { key?: TKey | TKey[] },
	IInsertValues extends object,
	IUpdateValues extends object,
	IWhereFilterItem extends { key?: TKey | TKey[] }
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
	 * @param key A value that will be matched against the primary key of all entities in the underlying database.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws EntityNotFoundError.
	 */
	public async findByKey(
		this: KeyModel<TKey, IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		options: IFindOptions = {},
	) {
		// Call the find one method with the primary key in the filter expression.
		return this.findOne({ key } as IFilterItem, options)
	}

	/**
	 * Modify a single entity of the model with a matching primary key using the supplied values.
	 * @param this An instance of the KeyModel class.
	 * @param key A value that will be matched against the primary key of all entities in the underlying database.
	 * @param values Field values to be set on the matching entity.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws EntityNotFoundError.
	 */
	public async modifyByKey(
		this: KeyModel<TKey, IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		values: IModifyValues,
		options: IModifyOptions = {},
	) {
		// Call the update one method with the primary key in the filter expression and pass the submitted values.
		return this.modifyOne({ key } as IFilterItem, values, options)
	}

	/**
	 * Destroy a single entity of the model with a matching primary key.
	 * @param this An instance of the KeyModel class.
	 * @param key A value that will be matched against the primary key of all entities in the underlying database.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws EntityNotFoundError.
	 */
	public async destroyByKey(
		this: KeyModel<TKey, IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		key: TKey,
		options: IDestroyOptions = {},
	) {
		// Call the destroy one method with the primary key in the filter expression.
		return this.destroyOne({ key } as IFilterItem, options)
	}
}
