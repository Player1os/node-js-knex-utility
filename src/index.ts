// Load app modules.
import {
	Connection,
	default as connection,
} from '.../src/connection'

// Expose the error classes.
export { default as EntityNotFoundError } from '.../src/error/entity_not_found'
export { default as MultipleEntitiesFoundError } from '.../src/error/multiple_entities_found'
export { default as UniqueConstraintViolationError } from '.../src/error/unique_constraint_violation'

// Expose the executor functions.
export { default as countExecutor } from '.../src/executor/count'
export { default as existsExecutor } from '.../src/executor/exists'
export { default as writeExecutor } from '.../src/executor/write'

// Expose the model classes, interfaces and types.
export {
	IInsertOptions,
	ISelectOptions,
	IUpdateOptions,
	IDeleteOptions,
	Model,
} from '.../src/model'
export {
	BaseModel,
	ICreateOptions,
	ICountOptions,
	IDestroyOptions,
	IExistsOptions,
	IFindOptions,
	IModifyOptions,
} from '.../src/model/base'
export {
	IKeyEntity,
	IKeyFilterItem,
	KeyModel,
	TKey,
	TKeyArray,
} from '.../src/model/key'

// Expose the query modifier functions.
export { default as filerExpressionQueryModifier } from '.../src/modifier/query/filter_expression'
export { default as filerExpressionItemQueryModifier } from '.../src/modifier/query/filter_expression_item'

// Expose the schema modifier functions.
export { default as alterColumnSchemaModifier } from '.../src/modifier/schema/alter_column'

// Expose the connection class and instance.
export { Connection }
export default connection
