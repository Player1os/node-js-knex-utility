// Load node modules.
import { EventEmitter } from 'events'

// Expose the event emitter interface for implementation by the event emitter class.
export interface IBaseEventEmitter extends EventEmitter {
	listenerCount(type: 'beforeExecute' | 'afterExecute'): number
}

// Expose the base event emitter class.
export class BaseEventEmitter extends EventEmitter implements IBaseEventEmitter {
	public hasExecuteListener(
		this: IBaseEventEmitter,
	) {
		return (this.listenerCount('beforeExecute') > 0) || (this.listenerCount('afterExecute') > 0)
	}
}
