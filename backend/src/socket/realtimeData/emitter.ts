/* eslint-disable @typescript-eslint/no-unused-vars */
import { getCategory } from '@/service/common/accountBook/dependency';
import { getRoomName } from '.';
import socketManager from '..';

import { TRealtimeEvent } from '@/interface/pubsub/realtime';
import { findByType } from '@/service/common/accountBook';
import { TCategory } from '@/interface/service/commonAccountBookService';
import { IRealtimeDataServerToClientEvents } from '@/interface/socket/namespace/realtimeData';

const realtimeIo = socketManager.realtimeDataSocket.io;

/**
 * type 입력 안할 시 broadcast 진행
 */
const getRoom = (accountBookId: number, type?: 'broadcast' | 'in') => {
	const emitType = type === 'in' ? 'in' : 'to';
	const roomName = getRoomName(accountBookId);

	return realtimeIo[emitType](roomName);
};

const getCategoryName = (categoryList: TCategory[], categoryId: number) => {
	return (
		(findByType(categoryList, 'childId', categoryId) as Partial<TCategory>)
			?.categoryNamePath ?? ''
	);
};

const emitNewNFColumn = async (
	info: { accountBookId: number; userNickname: string },
	newColumn: TRealtimeEvent['create:nfgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	const { groupId, categoryId, ...rest } = newColumn.dataValues;
	const { accountBookId, userNickname } = info;

	const categoryList = await getCategory(accountBookId);
	const category = getCategoryName(categoryList, categoryId);

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
	const { groupId, categoryId, isActivated, ...rest } = newColumn.dataValues;
	const { accountBookId, userNickname } = info;

	const categoryList = await getCategory(accountBookId);
	const category = getCategoryName(categoryList, categoryId);

	getRoom(accountBookId, emitType).emit('create:fgab', {
		...rest,
		category,
		nickname: userNickname,
	});
};

const emitUpdateFColumn = async (
	accountBookId: number,
	updatedColumn: TRealtimeEvent['update:fgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	const { categoryId, ...rest } = updatedColumn;
	const data: Parameters<IRealtimeDataServerToClientEvents['update:fgab']>[0] = rest;

	if (categoryId) {
		const categoryList = await getCategory(accountBookId);
		const category = getCategoryName(categoryList, categoryId);
		data.category = category;
	}

	getRoom(accountBookId, emitType).emit('update:fgab', data);
};

const emitUpdateNFColumn = async (
	accountBookId: number,
	updatedColumn: TRealtimeEvent['update:nfgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	const { categoryId, ...rest } = updatedColumn;
	const data: Parameters<IRealtimeDataServerToClientEvents['update:nfgab']>[0] = rest;

	if (categoryId) {
		const categoryList = await getCategory(accountBookId);
		const category = getCategoryName(categoryList, categoryId);
		data.category = category;
	}

	getRoom(accountBookId, emitType).emit('update:nfgab', data);
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
