// Load app modules.
import {
	IKeyEntity,
	IKeyFilterItem,
	KeyModel
} from '.../src/model/key'

/**
 * An abstract class version of the KeyModel class with the generic parameters set to the most general type.
 */
export abstract class GeneralKeyModel extends KeyModel<IKeyEntity, object, object, IKeyFilterItem, object, object, IKeyFilterItem> {}
