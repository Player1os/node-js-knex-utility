// Load app modules.
import connection from '.../src/connection'
import EntityNotFoundError from '.../src/error/entity_not_found'
import MultipleEntitiesFoundError from '.../src/error/multiple_entities_found'
import {
	IDeleteOptions,
	IInsertOptions,
	IOptions,
	ISelectOptions,
	IUpdateOptions,
	Model,
} from '.../src/model'

// Declare and expose the interfaces for options.
export interface ICreateOptions extends IInsertOptions {
	isValidationDisabled?: boolean,
}
export interface ICountOptions extends IOptions {
	isValidationDisabled?: boolean,
}
export interface IExistsOptions extends IOptions {
	isValidationDisabled?: boolean,
}
export interface IFindOptions extends ISelectOptions {
	isValidationDisabled?: boolean,
}
export interface IModifyOptions extends IUpdateOptions {
	isFilterValidationDisabled?: boolean,
	isValuesValidationDisabled?: boolean,
}
export interface IDestroyOptions extends IDeleteOptions {
	isValidationDisabled?: boolean,
}

// Expose the base crud trait class.
export abstract class BaseModel<
	IEntity extends object,
	ICreateValues extends object,
	IModifyValues extends object,
	IFilterItem extends object,
	IInsertValues extends object,
	IUpdateValues extends object,
	IWhereFilterItem extends object
> extends Model <
	IInsertValues,
	IUpdateValues,
	IWhereFilterItem
> {
	/**
	 *
	 * @param this
	 * @param values
	 * @param options
	 */
	public abstract async create(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		values: ICreateValues[],
		options: ICreateOptions,
	): Promise<IEntity[]>

	/**
	 *
	 * @param this
	 * @param values
	 * @param options
	 */
	public async createOne(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		values: ICreateValues,
		options: ICreateOptions,
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return connection.transaction(async (transaction) => {
			// Execute the create method with the submitted arguments.
			const entities = await this.create([values], Object.assign({}, options, { transaction }))

			// Return the created entity.
			return this._retireveOne(entities)
		}, options.transaction)
	}

	/**
	 *
	 * @param this
	 * @param filterExpression
	 * @param options
	 */
	public abstract async find(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IFindOptions,
	): Promise<IEntity[]>

	/**
	 *
	 * @param this
	 * @param filterExpression
	 * @param options
	 */
	public async findOne(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IFindOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return connection.transaction(async (transaction) => {
			// Execute the create method with the submitted arguments.
			const entities = await this.find(filterExpression, Object.assign({}, options, { transaction }))

			// Return the created entity.
			return this._retireveOne(entities)
		}, options.transaction)
	}

	/**
	 * Find the count of all entities of the model matching the query.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	public abstract async count(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: ICountOptions,
	): Promise<number>

	/**
	 *
	 * @param this
	 * @param filterExpression
	 * @param options
	 */
	public abstract async exists(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IExistsOptions,
	): Promise<boolean>

	/**
	 *
	 * @param this An instance of the model itself.
	 * @param values
	 * @param options Parameters for the underlying query and validation.
	 */
	public abstract async modify(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		values: IModifyValues,
		options: IUpdateOptions,
	): Promise<IEntity[]>

	/**
	 * Update a single entity of the model matching the query with the supplied values.
	 * @param this An instance of the model itself.
	 * @param filterExpression The query that describes the where clause to be built.
	 * @param values
	 * @param options Parameters for the underlying query and validation.
	 */
	public async modifyOne(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		values: IModifyValues,
		options: IUpdateOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return connection.transaction(async (transaction) => {
			// Execute the update method with the submitted arguments.
			const entities = await this.modify(filterExpression, values, Object.assign({}, options, { transaction }))

			// Return the updated entity.
			return this._retireveOne(entities)
		}, options.transaction)
	}

	/**
	 *
	 * @param this An instance of the model itself.
	 * @param filterExpression
	 * @param options Parameters for the underlying query and validation.
	 */
	public abstract async destroy(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IDestroyOptions,
	): Promise<IEntity[]>

	/**
	 * Destroy a single entity of the model matching the query.
	 * @param this An instance of the model itself.
	 * @param filterExpression The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	public async destroyOne(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IDestroyOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return connection.transaction(async (transaction) => {
			// Execute the destroy method with the submitted arguments.
			const entities = await this.destroy(filterExpression, Object.assign({}, options, { transaction }))

			// Return the destroyed entity.
			return this._retireveOne(entities)
		}, options.transaction)
	}

	/**
	 *
	 * @param this
	 * @param entities
	 */
	private _retireveOne(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		entities: IEntity[],
	) {
		// Check if at least one entity is given.
		if (entities.length === 0) {
			throw new EntityNotFoundError()
		}

		// Check if more than one entity is given.
		if (entities.length > 1) {
			throw new MultipleEntitiesFoundError()
		}

		// Return the first entity.
		return entities[0]
	}
}
