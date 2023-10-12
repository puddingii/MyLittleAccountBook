import * as Logic from '.';

/** Repository */
import { findGroup } from '@/repository/groupRepository';

export const checkAdminGroupUser = Logic.checkAdminGroupUser({
	repository: { findGroup },
});
