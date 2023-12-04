import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import GroupAccountBookModel from '@/model/groupAccountBook';
import { TColumnInfo as TFColumnInfo } from '../model/cronGroupAccountBookRepository';
import { TColumnInfo as TNFColumnInfo } from '../model/groupAccountBookRepository';
import { IEmitter } from '.';

type TEventColumn<C> = {
	column: C;
	accountBookId: number;
};

export type TRealtimeEvent = {
	'create:fgab': TEventColumn<CronGroupAccountBookModel> & { userNickname: string };
	'create:nfgab': TEventColumn<GroupAccountBookModel> & { userNickname: string };
	'update:fgab': TEventColumn<
		Partial<Omit<TFColumnInfo, 'groupId' | 'id'>> & {
			id: number;
		}
	>;
	'update:nfgab': TEventColumn<
		Partial<Omit<TNFColumnInfo, 'groupId'>> & {
			id: number;
		}
	>;
	/** id는 지워진 column의 id값 */
	'delete:fgab': TEventColumn<{ id: number }>;
	/** id는 지워진 column의 id값 */
	'delete:nfgab': TEventColumn<{ id: number }>;
};

export type TRealtimeEventEmitter = IEmitter<TRealtimeEvent>;
