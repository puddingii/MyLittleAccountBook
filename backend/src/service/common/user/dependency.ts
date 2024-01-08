import * as Logic from '.';

/** Util */
import { isAdminUser } from '@/util/validation/user';
import {
	getEmailVerificationStateCache,
	setEmailVerificationStateCache,
} from '@/util/cache/v2';
import { getBuilder } from '@/util/mail';
import { getVerifyMailHTML } from '@/util/mail/html';

/** Repository */
import { findGroup } from '@/repository/groupRepository/dependency';

export const checkAdminGroupUser = Logic.checkAdminGroupUser({
	repository: { findGroup },
	validationUtil: { isAdminUser },
});

export const sendVerificationEmail = Logic.sendVerificationEmail({
	cacheUtil: {
		setCache: setEmailVerificationStateCache,
		getCache: getEmailVerificationStateCache,
	},
	mailUtil: { getBuilder: getBuilder, getVerifyMailHTML: getVerifyMailHTML },
});
