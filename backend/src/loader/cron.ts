import { logger } from '@/util';

export default async () => {
	await import('@/cron/updateAllFixedColumn/dependency');

	logger.info('All cron is loaded.', ['Loader']);
};
