import { io } from 'socket.io-client';
import { listen } from './listener';

export const getSocket = accountBookId => {
	const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}/realtime-${accountBookId}`, { autoConnect: false });
	listen(socket);

	return socket;
};
