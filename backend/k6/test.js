import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
	stages: [
		{ duration: '30s', target: 20 },
		{ duration: '1m30s', target: 10 },
		{ duration: '30s', target: 0 },
		{ duration: '1m30s', target: 0 },
	],
};

export default function () {
	http.get('http://localhost:3044/accountbook/summary?accountBookId=1', {
		headers: {
			authorization: 'Enter the Access Token',
			refresh: 'Enter the Refresh Token',
		},
	});
	sleep(1);
}
