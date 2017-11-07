// Load local modules.
import { BaseModel } from '.../src/model/base'

/**
 * An abstract class version of the BaseModel class with the generic parameters set to the most general type.
 */
export abstract class GeneralBaseModel extends BaseModel<object, object, object, object, object, object, object> {}
