/** Repository */
import { findGroup } from '@/repository/groupRepository/dependency';

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
