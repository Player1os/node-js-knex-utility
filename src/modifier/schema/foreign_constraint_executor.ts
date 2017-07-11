// Load npm modules.
import * as Knex from 'knex'

/**
 * Execute a collection of knex column builders that already defines a foreign constraint to be defferable.
 * @param knexColumnBuilders A knex column builder defining the foreign constraint to be created.
 */
export default async (knexInstance: Knex, knexColumnBuilders: Knex.ColumnBuilder[]) => {
	return Promise.all(knexColumnBuilders.map((knexColumnBuilder) => {
		return knexInstance.raw(`${knexColumnBuilder.toString()} deferrable initially deferred`)
	}))
}
