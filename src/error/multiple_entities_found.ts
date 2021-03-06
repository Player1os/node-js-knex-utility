// Load scoped modules.
import BaseError from '@player1os/base-error'

// Expose the error class.
export default class MultipleEntitiesFoundError extends BaseError {
	constructor(
		public readonly tableName: string,
	) {
		// Call parent constructor.
		super('More than a single matching entity was found')
	}
}
