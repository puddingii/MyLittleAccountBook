import { Namespace } from 'socket.io';

/** Interface */
import {
	IRealtimeDataClientToServerEvents,
	IRealtimeDataInterServerEvents,
	IRealtimeDataServerToClientEvents,
	IRealtimeDataSocketDate,
} from '@/interface/socket/namespace/realtimeData';
import { TIo } from '@/interface/socket';

/** Room pattern -> realtime-0 realtime-3 realtime-545 .... */
const ROOM_NAME = 'realtime';
export const NAMESPACE = /^\/realtime-\d+$/;

export const getRoomName = (accountBookId: number) => {
	return `${ROOM_NAME}-${accountBookId}`;
};

export const getIo = (socketIo: TIo) => {
	const realtimeIo: Namespace<
		IRealtimeDataClientToServerEvents,
		IRealtimeDataServerToClientEvents,
		IRealtimeDataInterServerEvents,
		IRealtimeDataSocketDate
	> = socketIo.of(NAMESPACE);

	return realtimeIo;
};
