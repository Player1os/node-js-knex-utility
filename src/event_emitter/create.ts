// Load local modules.
import { BaseEventEmitter } from '.../src/event_emitter'
import { ICreateOptions } from '.../src/options/base'

// Load npm modules.
import * as Knex from 'knex'

// Expose the event emitter interface for implementation by the event emitter class.
export interface ICreateEventEmitter<
	IEntity extends object,
	ICreateValues extends object
> extends BaseEventEmitter {
	emitAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeValidation', params: {
			values: ICreateValues[],
			options: ICreateOptions,
		}): Promise<boolean>
	emitAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'afterValidation', params: {
			queryBuilder: Knex.QueryBuilder,
			values: ICreateValues[],
			options: ICreateOptions,
		}): Promise<boolean>
	emitAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeExecute', params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			values: ICreateValues[],
			options: ICreateOptions,
		}): Promise<boolean>
	emitAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'afterExecute', params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			values: ICreateValues[],
			options: ICreateOptions,
		}): Promise<boolean>
	emitAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeReturn', params: {
			entities: IEntity[],
			values: ICreateValues[],
			options: ICreateOptions,
		}): Promise<boolean>

	on(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeValidation', listener: (params: {
			values: ICreateValues[],
			options: ICreateOptions,
		}) => void): this
	on(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'afterValidation', listener: (params: {
			queryBuilder: Knex.QueryBuilder,
			values: ICreateValues[],
			options: ICreateOptions,
		}) => void): this
	on(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeExecute', listener: (params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			values: ICreateValues[],
			options: ICreateOptions,
		}) => void): this
	on(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'afterExecute', listener: (params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			values: ICreateValues[],
			options: ICreateOptions,
		}) => void): this
	on(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeReturn', listener: (params: {
			entities: IEntity[],
			values: ICreateValues[],
			options: ICreateOptions,
		}) => void): this
	onAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeValidation', listener: (params: {
			values: ICreateValues[],
			options: ICreateOptions,
		}) => Promise<void>): this
	onAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'afterValidation', listener: (params: {
			queryBuilder: Knex.QueryBuilder,
			values: ICreateValues[],
			options: ICreateOptions,
		}) => Promise<void>): this
	onAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeExecute', listener: (params: {
			transaction: Knex.Transaction,
			queryBuilder: Knex.QueryBuilder,
			values: ICreateValues[],
			options: ICreateOptions,
		}) => Promise<void>): this
	onAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'afterExecute', listener: (params: {
			transaction: Knex.Transaction,
			entities: IEntity[],
			values: ICreateValues[],
			options: ICreateOptions,
		}) => Promise<void>): this
	onAsync(this: ICreateEventEmitter<IEntity, ICreateValues>,
		event: 'beforeReturn', listener: (params: {
			entities: IEntity[],
			values: ICreateValues[],
			options: ICreateOptions,
		}) => Promise<void>): this
}

// Expose the create event emitter class.
export class CreateEventEmitter<
	IEntity extends object,
	ICreateValues extends object
> extends BaseEventEmitter implements ICreateEventEmitter<
	IEntity,
	ICreateValues
> {}
