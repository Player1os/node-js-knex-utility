// Load local modules.
import EntityNotFoundError from '.../src/error/entity_not_found'
import MultipleEntitiesFoundError from '.../src/error/multiple_entities_found'
import {
	CreateEventEmitter,
	ICreateEventEmitter,
} from '.../src/event_emitter/create'
import {
	DestroyEventEmitter,
	IDestroyEventEmitter,
} from '.../src/event_emitter/destroy'
import {
	FindEventEmitter,
	IFindEventEmitter,
} from '.../src/event_emitter/find'
import {
	IModifyEventEmitter,
	ModifyEventEmitter,
} from '.../src/event_emitter/modify'
import executor from '.../src/executor'
import { Model } from '.../src/model'
import {
	ICountOptions,
	ICreateOptions,
	IDestroyOptions,
	IExistsOptions,
	IFindOptions,
	IModifyOptions,
} from '.../src/options/base'

// Define interface for the returned count row.
export interface IReturnedCountRow {
	count: string,
}

// Expose the base model class.
export class BaseModel<
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
	 * The event emitter for create methods.
	 */
	protected readonly createEvents: ICreateEventEmitter<IEntity, ICreateValues>
		= new CreateEventEmitter<IEntity, ICreateValues>()
	/**
	 * The event emitter for find methods.
	 */
	protected readonly findEvents: IFindEventEmitter<IEntity, IFindFilterItem>
		= new FindEventEmitter<IEntity, IFindFilterItem>()
	/**
	 * The event emitter for modify methods.
	 */
	protected readonly modifyEvents: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>
		= new ModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>()
	/**
	 * The event emitter for destroy methods.
	 */
	protected readonly destroyEvents: IDestroyEventEmitter<IEntity, IDestroyFilterItem>
		= new DestroyEventEmitter<IEntity, IDestroyFilterItem>()

	/**
	 * Create multiple entities of the model, using the provided array of values.
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the class.
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
		// Emit the before validation event.
		await this.createEvents.emitAsync('beforeValidation', {
			values,
			options,
		})

		// Validate the submitted create values.
		this.validateCreateValues(values)

		// Prepare the query builder for the insert operation.
		const queryBuilder = this.insertQueryBuilder(this.transformCreateValues(values), options)

		// Emit the after validation event.
		await this.createEvents.emitAsync('afterValidation', {
			queryBuilder,
			values,
			options,
		})

		// Determine if a transaction is required.
		const entities = await (this.createEvents.hasExecuteListener()
			? this.connection.transaction(async (transaction) => {
				// Emit the before execute event.
				await this.createEvents.emitAsync('beforeExecute', {
					transaction,
					queryBuilder,
					values,
					options,
				})

				// Execute the prepared query builder.
				const result = await executor(queryBuilder) as IEntity[]

				// Emit the after execute event.
				await this.createEvents.emitAsync('afterExecute', {
					transaction,
					entities: result,
					values,
					options,
				})

				// Return the query result.
				return result
			}, options.transaction)
			// Execute the prepared query builder.
			: executor(queryBuilder) as Promise<IEntity[]>)

		// Emit the before return event.
		await this.createEvents.emitAsync('beforeReturn', {
			entities,
			values,
			options,
		})

		// Return the created entities.
		return entities
	}

	/**
	 * Create a single entity of the model, using the provided values.
	 * If none or more than one entity is created, an error is thrown.
	 * @param this An instance of the class.
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
	 * @param this An instance of the class.
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
		// Emit the before validation event.
		await this.findEvents.emitAsync('beforeValidation', {
			filterExpression,
			options,
		})

		// Validate the submitted filter expression.
		this.validateFindFilterExpression(filterExpression)

		// Prepare the query builder for the select operation.
		const queryBuilder = this.selectQueryBuilder(this.transformFindFilterExpression(filterExpression), options)

		// Emit the after validation event.
		await this.findEvents.emitAsync('afterValidation', {
			queryBuilder,
			filterExpression,
			options,
		})

		// Determine if a transaction is required.
		const entities = await (this.findEvents.hasExecuteListener()
			? this.connection.transaction(async (transaction) => {
				// Emit the before execute event.
				await this.findEvents.emitAsync('beforeExecute', {
					transaction,
					queryBuilder,
					filterExpression,
					options,
				})

				// Execute the prepared query builder.
				const result = await executor(queryBuilder) as IEntity[]

				// Emit the after execute event.
				await this.findEvents.emitAsync('afterExecute', {
					transaction,
					entities: result,
					filterExpression,
					options,
				})

				// Return the query result.
				return result
			}, options.transaction)
			// Execute the prepared query builder.
			: executor(queryBuilder) as Promise<IEntity[]>)

		// Emit the before return event.
		await this.findEvents.emitAsync('beforeReturn', {
			entities,
			filterExpression,
			options,
		})

		// Return the found entities.
		return entities
	}

	/**
	 * Find a single entity of the model, matching the provided filter expression.
	 * @param this An instance of the class.
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
	 * @param this An instance of the class.
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
		// Validate the submitted filter expression.
		this.validateFindFilterExpression(filterExpression)

		// Prepare the query builder for the select operation with a count.
		const queryBuilder = this.selectQueryBuilder(this.transformFindFilterExpression(filterExpression), options)
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
	 * @param this An instance of the class.
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
		// Validate the submitted filter expression.
		this.validateFindFilterExpression(filterExpression)

		// Prepare the query builder for the select operation with a singular limit.
		const queryBuilder = this.selectQueryBuilder(this.transformFindFilterExpression(filterExpression), options)
			.limit(1)

		// Execute the prepared query.
		const returnedRows = await executor(queryBuilder) as object[]

		// Return whether at least one row was returned.
		return returnedRows.length > 0
	}

	/**
	 * Modify multiple entities of the model, matching the submitted filter expression, with the supplied values.
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the class.
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
		// Emit the before validation event.
		await this.modifyEvents.emitAsync('beforeValidation', {
			filterExpression,
			values,
			options,
		})

		// Validate the submitted filter expression.
		this.validateModifyFilterExpression(filterExpression)

		// Validate the submitted modify values.
		this.validateModifyValues(values)

		// Prepare the query builder for the update operation.
		const queryBuilder = this.updateQueryBuilder(
			this.transformModifyFilterExpression(filterExpression),
			this.transformModifyValues(values), options)

		// Emit the after validation event.
		await this.modifyEvents.emitAsync('afterValidation', {
			queryBuilder,
			filterExpression,
			values,
			options,
		})

		// Determine if a transaction is required.
		const entities = await (this.modifyEvents.hasExecuteListener()
			? this.connection.transaction(async (transaction) => {
				// Emit the before execute event.
				await this.modifyEvents.emitAsync('beforeExecute', {
					transaction,
					queryBuilder,
					filterExpression,
					values,
					options,
				})

				// Execute the prepared query builder.
				const result = await executor(queryBuilder) as IEntity[]

				// Emit the after execute event.
				await this.modifyEvents.emitAsync('afterExecute', {
					transaction,
					entities: result,
					filterExpression,
					values,
					options,
				})

				// Return the query result.
				return result
			}, options.transaction)
			// Execute the prepared query builder.
			: executor(queryBuilder) as Promise<IEntity[]>)

		// Emit the before return event.
		await this.modifyEvents.emitAsync('beforeReturn', {
			entities,
			filterExpression,
			values,
			options,
		})

		// Return the modified entities.
		return entities
	}

	/**
	 * Modify a single entity of the model, matching the submitted filter expression, with the supplied values.
	 * @param this An instance of the class.
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

			// Return the modified entity.
			return this._retrieveOne(entities)
		}, options.transaction)
	}

	/**
	 * Destroy multiple entities of the model, matching the submitted filter expression.
	 * This is a simplified default implementation that validates the inputs and sends them directly to the database.
	 * @param this An instance of the class.
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
		// Emit the before validation event.
		await this.destroyEvents.emitAsync('beforeValidation', {
			filterExpression,
			options,
		})

		// Validate the submitted filter expression.
		this.validateDestroyFilterExpression(filterExpression)

		// Prepare the query builder for the delete operation.
		const queryBuilder = this.deleteQueryBuilder(this.transformDestroyFilterExpression(filterExpression), options)

		// Emit the after validation event.
		await this.destroyEvents.emitAsync('afterValidation', {
			queryBuilder,
			filterExpression,
			options,
		})

		// Determine if a transaction is required.
		const entities = await (this.destroyEvents.hasExecuteListener()
			? this.connection.transaction(async (transaction) => {
				// Emit the before execute event.
				await this.destroyEvents.emitAsync('beforeExecute', {
					transaction,
					queryBuilder,
					filterExpression,
					options,
				})

				// Execute the prepared query builder.
				const result = await executor(queryBuilder) as IEntity[]

				// Emit the after execute event.
				await this.destroyEvents.emitAsync('afterExecute', {
					transaction,
					entities: result,
					filterExpression,
					options,
				})

				// Return the query result.
				return result
			}, options.transaction)
			// Execute the prepared query builder.
			: executor(queryBuilder) as Promise<IEntity[]>)

		// Emit the before return event.
		await this.destroyEvents.emitAsync('beforeReturn', {
			entities,
			filterExpression,
			options,
		})

		// Return the destroyed entities.
		return entities
	}

	/**
	 * Destroy a single entity of the model, matching the submitted filter expression.
	 * @param this An instance of the class.
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
	 * @param this An instance of the class.
	 * @param values An array of values used to create the entities.
	 * @throws ValidationError.
	 */
	protected validateCreateValues(
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
		_values: ICreateValues[],
	) {
		throw new Error('An unsupported method has been called.')
	}

	/**
	 * Defines the transformation of create values to the underlying insert values.
	 * @param this An instance of the class.
	 * @param values An array of values used to create the entities.
	 */
	protected transformCreateValues(
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
	) {
		return values as any as IInsertValues[]
	}

	/**
	 * Defines how the find filter expression should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected validateFindFilterExpression(
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
		_filterExpression: IFindFilterItem | IFindFilterItem[],
	)  {
		throw new Error('An unsupported method has been called.')
	}

	/**
	 * Defines the transformation of find filter expression to the underlying select filter expression.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected transformFindFilterExpression(
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
	) {
		return filterExpression as any as ISelectFilterItem | ISelectFilterItem[]
	}

	/**
	 * Defines how modify filter expression should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected validateModifyFilterExpression(
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
		_filterExpression: IModifyFilterItem | IModifyFilterItem[],
	) {
		throw new Error('An unsupported method has been called.')
	}

	/**
	 * Defines the transformation of modify filter expression to the underlying update filter expression.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected transformModifyFilterExpression(
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
	) {
		return filterExpression as any as IUpdateFilterItem | IUpdateFilterItem[]
	}

	/**
	 * Defines how modify values should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the class.
	 * @param values Values used to modify the matching entities.
	 * @throws ValidationError.
	 */
	protected validateModifyValues(
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
		_values: IModifyValues,
	) {
		throw new Error('An unsupported method has been called.')
	}

	/**
	 * Defines the transformation of modify values to the underlying update values.
	 * @param this An instance of the class.
	 * @param values Values used to modify the matching entities.
	 * @throws ValidationError.
	 */
	protected transformModifyValues(
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
	) {
		return values as any as IUpdateValues
	}

	/**
	 * Defines how the destroy filter expression should be validated.
	 * Throws an error if the inputs are invalid, otherwise does nothing.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected validateDestroyFilterExpression(
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
		_filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
	)  {
		throw new Error('An unsupported method has been called.')
	}

	/**
	 * Defines the transformation of destroy filter expression to the underlying delete filter expression.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @throws ValidationError.
	 */
	protected transformDestroyFilterExpression(
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
	) {
		return filterExpression as any as IDeleteFilterItem | IDeleteFilterItem[]
	}

	/**
	 * Retrieves the first entity from a collection of returned entities.
	 * Verifies whether the entity exists and whether mutliple entities are contained in the collection.
	 * @param this An instance of the class.
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
