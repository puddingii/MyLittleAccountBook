import winston from 'winston';

import Logger from './index';
import { ILoggerBuilder } from './interface/builder';

class LoggerBuilder implements ILoggerBuilder {
	private formatList: Array<winston.Logform.Format>;
	private transportList: winston.Logger['transports'] = [];

	constructor() {
		const { printf } = winston.format;
		this.formatList = [
			printf(info => {
				return `${info.timestamp} ${info.level}: ${info.message}`;
			}),
		];
	}

	activateConsole() {
		const { colorize, simple } = winston.format;
		const consoleTransportInstance = new winston.transports.Console({
			format: winston.format.combine(colorize(), simple()),
		});

		this.transportList = [...this.transportList, consoleTransportInstance];

		return this;
	}

	build() {
		const { combine } = winston.format;

		const logger = winston.createLogger({
			format: combine(...this.formatList),
			transports: this.transportList,
		});

		return new Logger(logger);
	}

	setFormat(formatList: Array<winston.Logform.Format>) {
		this.formatList = [...formatList, ...this.formatList];

		return this;
	}

	setTransportInstance(transportList: winston.Logger['transports']) {
		this.transportList = transportList;

		return this;
	}
}

export default LoggerBuilder;
