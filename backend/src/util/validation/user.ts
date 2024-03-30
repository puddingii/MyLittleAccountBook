import * as zod from 'zod';

import type GroupModel from '@/model/group';

export const isAdminUser = (userType: GroupModel['userType']) => {
	const result = zod
		.enum(['owner', 'manager'], {
			required_error: '소셜 로그인의 종류 정보가 필요합니다.',
			invalid_type_error: '구글, 네이버 소셜 로그인만 가능합니다.',
		})
		.safeParse(userType);

	return result.success;
};

export const canUserWrite = (userType: GroupModel['userType']) => {
	const result = zod
		.enum(['owner', 'manager', 'writer'], {
			required_error: '소셜 로그인의 종류 정보가 필요합니다.',
			invalid_type_error: '구글, 네이버 소셜 로그인만 가능합니다.',
		})
		.safeParse(userType);

	return result.success;
};
