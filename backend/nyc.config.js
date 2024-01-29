var isProduction = process.env.NODE_ENV === 'production';

var commonIncludeList = [
	'src/service/**/*.ts',
	'src/util/parser/schema/**/*.ts',
	'src/util/date/**/*.ts',
];
var includeList = isProduction
	? commonIncludeList
	: [...commonIncludeList, 'src/repository/**/*.ts'];

module.exports = {
	extends: '@istanbuljs/nyc-config-typescript',
	all: true,
	'check-coverage': true,
	include: includeList,
	exclude: [
		'src/test/**/*.ts',
		'**/dependency.ts',
		'src/service/authService/socialManager/**/*.ts',
	],
};
