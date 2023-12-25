import { getIo, getRoomName } from '.';
import { logger } from '@/util';

export default (io: ReturnType<typeof getIo>) => {
	io.on('connection', socket => {
		const namespace = socket.nsp;
		const dynamicName = namespace.name;
		const accountBookId = parseInt(dynamicName.split('-')[1] ?? '-1', 10);

		if (accountBookId !== -1) {
			socket.join(getRoomName(accountBookId));
		}

		socket.on('disconnect', reason => {
			logger.info(`${reason}disconnect`, ['Socket']);
		});
	});
};
