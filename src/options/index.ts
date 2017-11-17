// tslint:disable:no-empty-interface

// Load npm modules.
import * as Knex from 'knex'

// Declare and expose the interfaces for options.
export interface IOptions {
	tableNameAlias?: string,
	transaction?: Knex.Transaction,
}
export interface IReturningOptions extends IOptions {
	returningFields?: string[],
}
export interface IInsertOptions extends IReturningOptions {
	isEmptyValuesVerificationDisabled?: boolean,
}
export interface ISelectOptions extends IReturningOptions {
	fieldNameAliases?: {
		[key: string]: string,
	},
	orderBy?: [{
		column: string,
		direction: string,
	}],
	page?: {
		size: number,
		number: number,
	},
}
export interface IUpdateOptions extends IReturningOptions {
	isEmptyValuesVerificationDisabled?: boolean,
}
export interface IDeleteOptions extends IReturningOptions {}
