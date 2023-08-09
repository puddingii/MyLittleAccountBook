export type TResponseType<T> = {
	message: string;
	status: 'fail' | 'success';
	data: T;
};
