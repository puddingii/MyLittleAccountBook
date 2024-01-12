import * as Logic from '.';

/** Model */
import UserPrivacyModel from '@/model/userPrivacy';

/** Util */
import { convertErrorToCustomError } from '@/util/error';

export const findUserPrivacy = Logic.findUserPrivacy({
	errorUtil: { convertErrorToCustomError },
	UserPrivacyModel,
});

export const updateUserPrivacy = Logic.updateUserPrivacy({
	errorUtil: { convertErrorToCustomError },
	UserPrivacyModel,
});
