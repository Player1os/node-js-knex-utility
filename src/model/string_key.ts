// Load local modules.
import { KeyModel } from '.../src/model/key'

export abstract class StringKeyModel<
	IEntity extends { key: string },
	ICreateValues extends { key?: string },
	IModifyValues extends object,
	IFilterItem extends { key?: string | string[] },
	IInsertValues extends { key?: string },
	IUpdateValues extends object,
	IWhereFilterItem extends { key?: string | string[] }
> extends KeyModel<
	string,
	IEntity,
	ICreateValues,
	IModifyValues,
	IFilterItem,
	IInsertValues,
	IUpdateValues,
	IWhereFilterItem
> {}
