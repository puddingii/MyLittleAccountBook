import { Op } from 'sequelize';
import bcrypt from 'bcrypt';

/** Interfaces */
import { TSocialType } from '@/interface/auth';
import {
	TCreateAccountBookAndGroup,
	TCreateEmailUser,
	TCreateSocialUser,
	TFindOneSocialUserInfo,
	TFindOneUser,
} from '@/interface/repository/authRepository';

/** ETC.. */
import secret from '@/config/secret';

/** 새로운 계정에 대한 새로운 가계부, 그룹, 카테고리 생성 */
const createAccountBookAndGroup =
	(dependencies: TCreateAccountBookAndGroup['dependency']) =>
	async (
		newUser: TCreateAccountBookAndGroup['param'][0],
		transaction?: TCreateAccountBookAndGroup['param'][1],
	) => {
		const {
			dateUtil: { getCurrentDate },
			AccountBookModel,
			CategoryModel,
			defaultCategory,
		} = dependencies;

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
				accessHistory: getCurrentDate(),
			},
			{ transaction },
		);

		const categoryList = defaultCategory.rootCategory.map(category => ({
			name: category.name,
			accountBookId: newAccountBook.id,
		}));

		const list = await CategoryModel.bulkCreate(categoryList, {
			fields: ['name', 'accountBookId'],
			validate: true,
			transaction,
		});

		/** 메인 카테고리 각각의 기타 탭 생성 */
		const parentList = list.map(parent => ({
			name: '기타',
			parentId: parent.id,
			accountBookId: newAccountBook.id,
		}));
		await CategoryModel.bulkCreate(parentList, {
			fields: ['name', 'accountBookId', 'parentId'],
			validate: true,
			transaction,
		});

		return { accountBook: newAccountBook, group: newGroup };
	};

/** 소셜 로그인 전용 유저 생성 */
export const createSocialUser =
	(dependencies: TCreateSocialUser['dependency']) =>
	async (info: {
		userInfo: { nickname: string; email: string };
		socialType: TSocialType;
	}) => {
		const {
			AccountBookModel,
			CategoryModel,
			defaultCategory,
			errorUtil: { convertErrorToCustomError },
			dateUtil,
			UserModel,
			sequelize,
		} = dependencies;

		try {
			const { socialType, userInfo } = info;
			const transaction = await sequelize.transaction({ autocommit: false });
			try {
				const newUser = await UserModel.create({ ...userInfo }, { transaction });
				await newUser.createOauthuser({ type: socialType }, { transaction });
				await newUser.createUserprivacy(
					{
						isAuthenticated: false,
						isGroupInvitationOn: false,
						isPublicUser: false,
						userEmail: newUser.email,
					},
					{ transaction },
				);

				const { accountBook } = await createAccountBookAndGroup({
					AccountBookModel,
					CategoryModel,
					defaultCategory,
					dateUtil,
				})(newUser, transaction);

				await transaction.commit();

				return { accountBookId: accountBook.id, newUser };
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
export const createEmailUser =
	(dependencies: TCreateEmailUser['dependency']) =>
	async (userInfo: TCreateEmailUser['param']) => {
		const {
			AccountBookModel,
			CategoryModel,
			defaultCategory,
			errorUtil: { convertErrorToCustomError },
			dateUtil,
			UserModel,
			sequelize,
		} = dependencies;

		try {
			const hashedPassword = await bcrypt.hash(
				userInfo.password,
				secret.passwordHashRound,
			);
			const transaction = await sequelize.transaction({ autocommit: false });

			try {
				const [newUser, created] = await UserModel.findOrCreate({
					where: { email: userInfo.email },
					defaults: { ...userInfo, password: hashedPassword },
					transaction,
				});

				if (!created) {
					throw new Error('해당 이메일로 생성된 계정이 있습니다.');
				}
				await newUser.createUserprivacy(
					{
						isAuthenticated: false,
						isGroupInvitationOn: false,
						isPublicUser: false,
						userEmail: newUser.email,
					},
					{ transaction },
				);

				const { accountBook } = await createAccountBookAndGroup({
					AccountBookModel,
					CategoryModel,
					defaultCategory,
					dateUtil,
				})(newUser, transaction);

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

/** 유저 찾기 */
export const findOneUser =
	(dependencies: TFindOneUser['dependency']) =>
	async (
		userInfo: TFindOneUser['param'],
	): Promise<InstanceType<typeof UserModel> | undefined> => {
		const {
			GroupModel,
			UserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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

/** 유저 찾기(소셜 정보 추가) */
export const findOneSocialUserInfo =
	(dependencies: TFindOneSocialUserInfo['dependency']) =>
	async (
		userInfo: TFindOneSocialUserInfo['param'][0],
		socialType: TFindOneSocialUserInfo['param'][1],
	): Promise<InstanceType<typeof UserModel> | undefined> => {
		const {
			GroupModel,
			UserModel,
			OAuthUserModel,
			errorUtil: { convertErrorToCustomError },
		} = dependencies;

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
