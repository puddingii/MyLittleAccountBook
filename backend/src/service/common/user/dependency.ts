import * as Logic from '.';

/** Repository */
import { findGroup } from '@/repository/groupRepository/dependency';

export const checkAdminGroupUser = Logic.checkAdminGroupUser({
	repository: { findGroup },
});
