/** Repository */
import { findGroup } from '@/repository/groupRepository/dependency';

/** Util */
import { TCacheUtil, TMailUtil, TValidationUtil } from '@/interface/util';

export type TCheckAdminGroupUser = {
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
export type TSendVerificationEmail = {
	dependency: {
		cacheUtil: Pick<TCacheUtil, 'setCache' | 'getCache'>;
		mailUtil: Pick<TMailUtil, 'getBuilder' | 'getVerifyMailHTML'>;
	};
	param: {
		userEmail: string;
		userNickname: string;
	};
};
