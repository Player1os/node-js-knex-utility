// Load npm modules.
import * as Knex from 'knex'

/**
 * Modify a knex column builder that already defines a foreign constraint to be defferable.
 * @param knexColumnBuilder A knex column builder defining the foreign constraint to be created.
 */
export default (knexColumnBuilder: Knex.ColumnBuilder) => {
	return `${knexColumnBuilder.toString()} deferrable initially deferred`
}
