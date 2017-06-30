// Load npm modules.
import * as Knex from 'knex'

/**
 * Modify a knex column builder to alter the column it describes within the schema.
 * @param knexColumnBuilder A knex column builder defining the column to be altered.
 */
export default (knexColumnBuilder: Knex.ColumnBuilder): Knex.ColumnBuilder => {
	return (knexColumnBuilder as any).alter()
}
