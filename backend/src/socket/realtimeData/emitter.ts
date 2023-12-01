/* eslint-disable @typescript-eslint/no-unused-vars */
import { getRoomName } from '.';
import socketManager from '..';

import { TRealtimeEvent } from '@/interface/pubsub/realtime';

const realtimeIo = socketManager.realtimeDataSocket.io;

/**
 * type 입력 안할 시 broadcast 진행
 */
const getRoom = (accountBookId: number, type?: 'broadcast' | 'in') => {
	const emitType = type === 'in' ? 'in' : 'to';
	const roomName = getRoomName(accountBookId);

	return realtimeIo[emitType](roomName);
};

const emitNewNFColumn = (
	accountBookId: number,
	newColumn: TRealtimeEvent['create:nfgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	const { groupId, ...rest } = newColumn.dataValues;

	getRoom(accountBookId, emitType).emit('create:nfgab', rest);
};

const emitNewFColumn = (
	accountBookId: number,
	newColumn: TRealtimeEvent['create:fgab']['column'],
	emitType?: 'broadcast' | 'in',
) => {
	const { groupId, ...rest } = newColumn.dataValues;

	getRoom(accountBookId, emitType).emit('create:fgab', rest);
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
