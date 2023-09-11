export const QUERY_KEY = {
	get: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income`,
	getCategory: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income/category`,
	postColumn: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income/column`,
	patchColumn: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income/column`,
	deleteColumn: `${process.env.REACT_APP_BACKEND_API}/accountbook/spending-income/column`,
	getSummary: `${process.env.REACT_APP_BACKEND_API}/accountbook/summary`,
	postAccountBook: `${process.env.REACT_APP_BACKEND_API}/accountbook`,
};
