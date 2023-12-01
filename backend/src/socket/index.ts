import { getIo } from './realtimeData';
import realtimeIoRegister from './realtimeData/handler';
import realtimeEmitter from './realtimeData/emitter';

export default {
	realtimeDataSocket: {
		getIo,
		register: realtimeIoRegister,
		emit: realtimeEmitter,
	},
};
