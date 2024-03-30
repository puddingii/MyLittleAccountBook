import { type KafkaMessage } from 'kafkajs';

export type TConsumerFunctionParameter = Omit<KafkaMessage, 'key' | 'value'> & {
	topic: string;
	partition: number;
	key: string;
	value: string | object;
};
export type TConsumerMapper = {
	[key: string]: (arg: TConsumerFunctionParameter) => Promise<void>;
};
export type TTopicMapper = { [key: string]: TConsumerMapper };
