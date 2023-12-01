import { TColumnInfo as TFColumnInfo } from '@/interface/model/cronGroupAccountBookRepository';
import { TColumnInfo as TNFColumnInfo } from '@/interface/model/groupAccountBookRepository';

/** Client -> Server */
export interface IRealtimeDataClientToServerEvents {}
/** Server -> Client */
export interface IRealtimeDataServerToClientEvents {
	'create:fgab': (newColumn: TFColumnInfo) => void;
	'create:nfgab': (newColumn: TNFColumnInfo) => void;
	'update:fgab': Partial<Omit<TFColumnInfo, 'groupId'>> & {
		id: number;
	};
	'update:nfgab': Partial<Omit<TNFColumnInfo, 'groupId'>> & {
		id: number;
	};
	'delete:fgab': { id: number };
	'delete:nfgab': { id: number };
}
/** Server -> Server */
export interface IRealtimeDataInterServerEvents {}
/**
 * Socket data
 * "socket.data"'s type
 */
export interface IRealtimeDataSocketDate {}
