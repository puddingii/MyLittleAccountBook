import axios from 'axios';

export const setAxiosAuthorization = data => {
	if (data) {
		axios.defaults.headers.common['Authorization'] = data;
	} else if (!data && axios.defaults.headers.common['Authorization']) {
		delete axios.defaults.headers.common['Authorization'];
	}
};
