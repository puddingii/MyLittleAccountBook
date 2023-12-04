import http from 'k6/http';
import { sleep, group, check } from 'k6';

export const options = {
	stages: [
		{ duration: '30s', target: 20 },
		{ duration: '1m30s', target: 30 },
		{ duration: '30s', target: 40 },
		{ duration: '1m', target: 5 },
		{ duration: '30s', target: 10 },
		{ duration: '2m', target: 50 },
	],
	thresholds: {
		http_req_failed: ['rate<0.01'],
		http_req_duration: ['p(95)<300'],
	},
};

export default function () {
	const headers = {
		authorization: '',
		refresh: '',
	};

	group('summary', function () {
		const res = http.get('http://localhost:3044/accountbook/summary?accountBookId=1', {
			headers,
		});

		check(res, {
			'response code was 200': res => res.status === 200,
		});
	});

	sleep(1);
}
