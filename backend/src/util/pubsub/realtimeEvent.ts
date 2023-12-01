import TypeEmitter from './class';

import { TRealtimeEvent } from '@/interface/pubsub/realtime';

const realtimeEvent = new TypeEmitter<TRealtimeEvent>();

realtimeEvent.on('create:fgab', function (info) {});

realtimeEvent.on('create:nfgab', function (info) {
	console.log(info);
});

realtimeEvent.on('update:fgab', function (info) {
	const { id, accountBookId, ...updatedInfo } = info;
});

realtimeEvent.on('update:nfgab', function (info) {
	const { id, accountBookId, ...updatedInfo } = info;
});

realtimeEvent.on('delete:fgab', function (info) {});

realtimeEvent.on('delete:nfgab', function (info) {});

export default realtimeEvent;
