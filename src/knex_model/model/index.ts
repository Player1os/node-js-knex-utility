// Load app modules.
import EntityExistsError from '.../src/error/entity_exists'
import EntityNotFoundError from '.../src/error/entity_not_found'
import MultipleEntitiesFoundError from '.../src/error/multiple_entities_found'

// Load scoped modules.
import knexWrapper from '@player1os/knex-wrapper'

// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

// TODO: Enable the use of a raw where caluse.
// TODO: Add pagination.
// TODO: Add relations.
// TODO: Add column aliasing.

// Declare and expose the interfaces for options.
export interface IOptions {
	tableNameAlias?: string,
	transaction?: Knex.Transaction,
}
export interface IReturningOptions extends IOptions {
	returningFields?: string[],
}
export interface IInsertOptions {
	returningFields?: string[],
	transaction?: Knex.Transaction,
}
export interface ISelectOptions extends IOptions {
	fieldNameAliases?: {
		[key: string]: string,
	},
	orderBy?: [{
		column: string,
		direction: string,
	}],
	page?: {
		size: number,
		number: number,
	},
}
export interface IUpdateOptions {
}
export interface IDeleteOptions {

}


// Expose the base model class.
export abstract class Model<IInsertInput extends object, IUpdateInput extends object, IFilterItemInput extends object> {
	/**
	 * A constructor that confirms that the required properties are present.
	 * @param tableName The name of the underlying table.
	 * @param fieldNames The names of the underlying table's fields.
	 */
	constructor(
		public readonly tableName: string,
		public readonly fieldNames: string[],
	) {
		// Verify whether the table name is non-empty.
		if (!this.tableName) {
			throw new Error('The table name is empty.')
		}
	}

	/**
	 * Prepares a general query upon the table.
	 * @param this
	 * @param options
	 */
	public queryBuilder(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		options: IOptions = {},
	) {
		//
		const knexQueryBuilder = knexWrapper.instance(
			(options.tableNameAlias)
			? `${this.tableName} as ${options.tableNameAlias}`
			: this.tableName,
		)

		// Optionally use the supplied transaction.
		if (options.transaction) {
			knexQueryBuilder.transacting(options.transaction)
		}

		// Return the created query builder.
		return knexQueryBuilder
	}

	/**
	 *
	 * @param this
	 * @param options
	 */
	protected returningQueryModifier(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		knexQueryBuilder: Knex.QueryBuilder,
		returningFields?: string[],
	) {
		// Optionally enable the returning of created rows.
		if (!returningFields) {
			knexQueryBuilder.returning(this.fieldNames)
		} else if (!lodash.isEmpty(returningFields)) {
			knexQueryBuilder.returning(returningFields)
		}

		//
		return knexQueryBuilder
	}

	/**
	 * Create entities of the model using the provided values.
	 * @param this An instance of the model itself.
	 * @param values The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	public insertQueryBuilder(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		values: IInsertInput | IInsertInput[],
		options: IInsertOptions = {},
	) {
		// Prepare an insertion query builder.
		const queryBuilder = this.queryBuilder(options)

		this.returningQueryModifier(queryBuilder, options.returningFields)

		return queryBuilder.insert(values)
	}

	/**
	 *
	 * @param this An instance of the model itself.
	 * @param query
	 * @param values
	 * @param options Parameters for the underlying query and validation.
	 */
	public updateQueryBuilder(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
		values: IUpdateInput,
		options: IUpdateOptions,
	) {

	}

	/**
	 * Update a single entity of the model matching the query with the supplied values.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 * @param values
	 * @param options Parameters for the underlying query and validation.
	 */
	public async updateOne(
		this: Model<IEntity, IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
		values: IUpdateInput,
		options: IUpdateOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return this._knexWrapper.transaction(async (transaction) => {
			// Execute the update method with the submitted arguments.
			const entities = await this.update(query, values, Object.assign({}, options, {
				transaction,
			}))

			// Check if at least one value was updated.
			if (entities.length === 0) {
				throw new EntityNotFoundError()
			}

			// Check if more than one value was updated.
			if (entities.length > 1) {
				throw new MultipleEntitiesFoundError()
			}

			// Return the updated entity.
			return entities[0]
		}, options.transaction)
	}

	/**
	 *
	 * @param this An instance of the model itself.
	 * @param values
	 * @param options Parameters for the underlying query and validation.
	 */
	public abstract async destroy(
		this: Model<IEntity, IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
		options: IDestroyOptions,
	)

	/**
	 * Destroy a single entity of the model matching the query.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	protected async destroyOne(
		this: Model<IEntity, IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
		options: IDestroyOptions = {},
	) {
		// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
		return this._knexWrapper.transaction(async (transaction) => {
			// Execute the destroy method with the submitted arguments.
			const entities = await this.destroy(query, Object.assign({}, options, {
				transaction,
			}))

			// Check if at least one value was deleted.
			if (entities.length === 0) {
				throw new EntityNotFoundError()
			}

			// Check if more than one value was deleted.
			if (entities.length > 1) {
				throw new MultipleEntitiesFoundError()
			}

			// Return the destroyed entity.
			return entities[0]
		}, options.transaction)
	}



	/**
	 * Find all entities of the model matching the query.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	protected _find(
		this: Model<IEntity, IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
		options: ISelectOptions = {},
	) {
		// Prepare a selection query builder.
		let knexQueryBuilder = this._prepareQueryParameters(query)
			.select(this.fieldNames)

		// Add the optional order by clause.
		if (options.orderBy) {
			options.orderBy.forEach((orderByClause) => {
				knexQueryBuilder = knexQueryBuilder.orderBy(orderByClause.column, orderByClause.direction)
			})
		}

		// Add the optional limit clause.
		if (options.limit) {
			knexQueryBuilder = knexQueryBuilder.limit(options.limit)
		}

		// Add the optional offset clause.
		if (options.offset) {
			knexQueryBuilder = knexQueryBuilder.offset(options.offset)
		}

		// Optionally use the supplied transaction.
		if (options.transaction) {
			knexQueryBuilder = knexQueryBuilder.transacting(options.transaction)
		}

		// Return the prepared query builder.
		return knexQueryBuilder
	}

	/**
	 * Find the count of all entities of the model matching the query.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	protected async _count(
		this: Model<IEntity, IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
		options: ICountOptions = {},
	) {
		// Prepare a selection query builder.
		let knexQuery = this._prepareQueryParameters(query)
			.count()

		// Optionally use the supplied transaction.
		if (options.transaction) {
			knexQuery = knexQuery.transacting(options.transaction)
		}

		// Execute the prepared query builder.
		const result = await (knexQuery as PromiseLike<any>)

		// Parse the result of the count query.
		return parseInt(result[0].count, 10)
	}

	/**
	 * Update all entities of the model matching the query with the supplied values.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 * @param values
	 * @param options Parameters for the underlying query and validation.
	 */
	protected async _update(
		this: Model<IEntity, IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
		values: IUpdateInput,
		options: IReturningOptions = {},
	) {
		// Prepare an update query builder.
		let knexQuery = this._prepareQueryParameters(query)
			.update(values)

		// Optionally enable the returning of created entities.
		if (options.isReturningFields) {
			knexQuery = knexQuery.returning(this.fieldNames)
		}

		// Optionally use the supplied transaction.
		if (options.transaction) {
			knexQuery = knexQuery.transacting(options.transaction)
		}

		// Return the prepared query builder.
		const entities = await (knexQuery as PromiseLike<any>) as IEntity[]

		// Return the updated entities.
		return entities
	}

	/**
	 * Destroy all entities of the model matching the query.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	protected async _destroy(
		this: Model<IEntity, IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
		options: IReturningOptions = {},
	) {
		// Prepare a deletion query builder.
		let knexQuery = this._prepareQueryParameters(query)
			.delete()

		// Optionally enable the returning of created entities.
		if (options.isReturningEnabled) {
			knexQuery = knexQuery.returning(this.fieldNames)
		}

		// Optionally use the supplied transaction.
		if (options.transaction) {
			knexQuery = knexQuery.transacting(options.transaction)
		}

		// Return the prepared query builder.
		const entities = await (knexQuery as PromiseLike<any>) as IEntity[]

		// Return the destroyed entities.
		return entities
	}

	/**
	 * Prepare a manipulator for a single knex query item.
	 * @param this An instance of the model itself.
	 * @param knexQuery The knex query builder to be augumented.
	 * @param queryItem The query item that describes the where clause addition.
	 */
	protected _prepareQueryItemParamters(
		this: Model<IEntity, IInsertInput, IUpdateInput, IFilterItemInput>,
		knexQuery: Knex.QueryBuilder,
		queryItem: IFilterItemInput,
	) {
		let newKnexQuery = knexQuery

		lodash.forEach(queryItem, (value, key) => {
			// Determine whether multiple values are to be checked.
			if (lodash.isArray(value)) {
				// Check if the passed array is empty.
				if (value.length === 0) {
					throw new Error('An empty array has been passed.')
				}

				// Determine whether the query requires a negation.
				if (key.charAt(0) === '!') {
					newKnexQuery = newKnexQuery.whereNotIn(key.substr(1), value as any)
				} else {
					newKnexQuery = newKnexQuery.whereIn(key, value as any)
				}
			} else {
				// Check if the passed value is undefined.
				if (value === undefined) {
					throw new Error('An undefined value has been passed.')
				}

				// Determine whether the query requires a negation.
				if (key.charAt(0) === '!') {
					newKnexQuery = newKnexQuery.whereNot(key.substr(1), value)
				} else {
					newKnexQuery = newKnexQuery.where(key, value)
				}
			}
		})

		return newKnexQuery
	}

	/**
	 * Prepare a pluggable knex query based on the query parameters.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 */
	protected _prepareQueryParameters(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		query: IFilterItemInput | IFilterItemInput[],
	) {
		// Define the initial query builder upon the model's table.
		let knexQuery = this._knexWrapper.instance(this.tableName)

		// Add filters using the submitted query.
		if (lodash.isArray(query)) {
			query.forEach((queryItem) => {
				knexQuery = knexQuery.orWhere((whereQuery) => {
					this._prepareQueryItemParamters(whereQuery, queryItem)
				})
			})
		} else {
			knexQuery = this._prepareQueryItemParamters(knexQuery, query)
		}

		// Return the prepared query builder.
		return knexQuery
	}

	/**
	 *
	 * @param this
	 * @param knexQueryBuilder
	 * @param column
	 * @param foreignColumn
	 * @param tableNameAlias
	 */
	public joinQueryModifier(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		knexQueryBuilder: Knex.QueryBuilder,
		column: string,
		foreignColumn: string,
		tableNameAlias?: string,
	) {
		return knexQueryBuilder.join(
			(tableNameAlias)
				? `${this.tableName} as ${tableNameAlias}`
				: this.tableName,
			column, foreignColumn)
	}
}
