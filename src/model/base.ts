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

// Expose the base model class.
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
	 * Create multiple entities of the model, using the provided array of values.
	 * @param this An instance of the BaseModel class.
	 * @param values An array of values used to create the entities.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws UniqueConstraintViolationError.
	 */
	public abstract async create(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		values: ICreateValues[],
		options: ICreateOptions,
	): Promise<IEntity[]>

	/**
	 * Create a single entity of the model, using the provided values.
	 * If none or more than one entity is created, an error is thrown.
	 * @param this An instance of the BaseModel class.
	 * @param values Values used to create the entity.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws EntityNotFoundError, MultipleEntitiesFoundError, UniqueConstraintViolationError.
	 */
	public async createOne(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		values: ICreateValues,
		options: ICreateOptions = {},
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
	 * Find multiple entities of the model, matching the provided filter expression.
	 * If none or more than one entity is found, an error is thrown.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public abstract async find(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IFindOptions,
	): Promise<IEntity[]>

	/**
	 * Find a single entity of the model, matching the provided filter expression.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws EntityNotFoundError, MultipleEntitiesFoundError.
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
	 * Find the count of all entities of the model, matching the submitted filter expression.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression The query that describes the where clause to be built.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public abstract async count(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: ICountOptions,
	): Promise<number>

	/**
	 * Find whether at least one entity of the model exists, which matches the submitted filter expression.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public abstract async exists(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IExistsOptions,
	): Promise<boolean>

	/**
	 * Modify multiple entities of the model, matching the submitted filter expression, with the supplied values.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param values Values used to modify the matching entities.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public abstract async modify(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		values: IModifyValues,
		options: IModifyOptions,
	): Promise<IEntity[]>

	/**
	 * Modify a single entity of the model, matching the submitted filter expression, with the supplied values.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param values Values used to modify the matching entity.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public async modifyOne(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		values: IModifyValues,
		options: IModifyOptions = {},
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
	 * Destroy multiple entities of the model, matching the submitted filter expression.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 */
	public abstract async destroy(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IDestroyOptions,
	): Promise<IEntity[]>

	/**
	 * Destroy a single entity of the model, matching the submitted filter expression.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
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
	 * Retrieves the first entity from a collection of returned entities.
	 * Verifies whether the entity exists and whether mutliple entities are contained in the collection.
	 * @param this An instance of the BaseModel class.
	 * @param entities Entities retrived by the execution of a query with results.
	 * @throws EntityNotFoundError, MultipleEntitiesFoundError.
	 */
	private _retireveOne(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		entities: IEntity[],
	) {
		// Check if at least one entity is given.
		if (entities.length === 0) {
			throw new EntityNotFoundError(this.tableName)
		}

		// Check if more than one entity is given.
		if (entities.length > 1) {
			throw new MultipleEntitiesFoundError(this.tableName)
		}

		// Return the first entity.
		return entities[0]
	}
}
