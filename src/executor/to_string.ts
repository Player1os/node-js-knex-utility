// Load npm modules.
import * as Knex from 'knex'
import * as lodash from 'lodash'

/**
 * Define and expose a helper function for outputing query builders into sql strings.
 * @param inputs Any knex expression that can be used to output an SQL string.
 */
export const outputSqlString = (inputs: Knex.QueryBuilder | Knex.QueryBuilder[] | Knex.SchemaBuilder | Knex.SchemaBuilder[]) => {
	const processedInputs = lodash.isArray(inputs)
		? inputs
		: [inputs]

	return processedInputs.map((processedInput) => {
		return processedInput.toString()
	}).join('\n\n')
}
