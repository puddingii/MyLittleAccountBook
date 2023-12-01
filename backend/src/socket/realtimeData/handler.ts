import { getIo } from '.';

export default (io: ReturnType<typeof getIo>) => {
	io.on('connection', socket => {
		const namespace = socket.nsp;
		const dynamicName = namespace.name;
		console.log(dynamicName);

		socket.on('disconnect', reason => {
			console.log(reason, 'disconnect');
		});
		// if (socket.rooms.size) {
		// 	socket.rooms.clear()
		// }
		// socket.join('');
	});
};
