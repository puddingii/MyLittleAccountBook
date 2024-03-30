import winston from 'winston';
import { ILogger } from './interface';

class Logger implements ILogger {
	private logger: winston.Logger;

	constructor(logger: winston.Logger) {
		this.logger = logger;
	}

	private combineDepth(list: Array<string>) {
		return list.map(depth => `[${depth}]`).join('');
	}

	error(message: string, depthList: Array<string>) {
		const depthStr = this.combineDepth(depthList);
		this.logger.error(`${depthStr} ${message}`);
	}

	info(message: string, depthList: Array<string>) {
		const depthStr = this.combineDepth(depthList);
		this.logger.info(`${depthStr} ${message}`);
	}

	log(info: { message: string; level: 'string' }, depthList: Array<string>) {
		const depthStr = this.combineDepth(depthList);
		this.logger.log(info.level, `${depthStr} ${info.message}`);
	}

	warn(message: string, depthList: Array<string>) {
		const depthStr = this.combineDepth(depthList);
		this.logger.warn(`${depthStr} ${message}`);
	}
}

export default Logger;
