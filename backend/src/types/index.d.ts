import UserModel from '@/model/user';

declare module 'express-serve-static-core' {
	interface Request {
		user?: {
			email: string;
			nickname: string;
		};
	}
}
