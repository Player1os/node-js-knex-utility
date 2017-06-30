// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

/**
 * Modify the knex query builder to filter its result based on the supplied conjected filter expression item.
 * @param knexQueryBuilder The knex query builder to be augumented.
 * @param filterExpression A filter expression item of conjucted statements.
 */
export default (knexQueryBuilder: Knex.QueryBuilder, filterExpressionItem: object) => {
	// Iterate through each of the conjucted statements.
	lodash.forEach(filterExpressionItem, (value, key) => {
		// Determine whether the statement compares a field to a single value or multiple values.
		if (lodash.isArray(value)) {
			// Check if the passed array of values is empty.
			if (value.length === 0) {
				throw new Error('An empty array has been passed and probably indicates an error in the filter statement.')
			}

			// Determine whether the query requires a negation.
			if (key.charAt(0) === '!') {
				// Add a negated where in statement to the query.
				knexQueryBuilder.whereNotIn(key.substr(1), value as any)
			} else {
				// Add a where in statement to the query.
				knexQueryBuilder.whereIn(key, value as any)
			}
		} else {
			// Check if the passed value is undefined.
			if (value === undefined) {
				throw new Error('An undefined value has been passed and probably indicates an error in the filter statement.')
			}

			// Determine whether the query requires a negation.
			if (key.charAt(0) === '!') {
				// Add a negated where statement to the query.
				knexQueryBuilder.whereNot(key.substr(1), value)
			} else {
				// Add a where statement to the query.
				knexQueryBuilder.where(key, value)
			}
		}
	})

	// Return the modified query builder.
	return knexQueryBuilder
}
