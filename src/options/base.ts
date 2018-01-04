// tslint:disable:no-empty-interface

// Load local modules.
import {
	IDeleteOptions,
	IInsertOptions,
	IOptions,
	ISelectOptions,
	IUpdateOptions,
} from '.../src/options'

export interface IBaseOptions {
	isValidationDisabled?: boolean,
	isOneVariantErrorDisabled?: boolean,
}

// Declare and expose the interfaces for options.
export interface ICreateOptions extends IInsertOptions, IBaseOptions {
}
export interface ICountOptions extends IOptions {
	isValidationDisabled?: boolean,
}
export interface IExistsOptions extends IOptions {
	isValidationDisabled?: boolean,
}
export interface IFindOptions extends ISelectOptions, IBaseOptions {
}
export interface IModifyOptions extends IUpdateOptions {
	isFilterValidationDisabled?: boolean,
	isValuesValidationDisabled?: boolean,
	isCountErrorDisabled?: boolean,
}
export interface IDestroyOptions extends IDeleteOptions, IBaseOptions {
}
