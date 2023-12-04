import { TColumnInfo as TFColumnInfo } from '@/interface/model/cronGroupAccountBookRepository';
import { TColumnInfo as TNFColumnInfo } from '@/interface/model/groupAccountBookRepository';

/** Client -> Server */
export interface IRealtimeDataClientToServerEvents {}
/** Server -> Client */
export interface IRealtimeDataServerToClientEvents {
	'create:fgab': (
		newColumn: Omit<TFColumnInfo, 'groupId' | 'categoryId'> & {
			nickname: string;
			category: string;
		},
	) => void;
	'create:nfgab': (
		newColumn: Omit<TNFColumnInfo, 'groupId' | 'categoryId'> & {
			nickname: string;
			category: string;
		},
	) => void;
	'update:fgab': (
		updatedColumn: Partial<Omit<TFColumnInfo, 'groupId' | 'categoryId'>> & {
			id: number;
			category?: string;
		},
	) => void;
	'update:nfgab': (
		updatedColumn: Partial<Omit<TNFColumnInfo, 'groupId' | 'categoryId'>> & {
			id: number;
			category?: string;
		},
	) => void;
	'delete:fgab': (info: { id: number }) => void;
	'delete:nfgab': (info: { id: number }) => void;
}
/** Server -> Server */
export interface IRealtimeDataInterServerEvents {}
/**
 * Socket data
 * "socket.data"'s type
 */
export interface IRealtimeDataSocketDate {}
