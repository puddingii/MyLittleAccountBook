import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

/** Interfaces */
import { TSocialType } from '@/interface/auth';
import { TUserInfo } from '@/interface/user';

/** Models */
import UserModel from '@/model/user';
import OAuthUser from '@/model/oauthUser';

/** ETC.. */
import sequelize from '@/loader/mysql';
import { convertErrorToCustomError } from '@/util/error';
import secret from '@/config/secret';

/** 소셜 로그인 전용 유저 생성 */
export const createSocialUser = async (
	userInfo: { nickname: string; email: string },
	socialType: TSocialType,
) => {
	try {
		const transaction = await sequelize.transaction({ autocommit: false });
		try {
			const newUser = await UserModel.create(userInfo, { transaction });
			await newUser.createOauthuser({ type: socialType }, { transaction });
			await transaction.commit();
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};

/** 이메일 로그인 전용 유저 생성 */
export const createEmailUser = async (
	userInfo: TUserInfo,
): Promise<[UserModel, boolean]> => {
	try {
		const hashedPassword = await bcrypt.hash(userInfo.password, secret.passwordHashRound);

		const [user, created] = await UserModel.findOrCreate({
			where: { email: userInfo.email },
			defaults: { ...userInfo, password: hashedPassword },
		});

		return [user, created];
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};

/** 유저 찾기 */
export const findOneUser = async (userInfo: Partial<TUserInfo>) => {
	try {
		const user = await UserModel.findOne({ where: userInfo });

		return user;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};

/** 유저 찾기(소셜 정보 추가) */
export const findOneSocialUserInfo = async (
	userInfo: { email?: string; nickname?: string },
	socialType?: TSocialType,
) => {
	try {
		const socialCondition = socialType
			? {
					type: { [Op.eq]: socialType },
			  }
			: {};
		const user = await UserModel.findOne({
			where: userInfo,
			include: {
				model: OAuthUser,
				as: 'oauthusers',
				/** inner join */
				required: false,
				where: socialCondition,
			},
		});

		return user;
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
		});
		throw customError;
	}
};
