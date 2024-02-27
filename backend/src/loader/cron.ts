import { logger } from '@/util';
import secret from '@/config/secret';

export default async () => {
	if (!secret.express.isMaster) {
		return;
	}

	await import('@/cron/updateAllFixedColumn/dependency');

	logger.info('All cron is loaded.', ['Loader']);
};
