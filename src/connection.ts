// Load npm modules.
import * as Knex from 'knex'

// Expose the class for the main knex wrapper.
export class Connection {
	// Define the knex instance.
	private _instance: Knex | null = null

	// Define the connection semaphore.
	private _semaphore = 0

	/**
	 * Retrieves the connected state of the internal instance.
	 */
	isConnected(this: Connection) {
		return this._instance !== null
	}

	/**
	 * Retrieves the internal instance if it is connected. Otherwise throws an error.
	 */
	get instance(this: Connection) {
		if (!this._instance) {
			throw new Error('The knex instance has not been initialized.')
		}

		return this._instance
	}

	/**
	 * Ensures that either the passed transaction is used or a new one is created within the provided function.
	 */
	async transaction<T>(
		this: Connection,
		callback: (transaction: Knex.Transaction) => Promise<T>,
		transaction?: Knex.Transaction,
	): Promise<T> {
		// If a transaction is provided use it.
		if (transaction) {
			return callback(transaction)
		}

		// Otherwise use the instance to create a new transaction.
		return this.instance.transaction(callback)
	}

	/**
	 * Connects to the database through knex.
	 * @param knexConfig The configutation that can be usually obtained from the knexfile.
	 */
	async connect(this: Connection, knexConfig: Knex.Config) {
		// Defermine whether a connection has already been established.
		if (this._semaphore === 0) {
			// Create the knex instance based on the config.
			this._instance = Knex(knexConfig)
		}

		// Increment the semaphore.
		(++this._semaphore)
	}

	/**
	 * Disconnects from the database through knex.
	 */
	async disconnect(this: Connection) {
		// Determine if the disconnect method was used incorrectly.
		if (this._semaphore === 0) {
			throw new Error('Disconnect invoked before connect.')
		}

		// Decrement the semaphore.
		(--this._semaphore)

		// Do nothing if the connect method wasn't called a sufficient number of times.
		if (this._semaphore > 0) {
			return
		}

		// Perform the actual disconnecting.
		if (this._instance) {
			await this._instance.destroy()
		}
	}
}

// Expose an instace of the wrapper.
export default new Connection()
