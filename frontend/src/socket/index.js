import { Socket, io } from 'socket.io-client';

export const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}`);

socket.on('connect', () => {
	console.log('Socket connection is established!');
});

socket.on('hee', arg => {
	console.log(arg);
});

/**
 * @param {'realtimeData'} type
 */
export const connectSocket = async type => {
	/** @type {Socket} */
	const socket = await import(`./${type}}`);

	socket.connect();

	return socket;
};
