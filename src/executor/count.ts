// Load npm modules.
import * as Knex from 'knex'

// Define interface for the returned count row.
interface IReturnedCountRow {
	count: string,
}

// Expose the executor function.
export default async (knexQueryBuilder: Knex.QueryBuilder) => {
	// Execute the query builder.
	const returnedRows = await knexQueryBuilder as IReturnedCountRow[]

	// Return the parsed result of the count query.
	return parseInt(returnedRows[0].count, 10)
}
