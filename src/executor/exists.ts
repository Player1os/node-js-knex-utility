// Load npm modules.
import * as Knex from 'knex'

// Expose the executor function.
export default async (knexQueryBuilder: Knex.QueryBuilder) => {
	// Execute the query builder with a limit.
	const returnedRows = await knexQueryBuilder.limit(1) as object[]

	// Return whether at least one row was returned.
	return returnedRows.length > 0
}
