// Load local modules.
import { BaseEventEmitter } from '.../src/event_emitter'
import { IFindOptions } from '.../src/options/base'

// Load npm modules.
import * as Knex from 'knex'

// Expose the event emitter interface for implementation by the event emitter class.
export interface IFindEventEmitter<
	IEntity extends object,
	IFindFilterItem extends object
> extends BaseEventEmitter {
	emitAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeValidation', params: {
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}): Promise<boolean>
	emitAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'afterValidation', params: {
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}): Promise<boolean>
	emitAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeExecute', params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}): Promise<boolean>
	emitAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'afterExecute', params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}): Promise<boolean>
	emitAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeReturn', params: {
			entities: IEntity[],
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}): Promise<boolean>

	on(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeValidation', listener: (params: {
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => void): this
	on(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'afterValidation', listener: (params: {
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => void): this
	on(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeExecute', listener: (params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => void): this
	on(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'afterExecute', listener: (params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => void): this
	on(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeReturn', listener: (params: {
			entities: IEntity[],
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => void): this
	onAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeValidation', listener: (params: {
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => Promise<void>): this
	onAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'afterValidation', listener: (params: {
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => Promise<void>): this
	onAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeExecute', listener: (params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => Promise<void>): this
	onAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'afterExecute', listener: (params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => Promise<void>): this
	onAsync(this: IFindEventEmitter<IEntity, IFindFilterItem>,
		event: 'beforeReturn', listener: (params: {
			entities: IEntity[],
			filterExpression: IFindFilterItem | IFindFilterItem[],
			options: IFindOptions,
		}) => Promise<void>): this
}

// Expose the find event emitter class.
export class FindEventEmitter<
	IEntity extends object,
	IFindFilterItem extends object
> extends BaseEventEmitter implements IFindEventEmitter<
	IEntity,
	IFindFilterItem
> {}
