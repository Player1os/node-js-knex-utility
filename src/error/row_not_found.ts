// Load scoped modules.
import BaseError from '@player1os/base-error'

// Expose the error class.
export default class RowNotFoundError extends BaseError {
	constructor() {
		// Call parent constructor.
		super('The query did not return any rows')
	}
}
