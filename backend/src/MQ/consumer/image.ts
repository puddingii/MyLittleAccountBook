import * as zod from 'zod';
import { updateAccountBookMedia } from '@/repository/accountBookMediaRepository/dependency';

import { TConsumerFunctionParameter, TConsumerMapper } from '@/interface/MQ';

export const uploadResultMessage = async (consumerInfo: TConsumerFunctionParameter) => {
	const { value } = consumerInfo;
	const { format, id, size } = zod
		.object({
			id: zod.string().transform(str => parseInt(str, 10)),
			size: zod.string().transform(str => parseInt(str, 10)),
			format: zod.string(),
		})
		.parse(value);

	await updateAccountBookMedia({ id, mimeType: format, size });
};

export default {
	'uploadResult-json': uploadResultMessage,
} as TConsumerMapper;
