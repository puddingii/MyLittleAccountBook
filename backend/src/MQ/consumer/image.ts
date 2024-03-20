import * as zod from 'zod';
import { updateAccountBookMedia } from '@/repository/accountBookMediaRepository/dependency';

import { TConsumerFunctionParameter, TConsumerMapper } from '@/interface/MQ';

export const uploadResultMessage = async (consumerInfo: TConsumerFunctionParameter) => {
	const { value } = consumerInfo;
	const { id, size } = zod
		.object({
			id: zod.number(),
			size: zod.number(),
		})
		.parse(value);

	await updateAccountBookMedia({ id, size, isSaved: true });
};

export default {
	'uploadResult-json': uploadResultMessage,
} as TConsumerMapper;
