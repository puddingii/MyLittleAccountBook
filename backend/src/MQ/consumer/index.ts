import { type EachMessageHandler } from 'kafkajs';

/** Mapper */
import { IMAGE_TOPIC } from '@/enum';
import imageMapper from './image';

/** Util */
import { convertErrorToCustomError } from '@/util/error';
import { logger } from '@/util';
import { isString } from '@/util/string';

/** Interface */
import { TTopicMapper } from '@/interface/MQ';

const topicMapper: TTopicMapper = {
	[IMAGE_TOPIC]: imageMapper,
};

const getDepthList = (...additionalList: string[]) => {
	return ['Kafka', 'Consumer', ...additionalList];
};

export const eachMessageHandler: EachMessageHandler = async ({
	topic,
	partition,
	message,
}) => {
	const { key, value, ...rest } = message;
	const stringKey = key?.toString();
	const stringValue = value?.toString();
	if (!isString(stringKey) || !isString(stringValue)) {
		return;
	}

	/** Topic과 매칭되는 Mapper가 없을 시 리턴 */
	if (!topicMapper[topic]) {
		return;
	}

	/** Topic에 해당하는 Mapper는 있지만 Key값에 매칭되는 함수가 없을 시 리턴 */
	if (!topicMapper[topic][stringKey]) {
		return;
	}

	try {
		let convertedValue: string | object = stringValue;
		/** Key값에 -json포함시 자동으로 object로 변환 */
		if (stringKey.includes('-json')) {
			convertedValue = await JSON.parse(convertedValue);
		}

		await topicMapper[topic][stringKey]({
			...rest,
			key: stringKey,
			value: convertedValue,
			topic,
			partition,
		});
		logger.info(
			'Consumer function is successfully done.',
			getDepthList(topic, stringKey),
		);
	} catch (error) {
		const { message } = convertErrorToCustomError(error, {
			trace: 'Kafka',
			code: 400,
		});
		logger.error(message, getDepthList(topic, stringKey));
	}
};

export default {
	eachMessageHandler,
};
