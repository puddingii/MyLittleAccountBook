import { Socket } from 'socket.io-client';

/**
 * @param {Socket} io
 */
export const listen = io => {
	io.on('connect', () => {
		console.log('Socket connection is established!');
	});
};
