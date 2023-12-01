import { Server } from 'socket.io';

/** Server -> Client */
export interface ServerToClientEvents {}

/** Client -> Server */
export interface ClientToServerEvents {}

/** Server -> Server */
export interface InterServerEvents {}

/**
 * Socket data
 * "socket.data"'s type
 */
export interface SocketData {}

export type TIo = Server<
	ServerToClientEvents,
	ClientToServerEvents,
	InterServerEvents,
	SocketData
>;
