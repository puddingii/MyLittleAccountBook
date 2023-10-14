import * as Logic from '.';

/** Repository */
import { createAccountBook } from '@/repository/accountBookRepository/dependency';
import { createDefaultCategory } from '@/repository/categoryRepository/dependency';
import { createGroupList } from '@/repository/groupRepository/dependency';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

/** ETC */
import sequelize from '@/loader/mysql';

export const createAccountBookAndInviteUser = Logic.createAccountBookAndInviteUser({
	errorUtil: { convertErrorToCustomError },
	sequelize,
	repository: { createAccountBook, createDefaultCategory, createGroupList },
});
