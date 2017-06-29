// Load app modules.
import connection from '.../src/connection'
import MultipleRowsFoundError from '.../src/error/multiple_rows_found'
import RowNotFoundError from '.../src/error/row_not_found'

// Load npm modules.
import * as Knex from 'knex'

// Expose the executor function.
export default async (knexQueryBuilder: Knex.QueryBuilder, transaction?: Knex.Transaction) => {
	// Enclose in a transaction to ensure changes are reverted if an error is thrown from within and return its result.
	return connection.transaction(async (trx) => {
		// Execute the query builder within the given transaction.
		const returnedRows = await knexQueryBuilder.transacting(trx) as object[]

		// Check if at least one row was returned.
		if (returnedRows.length === 0) {
			throw new RowNotFoundError()
		}

		// Check if more than one row was returned.
		if (returnedRows.length > 1) {
			throw new MultipleRowsFoundError()
		}

		// Return the first returned row.
		return returnedRows[0]
	}, transaction)
}
