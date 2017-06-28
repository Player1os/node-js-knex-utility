// Load npm modules.
import * as Knex from 'knex'

export default async (knexQueryBuilder: Knex.QueryBuilder) => {
	try {
		// Execute the prepared query builder.
		const entities = await knexQueryBuilder

		// Return the created entities.
		return entities
	} catch (err) {
		// Attempt to better identify the error.
		switch (err.code) {
			case '23505':
				// Encapsulate unique constraint violation in an entity exists error and throw it.
				throw new UniqueConstraintViolationError(err)
				// TODO: Add Encapsulate foreign constraint violation in an entity foreign key missing error and throw it.
			// TODO: Catch error for other issues.
			// 22P02 => invalid input syntax for integer
			default:
				// Rethrow the error.
				throw err
		}
	}
}
