// Load app modules.
import filterExpressionItemQueryModifier from '.../src/modifier/query/filter_expression_item'

// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

/**
 * Prepare a pluggable knex query based on the query parameters.
 * @param this An instance of the model itself.
 * @param query The query that describes the where clause to be built.
 */
export default (knexQueryBuilder: Knex.QueryBuilder, filterExpression: object | object[]) => {
	// Add filters using the submitted query.
	if (lodash.isArray(filterExpression)) {
		filterExpression.forEach((queryItem) => {
			knexQueryBuilder.orWhere((whereQuery) => {
				filterExpressionItemQueryModifier(whereQuery, queryItem)
			})
		})
	} else {
		filterExpressionItemQueryModifier(knexQueryBuilder, filterExpression)
	}

	// Return the prepared query builder.
	return knexQueryBuilder
}
