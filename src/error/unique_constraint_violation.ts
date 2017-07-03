// Load scoped modules.
import BaseError from '@player1os/base-error'

// Define and expose an interface for the knex error.
export interface IKnexError extends Error {
	table: string,
	detail: string,
	constraint: string,
}

export interface IErrorItem {
	input: string,
	type: 'any.db_unique_constraint',
	message: string,
}

// Expose the error class.
export default class UniqueConstraintViolationError extends BaseError {
	public readonly fields: string
	public readonly values: string
	public readonly details: {
		readonly [field: string]: IErrorItem,
	}

	constructor(knexError: IKnexError) {
		// Parse the knex error.
		const matches = knexError.detail.match(/^Key \((.*)\)=\((.*)\) already exists.$/)
		if ((matches === null) || (matches.length !== 3)) {
			throw knexError
		}
		const fieldsString = matches[1]
		const valuesString = matches[2]

		// Call parent constructor.
		super(`The unique constraint "${knexError.table}"."${knexError.constraint}" has been violated`)
		this.fields = fieldsString
		this.values = valuesString

		// Generate the details property.
		const fields = fieldsString.split(', ')
		const values = valuesString.split(', ')
		this.details = fields.reduce((accumulator, field) => {
			accumulator[field] = {
				input: valuesString,
				type: 'any.db_unique_constraint',
				message: `The constraint "${knexError.table}"."${knexError.constraint}" has been violated, while attempting to`
					+ ` set the (${valuesString}) value${(values.length > 1) ? 's' : ''}`
					+ ` in the (${fieldsString}) field${(fields.length > 1) ? 's' : ''}.`,
			}
			return accumulator
		}, {})
	}
}
