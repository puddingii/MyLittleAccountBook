import io from '@/loader/socket';

import { getIo } from './realtimeData';
import realtimeIoRegister from './realtimeData/handler';

export default {
	realtimeDataSocket: {
		io: getIo(io),
		register: realtimeIoRegister,
	},
};
