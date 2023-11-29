export const joinSummaryPage = (io, accountBookId) => {
	io.emit('realtimeData:summary:join', accountBookId);
};

export const outSummaryPage = (io, accountBookId) => {
	io.emit('realtimeData:summary:out', accountBookId);
};
