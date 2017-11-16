// Load local modules.
import { KeyModel } from '.../src/model/key'

export class NumberKeyModel<
	IEntity extends { key: number },
	ICreateValues extends { key?: number },
	IFindFilterItem extends { key?: number | number[] },
	IModifyFilterItem extends { key?: number | number[] },
	IModifyValues extends object,
	IDestroyFilterItem extends { key?: number | number[] },
	IInsertValues extends { key?: number },
	ISelectFilterItem extends { key?: number | number[] },
	IUpdateFilterItem extends { key?: number | number[] },
	IUpdateValues extends object,
	IDeleteFilterItem extends { key?: number | number[] }
> extends KeyModel<
	number,
	IEntity,
	ICreateValues,
	IFindFilterItem,
	IModifyFilterItem,
	IModifyValues,
	IDestroyFilterItem,
	IInsertValues,
	ISelectFilterItem,
	IUpdateFilterItem,
	IUpdateValues,
	IDeleteFilterItem
> {}
