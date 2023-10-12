/** Repository */
import { findGroup } from '@/repository/groupRepository';

export type TGetCategory = {
	dependency: {
		repository: {
			findGroup: typeof findGroup;
		};
	};
	param: {
		userEmail: string;
		accountBookId: number;
	};
};
