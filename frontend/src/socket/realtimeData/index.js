import { io } from 'socket.io-client';
import { listen } from './listener';

const socket = io(`${process.env.REACT_APP_SOCKET_SERVER}/linked_data`, { autoConnect: false });
listen(socket);

export default socket;
