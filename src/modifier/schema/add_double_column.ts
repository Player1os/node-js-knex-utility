// Load npm modules.
import * as Knex from 'knex'

// Expose a function that adds a double column to the current table builder.
export default (knexTableBuilder: Knex.TableBuilder, columnName: string) => {
	(knexTableBuilder as any).double(columnName)
}
