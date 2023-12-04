/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCategory } from '@/service/common/accountBook/dependency';
import { getRoomName } from '.';
import socketManager from '..';

import { TRealtimeEvent } from '@/interface/pubsub/realtime';
import { findByType } from '@/service/common/accountBook';
import { TCategory } from '@/interface/service/commonAccountBookService';

const realtimeIo = socketManager.realtimeDataSocket.io;

/**
 * type 입력 안할 시 broadcast 진행
 */
const getRoom = (accountBookId: number, type?: 'broadcast' | 'in') => {
	const emitType = type === 'in' ? 'in' : 'to';
	const roomName = getRoomName(accountBookId);

	return realtimeIo[emitType](roomName);
};

const emitNewNFColumn = async (
	info: { accountBookId: number; userNickname: string },
	newColumn: TRealtimeEvent['create:nfgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	const { groupId, categoryId, ...rest } = newColumn.dataValues;
	const { accountBookId, userNickname } = info;

	const categoryList = await getCategory(accountBookId);
	const category =
		(findByType(categoryList, 'childId', categoryId) as Partial<TCategory>)
			?.categoryNamePath ?? '';

	getRoom(accountBookId, emitType).emit('create:nfgab', {
		...rest,
		category,
		nickname: userNickname,
	});
};

const emitNewFColumn = async (
	info: { accountBookId: number; userNickname: string },
	newColumn: TRealtimeEvent['create:fgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	const { groupId, categoryId, ...rest } = newColumn.dataValues;
	const { accountBookId, userNickname } = info;

	const categoryList = await getCategory(accountBookId);
	const category =
		(findByType(categoryList, 'childId', categoryId) as Partial<TCategory>)
			?.categoryNamePath ?? '';

	getRoom(accountBookId, emitType).emit('create:fgab', {
		...rest,
		category,
		nickname: userNickname,
	});
};

const emitUpdateFColumn = (
	accountBookId: number,
	updatedColumn: TRealtimeEvent['update:fgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	getRoom(accountBookId, emitType).emit('update:fgab', updatedColumn);
};

const emitUpdateNFColumn = (
	accountBookId: number,
	updatedColumn: TRealtimeEvent['update:nfgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	getRoom(accountBookId, emitType).emit('update:nfgab', updatedColumn);
};

const emitDeleteFColumn = (
	accountBookId: number,
	deleteInfo: TRealtimeEvent['delete:fgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	getRoom(accountBookId, emitType).emit('delete:fgab', deleteInfo);
};

const emitDeleteNFColumn = (
	accountBookId: number,
	deleteInfo: TRealtimeEvent['delete:nfgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	getRoom(accountBookId, emitType).emit('delete:nfgab', deleteInfo);
};

export default {
	emitNewNFColumn,
	emitNewFColumn,
	emitUpdateFColumn,
	emitUpdateNFColumn,
	emitDeleteFColumn,
	emitDeleteNFColumn,
};
