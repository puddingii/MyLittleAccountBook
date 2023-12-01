import { Socket } from 'socket.io-client';

/**
 * @param {Socket} io
 */
export const listen = io => {
	io.on('connect', () => {
		console.log('Socket connection is established!');
	});

	io.on('create:nfgab', info => {
		console.log('create:nfgab', info);
	});
};
