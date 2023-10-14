/** Repository */
import { createAccountBook } from '@/repository/accountBookRepository/dependency';
import { createDefaultCategory } from '@/repository/categoryRepository/dependency';
import { createGroupList } from '@/repository/groupRepository';

/** ETC */
import sequelize from '@/loader/mysql';
import { TErrorUtil } from '../util';
import GroupModel from '@/model/group';

export type TCreateAccountBookAndInviteUser = {
	dependency: {
		errorUtil: Pick<TErrorUtil, 'convertErrorToCustomError'>;
		sequelize: typeof sequelize;
		repository: {
			createAccountBook: typeof createAccountBook;
			createDefaultCategory: typeof createDefaultCategory;
			createGroupList: typeof createGroupList;
		};
	};
	param: {
		title: string;
		content?: string;
		invitedUserList: Array<{ email: string; type: GroupModel['userType'] }>;
		ownerEmail: string;
	};
};
