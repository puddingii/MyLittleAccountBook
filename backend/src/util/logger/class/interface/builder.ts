import winston from 'winston';
import { ILogger } from '.';

export interface ILoggerBuilder {
	build(): ILogger;
	/** 콘솔 활성화 */
	activateConsole(): this;
	/** 어떤 형식으로 로깅할 것 인지 */
	setFormat(formatList: Array<winston.Logform.Format>): this;
	/** 어떤 식으로 저장하거나 로그를 보여줄 건지 */
	setTransportInstance(transportList: winston.Logger['transports']): this;
}
