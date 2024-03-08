/** Library */

/** Interface */
import {
	TGetAccountBookInfo,
	TSaveImageInfo,
	TUpdateAccountBookInfo,
	TUpdateAccountBookMediaInfo,
} from '@/interface/service/manageAccountBookService';

export const getAccountBookInfo =
	(dependencies: TGetAccountBookInfo['dependency']) =>
	async (info: TGetAccountBookInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError },
			repository: { findGroup, findOneAccountBook },
		} = dependencies;

		try {
			const { myEmail, ...accountBookInfo } = info;
			const myGroupInfo = await findGroup({ userEmail: myEmail, accountBookId: info.id });
			if (!myGroupInfo) {
				throw new Error(
					'현재 계정은 해당 그룹에 참여하지 않아 정보를 불러올 수 없습니다.',
				);
			}

			const accountBook = await findOneAccountBook(accountBookInfo);
			if (!accountBook) {
				throw new Error('가계부 정보를 찾을 수 없습니다.');
			}

			return { title: accountBook.title, content: accountBook.content };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

export const updateAccountBookInfo =
	(dependencies: TUpdateAccountBookInfo['dependency']) =>
	async (info: TUpdateAccountBookInfo['param']) => {
		const {
			errorUtil: { convertErrorToCustomError, CustomError },
			validationUtil: { isAdminUser },
			repository: { findGroup, updateAccountBook },
		} = dependencies;

		try {
			const { myEmail, ...accountBookInfo } = info;
			const myGroupInfo = await findGroup({
				userEmail: myEmail,
				accountBookId: info.accountBookId,
			});
			if (!myGroupInfo) {
				throw new Error('현재 계정은 해당 그룹에 참여하지 않았습니다.');
			}
			if (!isAdminUser(myGroupInfo.userType)) {
				throw new Error('관리 가능한 유저가 아닙니다.');
			}

			const successCount = await updateAccountBook(accountBookInfo);
			if (successCount === 0) {
				throw new CustomError('성공적으로 변경되지 않았습니다.', { code: 500 });
			}
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};

const saveImageInfo = async (
	info: TSaveImageInfo['param'],
	dependencies: TSaveImageInfo['dependency'],
) => {
	const { createAccountBookMedia, updateAccountBookMedia, getRandomString } =
		dependencies;
	const {
		file: { nameLength, ...fileInfo },
		accountBookId,
		abm,
	} = info;

	if (abm) {
		const cnt = await updateAccountBookMedia({
			...fileInfo,
			isSaved: false,
			accountBookId,
			id: abm.id,
		});

		if (cnt < 1) {
			throw new Error('이미지 변경 실패. 계속 실패한다면 운영자에게 문의주세요.');
		}

		return { code: 2, abm };
	}

	const randomName = await getRandomString(nameLength);
	const newMedia = await createAccountBookMedia({
		...fileInfo,
		isSaved: false,
		accountBookId,
		name: randomName,
	});

	return { code: 1, abm: newMedia };
};

export const updateAccountBookImageInfo =
	(dependencies: TUpdateAccountBookMediaInfo['dependency']) =>
	async (info: TUpdateAccountBookMediaInfo['param']) => {
		const {
			stringUtil: { getRandomString },
			errorUtil: { CustomError, convertErrorToCustomError },
			repository: {
				findGroupWithAccountBookMedia,
				updateAccountBookMedia,
				createAccountBookMedia,
			},
			validationUtil: { isAdminUser },
			fileInfo: { path, nameLength },
		} = dependencies;

		try {
			const { myEmail, accountBookId, header, file } = info;
			const myGroupInfo = await findGroupWithAccountBookMedia({
				userEmail: myEmail,
				accountBookId,
			});
			if (!myGroupInfo) {
				throw new CustomError('현재 계정은 해당 그룹에 참여하지 않았습니다.', {
					code: 400,
				});
			}
			if (!isAdminUser(myGroupInfo.userType)) {
				throw new CustomError('관리 가능한 유저가 아닙니다.', { code: 400 });
			}

			const { code, abm } = await saveImageInfo(
				{
					accountBookId,
					file: { mimeType: file.mimeType, nameLength, path, size: file.size },
					abm: myGroupInfo.accountbookmedias,
				},
				{ createAccountBookMedia, getRandomString, updateAccountBookMedia },
			);

			// pubsub.send('upd/image', {
			// 	name: abm.name,
			// 	path,
			// 	id: abm.id,
			// 	header
			// });

			return { code };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
