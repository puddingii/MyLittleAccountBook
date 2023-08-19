export type TCategoryInfo = {
	id: number;
	parentId?: number;
	name: string;
	accountBookId: number;
	categoryIdPath: string;
	categoryNamePath: string;
	depth: number;
};
