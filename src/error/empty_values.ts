// Load scoped modules.
import BaseError from '@player1os/base-error'

// Expose the error class.
export default class EmptyValuesError extends BaseError {
	constructor() {
		// Call parent constructor.
		super('The submitted values are empty')
	}
}
