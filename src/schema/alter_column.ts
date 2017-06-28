

/**
 * Define and expose a helper function for altering columns within a schema.
 * @param columnBuilder The knex expression defining the column to be altered.
 */
export const alterColumn = (columnBuilder: Knex.ColumnBuilder): Knex.ColumnBuilder => {
	return (columnBuilder as any).alter()
}
