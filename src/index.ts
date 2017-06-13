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

	/**
	 * Connects to the database through knex.
	 * @param knexConfig The configutation that can be usually obtained from the knexfile.
	 */
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

	/**
	 * Disconnects from the database through knex.
	 */
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

	/**
	 * Ensures that either the passed transaction is used or a new one is created within the provided function.
	 */
	async transaction<T>(callback: (trx: Knex.Transaction) => Promise<T>, trx: Knex.Transaction = null): Promise<T> {
		// If a transaction is provided use it.
		if (trx) {
			return callback(trx)
		}

		// Otherwise if an instance is available use it to create a new transaction.
		if (this.instance) {
			return this.instance.transaction(callback)
		}

		// Otherwise return null.
		return null
	}
}

/**
 * Define and expose a helper function for outputing query builders into sql strings.
 * @param inputs Any knex expression that can be used to output an SQL string.
 */
export const outputSqlString = (inputs: Knex.QueryBuilder | Knex.QueryBuilder[] | Knex.SchemaBuilder | Knex.SchemaBuilder[]) => {
	const processedInputs = lodash.isArray(inputs)
		? inputs
		: [inputs]

	return processedInputs.map((processedInput) => {
		return processedInput.toString()
	}).join('\n\n')
}

/**
 * Define and expose a helper function for altering columns within a schema.
 * @param columnBuilder The knex expression defining the column to be altered.
 */
export const alterColumn = (columnBuilder: Knex.ColumnBuilder): Knex.ColumnBuilder => {
	return (columnBuilder as any).alter()
}

// Expose an instace of the wrapper.
export default new KnexWrapper()
