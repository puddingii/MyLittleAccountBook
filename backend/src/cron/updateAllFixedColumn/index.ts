import dayjs from 'dayjs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

import secret from '@/config/secret';

import { TUpdateAllFixedColumn } from '@/interface/cron';

const execsync = promisify(exec);

export const updateFixedAllColumn =
	(dependencies: TUpdateAllFixedColumn['dependency']) => async () => {
		const {
			logger,
			errorUtil: { convertErrorToCustomError, filterPromiseSettledResultList },
			dateUtil: { calculateNextCycle },
			repository: { findAllFixedColumnBasedCron, createNewNFColumn },
		} = dependencies;

		try {
			if (secret.nodeEnv === 'development') {
				const dumpName = `cron${Math.round(Date.now() / 1000)}.dump.sql`;
				const dumpPath = path.resolve(__dirname, `../dump/${dumpName}`);
				await execsync(
					`${secret.mysql.dumpPath} -u ${secret.mysql.local.username} -p${secret.mysql.cmdPw} ${secret.mysql.databaseName} crongroupaccountbooks groupaccountbooks > ${dumpPath}`,
					{},
				);
			}

			const curDate = dayjs().tz();
			const beforeDate = curDate.subtract(1, 'd');

			/** Update해야할 리스트 찾기 */
			const list = await findAllFixedColumnBasedCron({
				endDate: curDate.toDate(),
				startDate: beforeDate.toDate(),
			});

			/** 변동 테이블에 저장 */
			const promiseList = list.map(column => {
				const {
					categoryId,
					groupId,
					needToUpdateDate: spendingAndIncomeDate,
					type,
					value,
					content,
				} = column;

				return createNewNFColumn({
					categoryId,
					groupId,
					spendingAndIncomeDate,
					type,
					value,
					content,
				});
			});

			const createPromiseList = await Promise.allSettled(promiseList);
			const filteredCreateResultInfo = filterPromiseSettledResultList(createPromiseList);

			/** 생성에 성공한 정보만 가져오기 */
			const filteredList = list.filter(info =>
				filteredCreateResultInfo.fulfilledList.findIndex(
					fulfilledInfo => fulfilledInfo.value.id === info.id,
				),
			);

			if (filteredCreateResultInfo.rejectedList.length > 0) {
				const createErrorMessage = filteredCreateResultInfo.rejectedList.reduce(
					(str, rejectedInfo) => {
						return `createNewNFColumn: ${str}
						${rejectedInfo.reason}
						`;
					},
					'',
				);
				logger.error(createErrorMessage, ['Cron']);
			}

			/** 다음 업데이트 해야할 날짜 업데이트 */
			const updatePromiseList = filteredList.map(fixedColumnInfo => {
				return fixedColumnInfo.update({
					needToUpdateDate: calculateNextCycle(
						fixedColumnInfo.cycleTime,
						fixedColumnInfo.cycleType,
						fixedColumnInfo.needToUpdateDate,
					),
				});
			});
			const updateResultList = await Promise.allSettled(updatePromiseList);

			const filteredUpdateResultInfo = filterPromiseSettledResultList(updateResultList);
			if (filteredUpdateResultInfo.rejectedList.length > 0) {
				const updateErrorMessage = filteredUpdateResultInfo.rejectedList.reduce(
					(str, rejectedInfo) => {
						return `update: ${str}
						${rejectedInfo.reason}
						`;
					},
					'',
				);
				logger.error(updateErrorMessage, ['Cron']);
			}

			logger.info('updateFixedAllColumn 작업 완료', ['Cron']);
		} catch (error) {
			const customError = convertErrorToCustomError(error, {
				trace: 'Cron',
				code: 400,
			});
			logger.error(customError.message, customError.traceList);
		}
	};
