// Load local modules.
import { KeyModel } from '.../src/model/key'

export abstract class StringKeyModel<
	IEntity extends { key: string },
	ICreateValues extends { key?: string },
	IFindFilterItem extends { key?: string | string[] },
	IModifyFilterItem extends { key?: string | string[] },
	IModifyValues extends object,
	IDestroyFilterItem extends { key?: string | string[] },
	IInsertValues extends { key?: string },
	ISelectFilterItem extends { key?: string | string[] },
	IUpdateFilterItem extends { key?: string | string[] },
	IUpdateValues extends object,
	IDeleteFilterItem extends { key?: string | string[] }
> extends KeyModel<
	string,
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
