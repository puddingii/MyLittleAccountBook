import { Op, Transaction } from 'sequelize';
import bcrypt from 'bcrypt';
import dayjs from 'dayjs';

/** Interfaces */
import { TSocialType } from '@/interface/auth';
import { TUserInfo } from '@/interface/user';

/** Models */
import UserModel from '@/model/user';
import OAuthUserModel from '@/model/oauthUser';

/** ETC.. */
import sequelize from '@/loader/mysql';
import { convertErrorToCustomError } from '@/util/error';
import secret from '@/config/secret';
import AccountBookModel from '@/model/accountBook';
import GroupModel from '@/model/group';

/** 새로운 계정에 대한 새로운 가계부 및 그룹 생성 */
const createAccountBookAndGroup = async (
	newUser: UserModel,
	transaction?: Transaction,
) => {
	const newAccountBook = await AccountBookModel.create(
		{
			title: `${newUser.email}의 가계부`,
			content: '이 가계부에 대한 설명을 적어주세요',
		},
		{ transaction },
	);
	const newGroup = await newAccountBook.createGroup(
		{
			userEmail: newUser.email,
			userType: 'owner',
			accessHistory: dayjs().toDate(),
		},
		{ transaction },
	);

	return { accountBook: newAccountBook, group: newGroup };
};

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
			const { accountBook } = await createAccountBookAndGroup(newUser, transaction);

			await transaction.commit();

			return { accountBookId: accountBook.id };
		} catch (error) {
			await transaction.rollback();
			throw error;
		}
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
		});
		throw customError;
	}
};

/** 이메일 로그인 전용 유저 생성 */
export const createEmailUser = async (userInfo: TUserInfo) => {
	try {
		const hashedPassword = await bcrypt.hash(userInfo.password, secret.passwordHashRound);

		const [newUser, created] = await UserModel.findOrCreate({
			where: { email: userInfo.email },
			defaults: { ...userInfo, password: hashedPassword },
		});

		if (!created) {
			throw new Error('해당 이메일로 생성된 계정이 있습니다.');
		}

		const { accountBook } = await createAccountBookAndGroup(newUser);

		return { accountBookId: accountBook.id };
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
		});
		throw customError;
	}
};

/** 유저 찾기 */
export const findOneUser = async (userInfo: Partial<TUserInfo>) => {
	try {
		const user = await UserModel.findAll({
			where: userInfo,
			include: {
				model: GroupModel,
				as: 'groups',
				required: true,
			},
			order: [[GroupModel, 'accessHistory', 'DESC']],
			limit: 1,
			subQuery: false,
		});

		return user[0];
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
		});
		throw customError;
	}
};

/** FIXME */
export const test = async () => {
	await GroupModel.create({
		accessHistory: dayjs().add(2, 'day').toDate(),
		userEmail: 'test@naver.com',
		userType: 'observer',
		accountBookId: 1,
	});
	await GroupModel.create({
		accessHistory: dayjs().add(1, 'day').toDate(),
		userEmail: 'test@naver.com',
		userType: 'writer',
		accountBookId: 1,
	});
};

/** 유저 찾기(소셜 정보 추가) */
export const findOneSocialUserInfo = async (
	userInfo: { email?: string; nickname?: string },
	socialType: TSocialType,
) => {
	try {
		const user = await UserModel.findAll({
			where: userInfo,
			include: [
				{
					model: OAuthUserModel,
					as: 'oauthusers',
					/** inner join */
					required: true,
					where: {
						type: { [Op.eq]: socialType },
					},
				},
				{
					model: GroupModel,
					as: 'groups',
					required: true,
				},
			],
			order: [[GroupModel, 'accessHistory', 'DESC']],
			limit: 1,
			subQuery: false,
		});

		return user[0];
	} catch (error) {
		const customError = convertErrorToCustomError(error, {
			trace: 'Repository',
			code: 400,
		});
		throw customError;
	}
};
