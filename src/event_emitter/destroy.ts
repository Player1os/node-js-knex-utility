// Load local modules.
import { BaseEventEmitter } from '.../src/event_emitter'
import { IDestroyOptions } from '.../src/options/base'

// Load npm modules.
import * as Knex from 'knex'

// Expose the event emitter interface for implementation by the event emitter class.
export interface IDestroyEventEmitter<
	IEntity extends object,
	IDestroyFilterItem extends object
> extends BaseEventEmitter {
	emit(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'beforeValidation', params: {
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}): boolean
	emit(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'afterValidation', params: {
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}): boolean
	emit(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'beforeExecute', params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}): boolean
	emit(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'afterExecute', params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}): boolean
	emit(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'beforeReturn', params: {
			entities: IEntity[],
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}): boolean

	on(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'beforeValidation', listener: (params: {
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}) => void): this
	on(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'afterValidation', listener: (params: {
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}) => void): this
	on(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'beforeExecute', listener: (params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}) => void): this
	on(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'afterExecute', listener: (params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}) => void): this
	on(this: IDestroyEventEmitter<IEntity, IDestroyFilterItem>,
		event: 'beforeReturn', listener: (params: {
			entities: IEntity[],
			filterExpression: IDestroyFilterItem | IDestroyFilterItem[],
			options: IDestroyOptions,
		}) => void): this
}

// Expose the destroy event emitter class.
export class DestroyEventEmitter<
	IEntity extends object,
	IDestroyFilterItem extends object
> extends BaseEventEmitter implements IDestroyEventEmitter<
	IEntity,
	IDestroyFilterItem
> {}
