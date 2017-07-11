// Load npm modules.
import * as Knex from 'knex'

/**
 * Alter a foreign constraint to be defferable and initaily deferred.
 * @param knexColumnBuilders A knex column builder defining the foreign constraint to be created.
 */
export default async (knexInstance: Knex, tableName: string, columnName: string) => {
	await knexInstance.raw(`alter table ?? alter constraint ?? deferrable initially deferred`,
		[tableName, `${tableName}_${columnName}_foreign`])
}
