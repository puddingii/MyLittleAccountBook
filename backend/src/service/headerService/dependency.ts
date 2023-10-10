import * as Logic from '.';

/** Repository */
import { createAccountBook } from '@/repository/accountBookRepository';
import { createDefaultCategory } from '@/repository/categoryRepository';
import { createGroupList } from '@/repository/groupRepository';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

/** ETC */
import sequelize from '@/loader/mysql';

export const createAccountBookAndInviteUser = Logic.createAccountBookAndInviteUser({
	errorUtil: { convertErrorToCustomError },
	sequelize,
	repository: { createAccountBook, createDefaultCategory, createGroupList },
});
