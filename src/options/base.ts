// tslint:disable:no-empty-interface

// Load local modules.
import {
	IDeleteOptions,
	IInsertOptions,
	IOptions,
	ISelectOptions,
	IUpdateOptions,
} from '.../src/options'

// Declare and expose the interfaces for options.
export interface ICreateOptions extends IInsertOptions {
	isValidationDisabled?: boolean,
}
export interface ICountOptions extends IOptions {
	isValidationDisabled?: boolean,
}
export interface IExistsOptions extends IOptions {
	isValidationDisabled?: boolean,
}
export interface IFindOptions extends ISelectOptions {
	isValidationDisabled?: boolean,
}
export interface IModifyOptions extends IUpdateOptions {
	isFilterValidationDisabled?: boolean,
	isValuesValidationDisabled?: boolean,
}
export interface IDestroyOptions extends IDeleteOptions {
	isValidationDisabled?: boolean,
}
