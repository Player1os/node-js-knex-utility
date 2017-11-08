// Load npm modules.
import * as Knex from 'knex'

export default (
	knexCreateTableBuilder: Knex.CreateTableBuilder,
	primaryTableName: string,
	primaryKeyType: 'integer' | 'bigInteger',
	attributeKeyType: 'integer' | 'bigInteger',
) => {
	const primaryForeignKeyColumnName = `${primaryTableName}_key`
	const attributeForeignKeyColumnName = `${primaryTableName}_attribute_key`

	knexCreateTableBuilder[primaryKeyType](primaryForeignKeyColumnName)
		.notNullable()
	knexCreateTableBuilder[attributeKeyType](attributeForeignKeyColumnName)
		.notNullable()

	knexCreateTableBuilder.foreign(`${primaryTableName}_key`)
		.references('key')
		.inTable('project')
		.onDelete('cascade')
	knexCreateTableBuilder.foreign(`${primaryTableName}_attribute_key`)
		.references('key')
		.inTable('project_attribute')
		.onDelete('cascade')

	knexCreateTableBuilder.index([`${primaryTableName}_key`])
}
