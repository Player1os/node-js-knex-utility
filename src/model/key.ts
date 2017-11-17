// Load local modules.
import { BaseModel } from '.../src/model/base'
import {
	IDestroyOptions,
	IFindOptions,
	IModifyOptions,
} from '.../src/options/base'

// Load npm modules.
import * as lodash from 'lodash'

/**
 * An abstract base class for entities containing a primary key.
 * This extends the base model class, with additional methods that assume the presence of a primary key in the underlying database.
 */
export abstract class KeyModel<
	TKey extends (number | string),
	IEntity extends { key: TKey },
	ICreateValues extends { key?: TKey },
	IFindFilterItem extends { key?: TKey | TKey[] },
	IModifyFilterItem extends { key?: TKey | TKey[] },
	IModifyValues extends object,
	IDestroyFilterItem extends { key?: TKey | TKey[] },
	IInsertValues extends { key?: TKey },
	ISelectFilterItem extends { key?: TKey | TKey[] },
	IUpdateFilterItem extends { key?: TKey | TKey[] },
	IUpdateValues extends object,
	IDeleteFilterItem extends { key?: TKey | TKey[] }
> extends BaseModel<
	IEntity,
	ICreateValues,
	IFindFilterItem,
	IModifyFilterItem,
	IModifyValues,
	IDestroyFilterItem,
	IInsertValues,
	ISelectFilterItem,
	IUpdateFilterItem,
	IUpdateValues,
	IDeleteFilterItem
> {
	/**
	 * Assuming the table contains a primary key field named 'key' that has an associated autoincrement sequence,
	 * this method increments the sequence and returns the current value.
	 * @param this An instance of the class.
	 */
	public async getNextKeyValue(
		this: KeyModel<
			TKey,
			IEntity,
			ICreateValues,
			IFindFilterItem,
			IModifyFilterItem,
			IModifyValues,
			IDestroyFilterItem,
			IInsertValues,
			ISelectFilterItem,
			IUpdateFilterItem,
			IUpdateValues,
			IDeleteFilterItem
		>,
	) {
		// Prepare the query for retrieving the next value.
		const queryBuilder = this.connection.instance.raw(`SELECT nextval('${this.tableName}_key_seq');`)

		// Execute the prepared query.
		const result = await queryBuilder

		// Retrieve the next value from the result.
		return (lodash.head(result['rows']) as { nextval: TKey }).nextval
	}

	/**
	 * Find a single entity of the model with the supplied key.
	 * This method internally calls the findOne method.
	 * @param this An instance of the class.
	 * @param key A value that will be matched against the primary key of all entities in the underlying database.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws EntityNotFoundError.
	 */
	public async findByKey(
		this: KeyModel<
			TKey,
			IEntity,
			ICreateValues,
			IFindFilterItem,
			IModifyFilterItem,
			IModifyValues,
			IDestroyFilterItem,
			IInsertValues,
			ISelectFilterItem,
			IUpdateFilterItem,
			IUpdateValues,
			IDeleteFilterItem
		>,
		key: TKey,
		options: IFindOptions = {},
	) {
		// Call the find one method with the primary key in the filter expression.
		return this.findOne({ key } as IFindFilterItem, options)
	}

	/**
	 * Modify a single entity of the model with a matching primary key using the supplied values.
	 * @param this An instance of the class.
	 * @param key A value that will be matched against the primary key of all entities in the underlying database.
	 * @param values Field values to be set on the matching entity.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws EntityNotFoundError.
	 */
	public async modifyByKey(
		this: KeyModel<
			TKey,
			IEntity,
			ICreateValues,
			IFindFilterItem,
			IModifyFilterItem,
			IModifyValues,
			IDestroyFilterItem,
			IInsertValues,
			ISelectFilterItem,
			IUpdateFilterItem,
			IUpdateValues,
			IDeleteFilterItem
		>,
		key: TKey,
		values: IModifyValues,
		options: IModifyOptions = {},
	) {
		// Call the update one method with the primary key in the filter expression and pass the submitted values.
		return this.modifyOne({ key } as IModifyFilterItem, values, options)
	}

	/**
	 * Destroy a single entity of the model with a matching primary key.
	 * @param this An instance of the class.
	 * @param key A value that will be matched against the primary key of all entities in the underlying database.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws EntityNotFoundError.
	 */
	public async destroyByKey(
		this: KeyModel<
			TKey,
			IEntity,
			ICreateValues,
			IFindFilterItem,
			IModifyFilterItem,
			IModifyValues,
			IDestroyFilterItem,
			IInsertValues,
			ISelectFilterItem,
			IUpdateFilterItem,
			IUpdateValues,
			IDeleteFilterItem
		>,
		key: TKey,
		options: IDestroyOptions = {},
	) {
		// Call the destroy one method with the primary key in the filter expression.
		return this.destroyOne({ key } as IDestroyFilterItem, options)
	}
}
