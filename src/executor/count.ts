// Load app modules.
import EntityNotFoundError from '.../src/error/entity_not_found'

// Load npm modules.
import * as Knex from 'knex'



// Expose the executor function.
export default async (knexQueryBuilder: Knex.QueryBuilder) => {
	// Execute the query builder with a count expression.
	const returnedRows = await knexQueryBuilder.count()




}
