import realtimeSocket from '@/socket/realtimeData/emitter';
import TypeEmitter from './class';

import { TRealtimeEvent } from '@/interface/pubsub/realtime';

const eventEmitter = new TypeEmitter<TRealtimeEvent>();

eventEmitter.on('create:fgab', function (info) {
	const { accountBookId, column } = info;

	realtimeSocket.emitNewFColumn(accountBookId, column);
});

eventEmitter.on('create:nfgab', function (info) {
	const { accountBookId, column } = info;

	realtimeSocket.emitNewNFColumn(accountBookId, column);
});

eventEmitter.on('update:fgab', function (info) {
	const { accountBookId, column } = info;

	realtimeSocket.emitUpdateFColumn(accountBookId, column);
});

eventEmitter.on('update:nfgab', function (info) {
	const { accountBookId, column } = info;

	realtimeSocket.emitUpdateNFColumn(accountBookId, column);
});

eventEmitter.on('delete:fgab', function (info) {
	const { accountBookId, column } = info;

	realtimeSocket.emitDeleteFColumn(accountBookId, column);
});

eventEmitter.on('delete:nfgab', function (info) {
	const { accountBookId, column } = info;

	realtimeSocket.emitDeleteNFColumn(accountBookId, column);
});

export default eventEmitter;
