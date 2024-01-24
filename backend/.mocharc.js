var isProduction = process.env.NODE_ENV === 'production';

module.exports = {
	extension: ['ts'],
	spec: isProduction
		? ['src/test/service/**/*.spec.ts', 'src/test/schema/**/*.spec.ts']
		: 'src/test/**/*.spec.ts',
	require: ['ts-node/register', 'src/test'],
	exit: true,
	parallel: false,
};
