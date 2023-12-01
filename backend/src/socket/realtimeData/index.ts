import { Namespace } from 'socket.io';

/** Interface */
import {
	IRealtimeDataClientToServerEvents,
	IRealtimeDataInterServerEvents,
	IRealtimeDataServerToClientEvents,
	IRealtimeDataSocketDate,
} from '@/interface/socket/namespace/realtimeData';
import { TIo } from '@/interface/socket';

export const getIo = (socketIo: TIo) => {
	const realtimeIo: Namespace<
		IRealtimeDataClientToServerEvents,
		IRealtimeDataServerToClientEvents,
		IRealtimeDataInterServerEvents,
		IRealtimeDataSocketDate
	> = socketIo.of(/^\/realtime-\d+$/);

	return realtimeIo;
};
