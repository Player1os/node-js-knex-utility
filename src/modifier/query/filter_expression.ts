// Load app modules.
import filterExpressionItemQueryModifier from '.../src/modifier/query/filter_expression_item'

// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

/**
 * Modify the knex query builder to filter its result based on the supplied disjuncted filter expression.
 * @param knexQueryBuilder An knex query builder to be modified.
 * @param filterExpression A disjuncted filter expression of conjucted items.
 */
export default (knexQueryBuilder: Knex.QueryBuilder, filterExpression: object | object[]) => {
	// Determine whether the filter expression is singular conjuction or contains mutiple conjunction filter items.
	if (lodash.isArray(filterExpression)) {
		// Process each of the filter items as a disjunction of conjucted expressions.
		filterExpression.forEach((queryItem) => {
			knexQueryBuilder.orWhere((whereQuery) => {
				filterExpressionItemQueryModifier(whereQuery, queryItem)
			})
		})
	} else {
		// Process the singular filter item as a conjucted expression.
		filterExpressionItemQueryModifier(knexQueryBuilder, filterExpression)
	}

	// Return the modified query builder.
	return knexQueryBuilder
}
