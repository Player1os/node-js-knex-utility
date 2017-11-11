// Load local modules.
import EntityNotFoundError from '.../src/error/entity_not_found'
import MultipleEntitiesFoundError from '.../src/error/multiple_entities_found'
import executor from '.../src/executor'
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

// Define interface for the returned count row.
export interface IReturnedCountRow {
	count: string,
}

// Expose the base model class.
export abstract class BaseModel<
	IEntity extends object,
	ICreateValues extends object,
	IFindFilterItem extends object,
	IModifyFilterItem extends object,
	IModifyValues extends object,
	IDestroyFilterItem extends object,
	IInsertValues extends object,
	ISelectFilterItem extends object,
	IUpdateFilterItem extends object,
	IUpdateValues extends object,
	IDeleteFilterItem extends object
> extends Model <
	IInsertValues,
	ISelectFilterItem,
	IUpdateFilterItem,
	IUpdateValues,
	IDeleteFilterItem
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
		this: BaseModel<
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
		values: ICreateValues[],
		options: ICreateOptions = {},
	) {
		// Optionally validate the submitted create values.
		if ((options.isValidationDisabled === undefined) || !options.isValidationDisabled) {
			this._validateCreateValues(values)
		}

		// Prepare the query builder for the insert operation.
		const queryBuilder = this.insertQueryBuilder(this._transformCreateValues(values), options)

		// Execute the prepared query builder.
		const entities = await executor(queryBuilder) as IEntity[]

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
		this: BaseModel<
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
		values: ICreateValues,
		options: ICreateOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return this.connection.transaction(async (transaction) => {
			// Execute the create method with the submitted arguments.
			const entities = await this.create([values], {
				...options,
				transaction,
			})

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
		this: BaseModel<
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
		filterExpression: IFindFilterItem | IFindFilterItem[],
		options: IFindOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if ((options.isValidationDisabled === undefined) || !options.isValidationDisabled) {
			this._validateFindFilterExpression(filterExpression)
		}

		// Prepare the query builder for the select operation.
		const queryBuilder = this.selectQueryBuilder(this._transformFindFilterExpression(filterExpression), options)

		// Execute the prepared query builder.
		const entities = await executor(queryBuilder) as IEntity[]

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
		this: BaseModel<
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
		filterExpression: IFindFilterItem | IFindFilterItem[],
		options: IFindOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return this.connection.transaction(async (transaction) => {
			// Execute the create method with the submitted arguments.
			const entities = await this.find(filterExpression, {
				...options,
				transaction,
			})

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
		this: BaseModel<
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
		filterExpression: IFindFilterItem | IFindFilterItem[],
		options: ICountOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if ((options.isValidationDisabled === undefined) || !options.isValidationDisabled) {
			this._validateFindFilterExpression(filterExpression)
		}

		// Prepare the query builder for the select operation with a count.
		const queryBuilder = this.selectQueryBuilder(this._transformFindFilterExpression(filterExpression), options)
			.count()

		// Execute the prepared query.
		const returnedRows = await executor(queryBuilder) as IReturnedCountRow[]

		// Check if the result contains at least one row.
		if (returnedRows.length === 0) {
			throw new EntityNotFoundError(this.tableName)
		}

		// Return the parsed result of the count query.
		return parseInt(returnedRows[0].count, 10)
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
		this: BaseModel<
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
		filterExpression: IFindFilterItem | IFindFilterItem[],
		options: IExistsOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if ((options.isValidationDisabled === undefined) || !options.isValidationDisabled) {
			this._validateFindFilterExpression(filterExpression)
		}

		// Prepare the query builder for the select operation with a singular limit.
		const queryBuilder = this.selectQueryBuilder(this._transformFindFilterExpression(filterExpression), options)
			.limit(1)

		// Execute the prepared query.
		const returnedRows = await executor(queryBuilder) as object[]

		// Return whether at least one row was returned.
		return returnedRows.length > 0
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
		this: BaseModel<
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
		filterExpression: IModifyFilterItem | IModifyFilterItem[],
		values: IModifyValues,
		options: IModifyOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if ((options.isFilterValidationDisabled === undefined) || !options.isFilterValidationDisabled) {
			this._validateModifyFilterExpression(filterExpression)
		}

		// Optionally validate the submitted modify values.
		if ((options.isValuesValidationDisabled === undefined) || !options.isValuesValidationDisabled) {
			this._validateModifyValues(values)
		}

		// Prepare the query builder for the update operation.
		const queryBuilder = this.updateQueryBuilder(
			this._transformModifyFilterExpression(filterExpression),
			this._transformModifyValues(values), options)

		// Execute the prepared query builder.
		const entities = await executor(queryBuilder) as IEntity[]

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
		this: BaseModel<
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
		filterExpression: IModifyFilterItem | IModifyFilterItem[],
		values: IModifyValues,
		options: IModifyOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return this.connection.transaction(async (transaction) => {
			// Execute the update method with the submitted arguments.
			const entities = await this.modify(filterExpression, values, {
				...options,
				transaction,
			})

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
		this: BaseModel<
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
		filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
		options: IDestroyOptions = {},
	) {
		// Optionally validate the submitted filter expression.
		if ((options.isValidationDisabled === undefined) || !options.isValidationDisabled) {
			this._validateDestroyFilterExpression(filterExpression)
		}

		// Prepare the query builder for the delete operation.
		const queryBuilder = this.deleteQueryBuilder(this._transformDestroyFilterExpression(filterExpression), options)

		// Execute the prepared query.
		const entities = await executor(queryBuilder) as IEntity[]

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
		this: BaseModel<
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
		filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
		options: IDestroyOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return this.connection.transaction(async (transaction) => {
			// Execute the destroy method with the submitted arguments.
			const entities = await this.destroy(filterExpression, {
				...options,
				transaction,
			})

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
		this: BaseModel<
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
		values: ICreateValues[],
	): void

	/**
	 * Defines the transformation of create values to the underlying insert values.
	 * @param this An instance of the BaseModel class.
	 * @param values An array of values used to create the entities.
	 */
	protected abstract _transformCreateValues(
		this: BaseModel<
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
		values: ICreateValues[],
	): IInsertValues[]

	/**
	 * Defines how the find filter expression should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected abstract _validateFindFilterExpression(
		this: BaseModel<
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
		filterExpression: IFindFilterItem | IFindFilterItem[],
	): void

	/**
	 * Defines the transformation of find filter expression to the underlying select filter expression.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected abstract _transformFindFilterExpression(
		this: BaseModel<
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
		filterExpression: IFindFilterItem | IFindFilterItem[],
	): ISelectFilterItem | ISelectFilterItem[]

	/**
	 * Defines how modify filter expression should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected abstract _validateModifyFilterExpression(
		this: BaseModel<
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
		filterExpression: IModifyFilterItem | IModifyFilterItem[],
	): void

	/**
	 * Defines the transformation of modify filter expression to the underlying update filter expression.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected abstract _transformModifyFilterExpression(
		this: BaseModel<
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
		filterExpression: IModifyFilterItem | IModifyFilterItem[],
	): IUpdateFilterItem | IUpdateFilterItem[]

	/**
	 * Defines how modify values should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the BaseModel class.
	 * @param values Values used to modify the matching entities.
	 * @throws ValidationError.
	 */
	protected abstract _validateModifyValues(
		this: BaseModel<
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
		values: IModifyValues,
	): void

	/**
	 * Defines the transformation of modify values to the underlying update values.
	 * @param this An instance of the BaseModel class.
	 * @param values Values used to modify the matching entities.
	 * @throws ValidationError.
	 */
	protected abstract _transformModifyValues(
		this: BaseModel<
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
		values: IModifyValues,
	): IUpdateValues

	/**
	 * Defines how the destroy filter expression should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected abstract _validateDestroyFilterExpression(
		this: BaseModel<
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
		filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
	): void

	/**
	 * Defines the transformation of destroy filter expression to the underlying delete filter expression.
	 * @param this An instance of the BaseModel class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected abstract _transformDestroyFilterExpression(
		this: BaseModel<
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
		filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
	): IDeleteFilterItem | IDeleteFilterItem[]

	/**
	 * Retrieves the first entity from a collection of returned entities.
	 * Verifies whether the entity exists and whether mutliple entities are contained in the collection.
	 * @param this An instance of the BaseModel class.
	 * @param entities Entities retrived by the execution of a query with results.
	 * @throws EntityNotFoundError, MultipleEntitiesFoundError.
	 */
	protected _retrieveOne(
		this: BaseModel<
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
