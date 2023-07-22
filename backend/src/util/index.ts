import secret from '@/config/secret';
import loggerManager from './logger';

export const logger = loggerManager.getLogger(secret.loggerMode);

export default { logger };
