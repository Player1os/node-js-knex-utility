// Load scoped modules.
import BaseError from '@player1os/base-error'

// Expose the error class.
export default class MultipleRowsFoundError extends BaseError {
	constructor() {
		// Call parent constructor.
		super('The query returned more than a single row')
	}
}
