// Load app modules.
import UniqueConstraintViolationError from '.../src/error/unique_constraint_violation'

// Load npm modules.
import * as Knex from 'knex'

/**
 * Attempts to execute the query described by a query builder and attempts to classify any known errors.
 * @param knexQueryBuilder A query builder to be executed.
 */
export default async (knexQueryBuilder: Knex.QueryBuilder) => {
	try {
		// Execute the query builder.
		const returnedRows = await knexQueryBuilder as object[]

		// Return the modified rows.
		return returnedRows
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
