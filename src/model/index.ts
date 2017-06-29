// Load app modules.
import connection from '.../src/connection'
import filterExpressionQueryModifier from '.../src/modifier/query/filter_expression'

// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

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
	tableNameAlias?: string,
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
	transaction?: Knex.Transaction,
}
export interface IUpdateOptions {
	returningFields?: string[],
	transaction?: Knex.Transaction,
}
export interface IDeleteOptions {
	returningFields?: string[],
	transaction?: Knex.Transaction,
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
		const knexQueryBuilder = connection.instance(
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

		// Apply the returning query modifier.
		this.returningQueryModifier(queryBuilder, options.returningFields)

		// Return the prepared query builder.
		return queryBuilder.insert(values)
	}

	/**
	 * Find all entities of the model matching the query.
	 * @param this An instance of the model itself.
	 * @param filterExpression The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	public selectQueryBuilder(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		filterExpression: IFilterItemInput | IFilterItemInput[],
		options: ISelectOptions = {},
	) {
		// Prepare an insertion query builder.
		const queryBuilder = this.queryBuilder(options)

		// Optionally use the supplied field name aliases to determine the select clause.
		queryBuilder.select(
			(options.fieldNameAliases)
				? lodash.map(options.fieldNameAliases, (fieldName, fieldAlias) => {
					return (fieldAlias)
						? `${fieldName} as ${fieldAlias}`
						: fieldName
				})
				: this.fieldNames,
		)

		// Apply the filter expression query modifier.
		filterExpressionQueryModifier(queryBuilder, filterExpression)

		// Optionally use the supplied order by parameter to generate an order by clause.
		if (options.orderBy) {
			options.orderBy.forEach((orderByClause) => {
				queryBuilder.orderBy(orderByClause.column, orderByClause.direction)
			})
		}

		// Optionally use the supplied pagination parameter to generate a limit and offset clause.
		if (options.page) {
			queryBuilder
				.limit(options.page.size)
				.offset(options.page.size * (options.page.number - 1))
		}

		// Return the prepared query builder.
		return queryBuilder
	}

	/**
	 * Update all entities of the model matching the query with the supplied values.
	 * @param this An instance of the model itself.
	 * @param query
	 * @param values
	 * @param options Parameters for the underlying query and validation.
	 */
	public updateQueryBuilder(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		filterExpression: IFilterItemInput | IFilterItemInput[],
		values: IUpdateInput,
		options: IUpdateOptions,
	) {
		// Prepare an update query builder.
		const queryBuilder = this.queryBuilder(options)

		// Apply the returning query modifier.
		this.returningQueryModifier(queryBuilder, options.returningFields)

		// Apply the filter expression query modifier.
		filterExpressionQueryModifier(queryBuilder, filterExpression)

		// Return the prepared query builder.
		return queryBuilder.update(values)
	}

	/**
	 * Destroy all entities of the model matching the query.
	 * @param this An instance of the model itself.
	 * @param query The query that describes the where clause to be built.
	 * @param options Parameters for the underlying query and validation.
	 */
	public deleteQueryBuilder(
		this: Model<IInsertInput, IUpdateInput, IFilterItemInput>,
		filterExpression: IFilterItemInput | IFilterItemInput[],
		options: IDeleteOptions = {},
	) {
		// Prepare an update query builder.
		const queryBuilder = this.queryBuilder(options)

		// Apply the returning query modifier.
		this.returningQueryModifier(queryBuilder, options.returningFields)

		// Apply the filter expression query modifier.
		filterExpressionQueryModifier(queryBuilder, filterExpression)

		// Return the prepared query builder.
		return queryBuilder.delete()
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
}
