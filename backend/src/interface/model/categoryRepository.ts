export type TCategoryInfoList = {
	id: number;
	parentId?: number;
	name: string;
	accountBookId: number;
	categoryIdPath: string;
	categoryNamePath: string;
	depth: number;
};
