// Load scoped modules.
import config from '@player1os/config'

// Load npm modules.
import * as knex from 'knex'
import * as lodash from 'lodash'

// Load node modules.
import * as path from 'path'

// Load the project's knex configuration.
const knexConfig = __non_webpack_require__(path.join(config.APP_ROOT_PATH, 'knexFile.js'))

// Expose the knex connection wrapper.
export default {
	// Define the is connected flag.
	isConnected: false,
	// Define the knex instance.
	instance: knex({
		client: knexConfig.client,
	}),
	// Define the connection semaphore.
	semaphore: 0,
	// Connect to PostgreSQL through knex.
	async connect() {
		// Increment semaphore.
		(++this.semaphore)

		// Defermine if perform the actual connecting is needed.
		if (this.semaphore === 1) {
			// Create the knex instance based on the config.
			this.instance = knex(knexConfig)
			this.isConnected = true
		}

		// Return a copy of the connection parameters.
		return lodash.clone(knexConfig.connection) || {}
	},
	// Disconnect from PostgreSQL through knex.
	async disconnect() {
		// Determine if the disconnect method was used incorrectly.
		if (this.semaphore === 0) {
			throw new Error('Disconnect invoked before connect.')
		}

		// Decrement semaphore.
		(--this.semaphore)

		// Do nothing if not enough embeded connections were disconnected.
		if (this.semaphore > 0) {
			return
		}

		// Perform the actual disconnecting.
		await this.instance.destroy()

		// Reset the knex instance.
		this.instance = knex({
			client: knexConfig.client,
		})
		this.isConnected = false
	},
}
