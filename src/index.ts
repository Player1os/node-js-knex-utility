// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

// Expose the class for the main knex wrapper.
export class KnexWrapper {
	// Define the knex instance.
	public instance: Knex = null

	// Define the is connected flag.
	public isConnected = false

	// Define the connection semaphore.
	private semaphore = 0

	// Connect to the database through knex.
	async connect(knexConfig: Knex.Config) {
		// Defermine whether a connection has already been established.
		if (this.semaphore === 0) {
			// Create the knex instance based on the config.
			this.instance = Knex(knexConfig)
			this.isConnected = true
		}

		// Increment the semaphore.
		(++this.semaphore)
	}

	// Disconnect from the database through knex.
	async disconnect() {
		// Determine if the disconnect method was used incorrectly.
		if (this.semaphore === 0) {
			throw new Error('Disconnect invoked before connect.')
		}

		// Decrement the semaphore.
		(--this.semaphore)

		// Do nothing if the connect method wasn't called a sufficient number of times.
		if (this.semaphore > 0) {
			return
		}

		// Perform the actual disconnecting.
		await this.instance.destroy()

		// Reset the knex instance.
		this.instance = null
		this.isConnected = false
	}

	async transaction(callback: (trx: Knex.Transaction) => Promise<any>, trx: Knex.Transaction = null) {
		if (trx) {
			return callback(trx)
		}

		if (this.instance) {
			return this.instance.transaction(callback)
		}
	}
}

// Define and expose a helper function for outputing query builders into sql strings.
export const outputSqlString = (inputs: Knex.QueryBuilder | Knex.QueryBuilder[] | Knex.SchemaBuilder | Knex.SchemaBuilder[]) => {
	const processedInputs = lodash.isArray(inputs)
		? inputs
		: [inputs]

	return processedInputs.map((processedInput) => {
		return processedInput.toString()
	}).join('\n\n')
}

// Define and expose a helper function for altering columns within a schema.
export const alterColumn = (columnBuilder: Knex.ColumnBuilder): Knex.ColumnBuilder => {
	return (columnBuilder as any).alter()
}

// Expose an instace of the wrapper.
export default new KnexWrapper()
