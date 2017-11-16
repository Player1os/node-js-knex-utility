// Load local modules.
import { Connection } from '.../src/connection'
import EmptyValuesError from '.../src/error/empty_values'
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
	isEmptyValuesVerificationDisabled?: boolean,
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
	isEmptyValuesVerificationDisabled?: boolean,
	returningFields?: string[],
	transaction?: Knex.Transaction,
}
export interface IDeleteOptions {
	returningFields?: string[],
	transaction?: Knex.Transaction,
}

// Expose the base model class.
export class Model<
	IInsertValues extends object,
	ISelectFilterItem extends object,
	IUpdateFilterItem extends object,
	IUpdateValues extends object,
	IDeleteFilterItem extends object
> { // tslint:disable-line:one-line
	/**
	 * Creates an instance of the model and confirms the presence and validity of the supplied parameters.
	 * @param tableName The name of the underlying table.
	 * @param fieldNames The names of the underlying table's fields.
	 */
	public constructor(
		protected readonly connection: Connection,
		protected readonly tableName: string,
		protected readonly fieldNames: string[],
	) {
		// Verify whether the table name is non-empty.
		if (this.tableName === '') {
			throw new Error('The table name is empty.')
		}
	}

	/**
	 * Modifies the query builder to add a join clause upon the model's table.
	 * @param this An instance of the class.
	 * @param knexQueryBuilder A query builder to be modified.
	 * @param column The name of the table's column to be matched in the join expression.
	 * @param foreignColumn The name of the foreign column to be matched in the join expression.
	 * @param tableNameAlias An optional alias of the model's table to be joined.
	 */
	public joinQueryModifier(
		this: Model<IInsertValues, ISelectFilterItem, IUpdateFilterItem, IUpdateValues, IDeleteFilterItem>,
		knexQueryBuilder: Knex.QueryBuilder,
		column: string,
		foreignColumn: string,
		tableNameAlias?: string,
	) {
		return knexQueryBuilder.join(
			(tableNameAlias === undefined) || (tableNameAlias === '')
				? this.tableName
				: `${this.tableName} as ${tableNameAlias}`,
			column, foreignColumn)
	}

	/**
	 * Creates a general query builder upon the model's table.
	 * @param this An instance of the class.
	 * @param options A set of options that determine how the query should be executed.
	 */
	protected queryBuilder(
		this: Model<IInsertValues, ISelectFilterItem, IUpdateFilterItem, IUpdateValues, IDeleteFilterItem>,
		options: IOptions = {},
	) {
		// Initialize the query builder, may optionally contain an alias for the model's table.
		const knexQueryBuilder = this.connection.instance(
			(options.tableNameAlias === undefined)
			? this.tableName
			: `${this.tableName} as ${options.tableNameAlias}`,
		)

		// Optionally use the supplied transaction.
		if (options.transaction !== undefined) {
			knexQueryBuilder.transacting(options.transaction)
		}

		// Return the created query builder.
		return knexQueryBuilder
	}

	/**
	 * Modifies the query builder by adding a returning clause. Allows the specification of the individual fields to be returned.
	 * @param this An instance of the class.
	 * @param options A set of options that determine how the query should be executed.
	 */
	protected returningQueryModifier(
		this: Model<IInsertValues, ISelectFilterItem, IUpdateFilterItem, IUpdateValues, IDeleteFilterItem>,
		knexQueryBuilder: Knex.QueryBuilder,
		returningFields?: string[],
	) {
		// Optionally enable the returning of created rows.
		if (returningFields === undefined) {
			knexQueryBuilder.returning(this.fieldNames)
		} else if (!lodash.isEmpty(returningFields)) {
			knexQueryBuilder.returning(returningFields)
		}

		// Return the modified query builder.
		return knexQueryBuilder
	}

	/**
	 * Prepare an insert qeury upon the model's table, using the provided values.
	 * @param this An instance of the class.
	 * @param values An array of values to be inserted.
	 * @param options A set of options that determine how the query should be executed.
	 * @throws EmptyValuesError.
	 */
	protected insertQueryBuilder(
		this: Model<IInsertValues, ISelectFilterItem, IUpdateFilterItem, IUpdateValues, IDeleteFilterItem>,
		values: IInsertValues[],
		options: IInsertOptions = {},
	) {
		// Optionally verify that the submitted values are not empty.
		if ((options.isEmptyValuesVerificationDisabled === undefined) || !options.isEmptyValuesVerificationDisabled) {
			if (lodash.isEmpty(values)) {
				throw new EmptyValuesError()
			}
			values.forEach((valuesEntry) => {
				if (lodash.isEmpty(valuesEntry)) {
					throw new EmptyValuesError()
				}
			})
		}

		// Prepare a query builder.
		const queryBuilder = this.queryBuilder(options)

		// Apply the returning query modifier.
		this.returningQueryModifier(queryBuilder, options.returningFields)

		// Return the prepared query builder.
		return queryBuilder.insert(values)
	}

	/**
	 * Prepare a select query upon the model's table, using the filter expression.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options A set of options that determine how the query should be executed.
	 */
	protected selectQueryBuilder(
		this: Model<IInsertValues, ISelectFilterItem, IUpdateFilterItem, IUpdateValues, IDeleteFilterItem>,
		filterExpression: ISelectFilterItem | ISelectFilterItem[],
		options: ISelectOptions = {},
	) {
		// Prepare a query builder.
		const queryBuilder = this.queryBuilder(options)

		// Optionally use the supplied field name aliases to fill the select clause.
		queryBuilder.select(
			options.fieldNameAliases === undefined
				? this.fieldNames
				: lodash.map(options.fieldNameAliases, (fieldName, fieldAlias) => {
					return fieldAlias === ''
						? fieldName
						: `${fieldName} as ${fieldAlias}`
				}),
		)

		// Apply the filter expression query modifier.
		filterExpressionQueryModifier(queryBuilder, filterExpression)

		// Optionally use the supplied order by parameter to generate an order by clause.
		if (options.orderBy !== undefined) {
			options.orderBy.forEach((orderByClause) => {
				queryBuilder.orderBy(orderByClause.column, orderByClause.direction)
			})
		}

		// Optionally use the supplied pagination parameter to generate a limit and offset clause.
		if (options.page !== undefined) {
			queryBuilder
				.limit(options.page.size)
				.offset(options.page.size * (options.page.number - 1))
		}

		// Return the prepared query builder.
		return queryBuilder
	}

	/**
	 * Prepare an update query builder upon the model's table, using the filter expression and values.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param values Values to be set and updated.
	 * @param options A set of options that determine how the query should be executed.
	 * @throws EmptyValuesError.
	 */
	protected updateQueryBuilder(
		this: Model<IInsertValues, ISelectFilterItem, IUpdateFilterItem, IUpdateValues, IDeleteFilterItem>,
		filterExpression: IUpdateFilterItem | IUpdateFilterItem[],
		values: IUpdateValues,
		options: IUpdateOptions,
	) {
		// Optionally verify that the submitted values are not empty.
		if ((options.isEmptyValuesVerificationDisabled === undefined) || !options.isEmptyValuesVerificationDisabled) {
			if (lodash.isEmpty(values)) {
				throw new EmptyValuesError()
			}
		}

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
	 * Prepare a delete query builder upon the model's table, using the filter expression.
	 * @param this An instance of the class.
	 * @param filterExpression A filter expression used to build the query and specify the results.
	 * @param options Parameters for the underlying query and validation.
	 */
	protected deleteQueryBuilder(
		this: Model<IInsertValues, ISelectFilterItem, IUpdateFilterItem, IUpdateValues, IDeleteFilterItem>,
		filterExpression: IDeleteFilterItem | IDeleteFilterItem[],
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
}
