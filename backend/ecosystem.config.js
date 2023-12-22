module.exports = [
	{
		name: 'my_little_account_book_backend_1',
		script: 'build/index.js',
		wait_ready: true,
		listen_timeout: 10000,
		env_production: {
			NODE_ENV: 'production',
			EXPRESS_PORT: '7501',
			SOCKET_PORT: '7201',
		},
		env_development: {
			NODE_ENV: 'development',
			EXPRESS_PORT: '3044',
			SOCKET_PORT: '3332',
		},
	},
	{
		name: 'my_little_account_book_backend_2',
		script: 'build/index.js',
		wait_ready: true,
		listen_timeout: 10000,
		env_production: {
			NODE_ENV: 'production',
			EXPRESS_PORT: '7502',
			SOCKET_PORT: '7202',
		},
		env_development: {
			NODE_ENV: 'development',
			EXPRESS_PORT: '3045',
			SOCKET_PORT: '3333',
		},
	},
	{
		name: 'my_little_account_book_backend_3',
		script: 'build/index.js',
		wait_ready: true,
		listen_timeout: 10000,
		env_production: {
			NODE_ENV: 'production',
			EXPRESS_PORT: '7503',
			SOCKET_PORT: '7203',
		},
		env_development: {
			NODE_ENV: 'development',
			EXPRESS_PORT: '3046',
			SOCKET_PORT: '3334',
		},
	},
];
