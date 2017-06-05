// Load scoped modules.
import config from '@player1os/config'

// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

// Load node modules.
import * as path from 'path'

// Load the project's knex configuration.
const knexConfig = __non_webpack_require__(path.join(config.APP_ROOT_PATH, 'knexFile.js'))

// Define the helper class.
// TODO: Use type definition for this and the double column.
class KnexWrapperHelper {
	alterColumn(columnBuilder: Knex.ColumnBuilder): Knex.ColumnBuilder {
		return (columnBuilder as any).alter()
	}
}

// Expose an instace of the helper.
export const helper = new KnexWrapperHelper()

// Expose the knex connection wrapper.
export default {
	// Define the is connected flag.
	isConnected: false,
	// Define the knex instance.
	instance: Knex({
		client: knexConfig.client,
	}),
	// Define the connection semaphore.
	semaphore: 0,
	// Connect to the database through knex.
	async connect() {
		// Defermine whether a connection has already been established.
		if (this.semaphore === 0) {
			// Create the knex instance based on the config.
			this.instance = Knex(knexConfig)
			this.isConnected = true
		}

		// Increment semaphore.
		(++this.semaphore)

		// Return the connection parameters.
		return lodash.clone(knexConfig.connection) || {}
	},
	// Disconnect from the database through knex.
	async disconnect() {
		// Determine if the disconnect method was used incorrectly.
		if (this.semaphore === 0) {
			throw new Error('Disconnect invoked before connect.')
		}

		// Decrement semaphore.
		(--this.semaphore)

		// Do nothing if the connect method wasn't called a sufficient number of times.
		if (this.semaphore > 0) {
			return
		}

		// Perform the actual disconnecting.
		await this.instance.destroy()

		// Reset the knex instance.
		this.instance = Knex({
			client: knexConfig.client,
		})
		this.isConnected = false
	},
	outputSqlString(inputs: Knex.QueryBuilder | Knex.QueryBuilder[] | Knex.SchemaBuilder | Knex.SchemaBuilder[]) {
		const processedInputs = lodash.isArray(inputs)
			? inputs
			: [inputs]

		return processedInputs.map((processedInput) => {
			return processedInput.toString()
		}).join('\n\n')
	},
}
