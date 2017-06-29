// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

/**
 * Prepare a manipulator for a single knex query item.
 * @param this An instance of the model itself.
 * @param knexQuery The knex query builder to be augumented.
 * @param queryItem The query item that describes the where clause addition.
 */
export default (knexQueryBuilder: Knex.QueryBuilder, filterExpressionItem: object) => {
	lodash.forEach(filterExpressionItem, (value, key) => {
		// Determine whether multiple values are to be checked.
		if (lodash.isArray(value)) {
			// Check if the passed array is empty.
			if (value.length === 0) {
				throw new Error('An empty array has been passed.')
			}

			// Determine whether the query requires a negation.
			if (key.charAt(0) === '!') {
				knexQueryBuilder.whereNotIn(key.substr(1), value as any)
			} else {
				knexQueryBuilder.whereIn(key, value as any)
			}
		} else {
			// Check if the passed value is undefined.
			if (value === undefined) {
				throw new Error('An undefined value has been passed.')
			}

			// Determine whether the query requires a negation.
			if (key.charAt(0) === '!') {
				knexQueryBuilder.whereNot(key.substr(1), value)
			} else {
				knexQueryBuilder.where(key, value)
			}
		}
	})

	return knexQueryBuilder
}
