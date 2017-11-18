// Load node modules.
import { EventEmitter } from 'events'

// Define a constant for the async event prefix.
const asyncEventNamePrefix = '__async__'

// Expose the base event emitter class.
export class BaseEventEmitter extends EventEmitter {
	public hasExecuteListener(
		this: BaseEventEmitter,
	) {
		// Check if there are any execute event listeners.
		return (this.listenerCount('beforeExecute') > 0)
			|| (this.listenerCount(asyncEventNamePrefix + 'beforeExecute') > 0)
			|| (this.listenerCount('afterExecute') > 0)
			|| (this.listenerCount(asyncEventNamePrefix + 'afterExecute') > 0)
	}

	public async emitAsync(
		this: BaseEventEmitter,
		event: string,
		...args: any[],
	) {
		// Emit for the synchronous listeners.
		const result = this.emit(event, ...args)

		// Emit and wait for the asynchronous listeners in order.
		const asyncListeners = this.listeners(asyncEventNamePrefix + event)
		for (const asyncListener of asyncListeners) {
			await asyncListener(...args)
		}

		// Return the combined result.
		return result || (asyncListeners.length > 0)
	}

	public onAsync(
		this: BaseEventEmitter,
		event: string,
		listener: (...args: any[]) => Promise<void>,
	) {
		// Store the async event listener.
		return this.on(asyncEventNamePrefix + event, listener) as this
	}
}
