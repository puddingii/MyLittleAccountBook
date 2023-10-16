/** Repository */
import { findGroup } from '@/repository/groupRepository/dependency';

import { TValidationUtil } from '../util';

export type TGetCategory = {
	dependency: {
		validationUtil: Pick<TValidationUtil, 'isAdminUser'>;
		repository: {
			findGroup: typeof findGroup;
		};
	};
	param: {
		userEmail: string;
		accountBookId: number;
	};
};
