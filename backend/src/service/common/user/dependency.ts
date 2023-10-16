import * as Logic from '.';

import { isAdminUser } from '@/util/validation/user';

/** Repository */
import { findGroup } from '@/repository/groupRepository/dependency';

export const checkAdminGroupUser = Logic.checkAdminGroupUser({
	repository: { findGroup },
	validationUtil: { isAdminUser },
});
