export const setComma = num => {
	if (!num) {
		return '0';
	}
	return Math.floor(Number(num))
		.toString()
		.replace(/(\d)(?=(?:\d{3})+(?!\d))/g, '$1,');
};
