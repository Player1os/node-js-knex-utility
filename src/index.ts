// Load scoped modules.
import config from '@player1os/config'

// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

// Load node modules.
import * as path from 'path'

// Load the project's knex configuration.
const knexConfig = __non_webpack_require__(path.join(config.APP_ROOT_PATH, 'knexfile.ts'))

// Define the is connected flag.
let _isConnected = false
export const isConnected = () => {
	return _isConnected
}

// Define the knex instance.
export let instance = Knex({
	client: knexConfig.client,
})

// Define the connection semaphore.
let semaphore = 0

// Connect to the database through knex.
export const connect = async () => {
	// Defermine whether a connection has already been established.
	if (semaphore === 0) {
		// Create the knex instance based on the config.
		instance = Knex(knexConfig)
		_isConnected = true
	}

	// Increment semaphore.
	(++semaphore)

	// Return the connection parameters.
	return lodash.clone(knexConfig.connection) || {}
}

// Disconnect from the database through knex.
export const disconnect = async () => {
	// Determine if the disconnect method was used incorrectly.
	if (semaphore === 0) {
		throw new Error('Disconnect invoked before connect.')
	}

	// Decrement semaphore.
	(--semaphore)

	// Do nothing if the connect method wasn't called a sufficient number of times.
	if (semaphore > 0) {
		return
	}

	// Perform the actual disconnecting.
	await instance.destroy()

	// Reset the knex instance.
	instance = Knex({
		client: knexConfig.client,
	})
	_isConnected = false
}

export const outputSqlString = (inputs: Knex.QueryBuilder | Knex.QueryBuilder[] | Knex.SchemaBuilder | Knex.SchemaBuilder[]) => {
	const processedInputs = lodash.isArray(inputs)
		? inputs
		: [inputs]

	return processedInputs.map((processedInput) => {
		return processedInput.toString()
	}).join('\n\n')
}

// Define the helper class.
// TODO: Use type definition for this and the double column.
export class KnexWrapperHelper {
	alterColumn(columnBuilder: Knex.ColumnBuilder): Knex.ColumnBuilder {
		return (columnBuilder as any).alter()
	}
}

// Expose an instace of the helper.
export const helper = new KnexWrapperHelper()
