import UserModel from '@/model/user';

import { TPostImageQuery } from '@/util/parser/schema/accountBookSchema';

declare module 'express-serve-static-core' {
	interface Request {
		user?: {
			email: string;
			nickname: string;
		};
		file?: TPostImageQuery['file'];
	}
}
