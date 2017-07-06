// Load app modules.
import connection from '.../src/connection'
import EntityNotFoundError from '.../src/error/entity_not_found'
import MultipleEntitiesFoundError from '.../src/error/multiple_entities_found'
import countExecutor from '.../src/executor/count'
import existsExecutor from '.../src/executor/exists'
import writeExecutor from '.../src/executor/write'
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
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the BaseModel class.
	 * @param values An array of values used to create the entities.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws UniqueConstraintViolationError, ValidationError.
	 */
	public async create(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		values: ICreateValues[],
		options: ICreateOptions = {},
	) {
		// Optionally validate the submitted create values.
		if (!options.isValidationDisabled) {
			this._validateCreateValues(values)
		}

		// Prepare the query builder for the insert operation.
		const queryBuilder = this.insertQueryBuilder((values as any) as IInsertValues[], options)

		// Execute the prepared query builder.
		const entities = await writeExecutor(queryBuilder) as IEntity[]

		// Return the created entities.
		return entities
	}

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
			return this._retrieveOne(entities)
		}, options.transaction)
	}

	/**
	 * Find multiple entities of the model, matching the provided filter expression.
	 * If none or more than one entity is found, an error is thrown.
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws ValidationError.
	 */
	public async find(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IFindOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if (!options.isValidationDisabled) {
			this._validateFilterExpression(filterExpression)
		}

		// Prepare the query builder for the select operation.
		const queryBuilder = this.selectQueryBuilder((filterExpression as any) as IWhereFilterItem | IWhereFilterItem[], options)

		// Execute the prepared query builder.
		const entities = await queryBuilder as IEntity[]

		// Return the found entities.
		return entities
	}

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
			return this._retrieveOne(entities)
		}, options.transaction)
	}

	/**
	 * Find the count of all entities of the model, matching the submitted filter expression.
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression The query that describes the where clause to be built.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws ValidationError.
	 */
	public async count(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: ICountOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if (!options.isValidationDisabled) {
			this._validateFilterExpression(filterExpression)
		}

		// Prepare the query builder for the select operation.
		const queryBuilder = this.selectQueryBuilder((filterExpression as any) as IWhereFilterItem | IWhereFilterItem[], options)

		// Execute the prepared query.
		const count = await countExecutor(queryBuilder)

		// Return the count result.
		return count
	}

	/**
	 * Find whether at least one entity of the model exists, which matches the submitted filter expression.
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws ValidationError.
	 */
	public async exists(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IExistsOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if (!options.isValidationDisabled) {
			this._validateFilterExpression(filterExpression)
		}

		// Prepare the query builder for the select operation.
		const queryBuilder = this.selectQueryBuilder((filterExpression as any) as IWhereFilterItem | IWhereFilterItem[], options)

		// Execute the prepared query.
		const exists = await existsExecutor(queryBuilder)

		// Return the count result.
		return exists
	}

	/**
	 * Modify multiple entities of the model, matching the submitted filter expression, with the supplied values.
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param values Values used to modify the matching entities.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws UniqueConstraintViolationError, ValidationError.
	 */
	public async modify(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		values: IModifyValues,
		options: IModifyOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if (!options.isFilterValidationDisabled) {
			this._validateFilterExpression(filterExpression)
		}

		// Optionally validate the submitted filter expression.
		if (!options.isValuesValidationDisabled) {
			this._validateModifyValues(values)
		}

		// Prepare the query builder for the update operation.
		const queryBuilder = this.updateQueryBuilder(
			(filterExpression as any) as IWhereFilterItem | IWhereFilterItem[],
			(values as any) as IUpdateValues, options)

		// Execute the prepared query builder.
		const entities = await writeExecutor(queryBuilder) as IEntity[]

		// Return the created entities.
		return entities
	}

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
			return this._retrieveOne(entities)
		}, options.transaction)
	}

	/**
	 * Destroy multiple entities of the model, matching the submitted filter expression.
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query is executed and whether the inputs are validated.
	 * @throws UniqueConstraintViolationError, ValidationError.
	 */
	public async destroy(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
		options: IDestroyOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if (!options.isValidationDisabled) {
			this._validateFilterExpression(filterExpression)
		}

		// Prepare the query builder for the delete operation.
		const queryBuilder = this.deleteQueryBuilder((filterExpression as any) as IWhereFilterItem | IWhereFilterItem[], options)

		// Execute the prepared query.
		const entities = await queryBuilder as IEntity[]

		// Return the destroyed entities.
		return entities
	}

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
			return this._retrieveOne(entities)
		}, options.transaction)
	}

	/**
	 * Defines how an array of create values should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the BaseModel class.
	 * @param values An array of values used to create the entities.
	 * @throws ValidationError.
	 */
	protected abstract _validateCreateValues(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		values: ICreateValues[],
	)

	/**
	 * Defines how modify values should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the BaseModel class.
	 * @param values Values used to modify the matching entities.
	 * @throws ValidationError.
	 */
	protected abstract _validateModifyValues(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		values: IModifyValues,
	)

	/**
	 * Defines how the filter expression should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected abstract _validateFilterExpression(
		this: BaseModel<IEntity, ICreateValues, IModifyValues, IFilterItem, IInsertValues, IUpdateValues, IWhereFilterItem>,
		filterExpression: IFilterItem | IFilterItem[],
	)

	/**
	 * Retrieves the first entity from a collection of returned entities.
	 * Verifies whether the entity exists and whether mutliple entities are contained in the collection.
	 * @param this An instance of the BaseModel class.
	 * @param entities Entities retrived by the execution of a query with results.
	 * @throws EntityNotFoundError, MultipleEntitiesFoundError.
	 */
	private _retrieveOne(
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
