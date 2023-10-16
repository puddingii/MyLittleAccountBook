import GroupModel from '@/model/group';

export const isAdminUser = (userType: GroupModel['userType']) => {
	const adminList = ['owner', 'manager'];

	return adminList.findIndex(adminType => adminType === userType) !== -1;
};

export const canUserWrite = (userType: GroupModel['userType']) => {
	const adminList = ['owner', 'manager', 'writer'];

	return adminList.findIndex(adminType => adminType === userType) !== -1;
};
