// Load local modules.
import { BaseEventEmitter } from '.../src/event_emitter'
import { IModifyOptions } from '.../src/options/base'

// Load npm modules.
import * as Knex from 'knex'

// Expose the event emitter interface for implementation by the event emitter class.
export interface IModifyEventEmitter<
	IEntity extends object,
	IModifyFilterItem extends object,
	IModifyValues extends object
> extends BaseEventEmitter {
	emit(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'beforeValidation', params: {
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}): boolean
	emit(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'afterValidation', params: {
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}): boolean
	emit(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'beforeExecute', params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}): boolean
	emit(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'afterExecute', params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}): boolean
	emit(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'beforeReturn', params: {
			entities: IEntity[],
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}): boolean

	on(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'beforeValidation', listener: (params: {
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}) => void): this
	on(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'afterValidation', listener: (params: {
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}) => void): this
	on(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'beforeExecute', listener: (params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}) => void): this
	on(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'afterExecute', listener: (params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}) => void): this
	on(this: IModifyEventEmitter<IEntity, IModifyFilterItem, IModifyValues>,
		event: 'beforeReturn', listener: (params: {
			entities: IEntity[],
			filterExpression: IModifyFilterItem | IModifyFilterItem[],
			values: IModifyValues,
			options: IModifyOptions,
		}) => void): this
}

// Expose the modify event emitter class.
export class ModifyEventEmitter<
	IEntity extends object,
	IModifyFilterItem extends object,
	IModifyValues extends object
> extends BaseEventEmitter implements IModifyEventEmitter<
	IEntity,
	IModifyFilterItem,
	IModifyValues
> {}
