// Load scoped modules.
import BaseError from '@player1os/base-error'

// Expose the error class.
export default class EntityNotFoundError extends BaseError {
	constructor() {
		// Call parent constructor.
		super('No matching entity was found')
	}
}
