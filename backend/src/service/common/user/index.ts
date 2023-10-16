/** Interface */
import { TGetCategory } from '@/interface/service/commonUserService';

export const checkAdminGroupUser =
	(dependencies: TGetCategory['dependency']) => async (info: TGetCategory['param']) => {
		const {
			validationUtil: { isAdminUser },
			repository: { findGroup },
		} = dependencies;

		const { userEmail, accountBookId } = info;
		const myGroupInfo = await findGroup({
			userEmail,
			accountBookId,
		});
		if (!myGroupInfo) {
			throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
		}
		if (!isAdminUser(myGroupInfo.userType)) {
			throw new Error('관리 가능한 유저가 아닙니다.');
		}

		return myGroupInfo;
	};
