// Load local modules.
import { KeyModel } from '.../src/model/key'

export abstract class NumberKeyModel<
	IEntity extends { key: number },
	ICreateValues extends { key?: number },
	IModifyValues extends object,
	IFilterItem extends { key?: number | number[] },
	IInsertValues extends { key?: number },
	IUpdateValues extends object,
	IWhereFilterItem extends { key?: number | number[] }
> extends KeyModel<
	number,
	IEntity,
	ICreateValues,
	IModifyValues,
	IFilterItem,
	IInsertValues,
	IUpdateValues,
	IWhereFilterItem
> {}
