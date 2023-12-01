import CronGroupAccountBookModel from '@/model/cronGroupAccountBook';
import { TColumnInfo as TFColumnInfo } from '../model/cronGroupAccountBookRepository';
import { TColumnInfo as TNFColumnInfo } from '../model/groupAccountBookRepository';
import GroupAccountBookModel from '@/model/groupAccountBook';
import { IEmitter } from '.';

export type TRealtimeEvent = {
	'create:fgab': CronGroupAccountBookModel;
	'create:nfgab': GroupAccountBookModel;
	'update:fgab': Partial<Omit<TFColumnInfo, 'groupId'>> & {
		id: number;
		accountBookId: number;
	};
	'update:nfgab': Partial<Omit<TNFColumnInfo, 'groupId'>> & {
		id: number;
		accountBookId: number;
	};
	/** id는 지워진 column의 id값 */
	'delete:fgab': { accountBookId: number; id: number };
	/** id는 지워진 column의 id값 */
	'delete:nfgab': { accountBookId: number; id: number };
};

export type TRealtimeEventEmitter = IEmitter<TRealtimeEvent>;
