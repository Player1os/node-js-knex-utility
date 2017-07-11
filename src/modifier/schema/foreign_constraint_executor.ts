// Load npm modules.
import * as Knex from 'knex'

/**
 * Execute a collection of knex column builders that already defines a foreign constraint to be defferable.
 * @param knexColumnBuilders A knex column builder defining the foreign constraint to be created.
 */
export default class ForeignKeyExecutor {
	private _alterQueries: string[] = []

	public add(knexColumnBuilder: Knex.ColumnBuilder) {
		this._alterQueries.push(`${knexColumnBuilder.toString()} deferrable initially deferred`)
	}

	async execute(knexInstance: Knex) {
		await knexInstance.raw(this._alterQueries.join(';'))
		this._alterQueries = []
	}
}
