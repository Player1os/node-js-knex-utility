// Load npm modules.
import * as Knex from 'knex'

/**
 * A class that encapsulates the knex instance allowing for its use as a singleton instance accross the application.
 * The class also defines methods for connecting and disconnecting to the underlying database and creating transactions.
 */
export class Connection {
	/**
	 * The internal knex instance.
	 */
	protected _instance: Knex | null = null

	/**
	 * The internal connection semaphore, that determines whether the connected state should be changed.
	 */
	protected semaphore = 0

	constructor(
		public readonly config: Knex.Config,
	) {}

	/**
	 * Retrieves the internal instance if it is connected. Otherwise throws an error.
	 * @param this An instance of the Connecntion class.
	 */
	public get instance(this: Connection) {
		if (this._instance === null) {
			throw new Error('The knex instance has not been initialized.')
		}

		return this._instance
	}

	/**
	 * Ensures that either the passed transaction is used or a new one is created within the provided function.
	 * @param this An instance of the Connecntion class.
	 */
	public async transaction<T>(
		this: Connection,
		callback: (transaction: Knex.Transaction) => Promise<T>,
		transaction?: Knex.Transaction,
	): Promise<T> {
		// If a transaction is provided use it.
		if (transaction !== undefined) {
			return callback(transaction)
		}

		// Otherwise use the instance to create a new transaction.
		return this.instance.transaction(callback)
	}

	/**
	 * Retrieves the connected state of the internal knex instance.
	 * @param this An instance of the Connecntion class.
	 */
	public isConnected(this: Connection) {
		return this._instance !== null
	}

	/**
	 * Initializes a connection to the database if none exists, and creates the internal knex instance.
	 * @param this An instance of the Connecntion class.
	 * @param knexConfig A knex configuration object that can be usually obtained from the project's knexfile.
	 */
	public async connect(this: Connection) {
		// Defermine whether a connection has already been established.
		if (this.semaphore === 0) {
			// Create the knex instance based on the config.
			this._instance = Knex(this.config)
		}

		// Increment the semaphore.
		(++this.semaphore)
	}

	/**
	 * Terminates the existing connection to the database, and destroyes the internal knex instance.
	 * @param this An instance of the Connecntion class.
	 */
	public async disconnect(this: Connection) {
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
		if (this._instance !== null) {
			await this._instance.destroy()
		}
	}
}
