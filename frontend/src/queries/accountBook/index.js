export const QUERY_KEY = {
	get: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income`,
	getCategory: `${process.env.REACT_APP_BACKEND_API}/accountbook/category`,
	postCategory: `${process.env.REACT_APP_BACKEND_API}/accountbook/category`,
	patchCategory: `${process.env.REACT_APP_BACKEND_API}/accountbook/category`,
	deleteCategory: `${process.env.REACT_APP_BACKEND_API}/accountbook/category`,
	postColumn: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income/column`,
	patchColumn: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income/column`,
	deleteColumn: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income/column`,
	getSummary: `${process.env.REACT_APP_BACKEND_API}/accountbook/summary`,
	getAccountBook: `${process.env.REACT_APP_BACKEND_API}/accountbook`,
	postAccountBook: `${process.env.REACT_APP_BACKEND_API}/accountbook`,
	updateAccountBook: `${process.env.REACT_APP_BACKEND_API}/accountbook`,
};
