/** Library */
import { extension } from 'mime-types';

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

	const ext = extension(fileInfo.mimeType);
	if (!ext) {
		throw new Error(
			'알 수 없는 확장자 입니다. 파일 변조가 의심되어 업로드가 취소됩니다.',
		);
	}
	const randomName = await getRandomString(nameLength, `.${ext}`);

	if (abm) {
		const beforeName = abm.name;
		const cnt = await updateAccountBookMedia({
			...fileInfo,
			isSaved: false,
			accountBookId,
			name: randomName,
			id: abm.id,
		});

		if (cnt < 1) {
			throw new Error('이미지 변경 실패. 계속 실패한다면 운영자에게 문의주세요.');
		}

		return { code: 2, abm, beforeName };
	}

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
			eventEmitter,
		} = dependencies;

		try {
			const { myEmail, accountBookId, file } = info;
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

			const { abm, code, beforeName } = await saveImageInfo(
				{
					accountBookId,
					file: { mimeType: file.mimeType, nameLength, path, size: file.size },
					abm: myGroupInfo.accountbookmedias,
				},
				{ createAccountBookMedia, getRandomString, updateAccountBookMedia },
			);

			eventEmitter.emit('upload', {
				name: abm.name,
				path,
				id: abm.id,
				buffer: file.buffer,
				beforeName,
			});

			return { code };
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Service',
				code: 400,
			});
			throw customError;
		}
	};
