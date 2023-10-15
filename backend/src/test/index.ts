import sinon from 'sinon';
// import { sync } from '@/loader/mysql';

// (async () => {
// 	await sync();
// })();

export const mochaHooks = {
	afterEach() {
		sinon.restore();
	},
};

export default {};
