import { getIo, getRoomName } from '.';

export default (io: ReturnType<typeof getIo>) => {
	io.on('connection', socket => {
		const namespace = socket.nsp;
		const dynamicName = namespace.name;
		const accountBookId = parseInt(dynamicName.split('-')[1] ?? '-1', 10);
		/** Realtime 관련 소켓이면 최대 룸 소유갯수는 1개로 고정 */
		if (socket.rooms.size > 0) {
			socket.rooms.clear();
		}

		if (accountBookId !== -1) {
			socket.join(getRoomName(accountBookId));
		}

		socket.on('disconnect', reason => {
			console.log(reason, 'disconnect');
		});
	});
};
