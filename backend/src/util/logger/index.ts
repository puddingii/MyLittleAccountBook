import WinstonDaily from 'winston-daily-rotate-file';
import winston from 'winston';
import path from 'path';

import LoggerBuilder from './class/builder';
import { TLoggerInfo } from './interface';

const { timestamp, label, prettyPrint } = winston.format;

const LOG_FOLDER_PATH = path.resolve(__dirname, '../../../logs');

const getProdModeLogger = () => {
	const logger = new LoggerBuilder()
		.setTransportInstance([
			// info 레벨 로그를 저장할 파일 설정
			new WinstonDaily({
				level: 'info',
				datePattern: 'YYYY-MM-DD',
				dirname: LOG_FOLDER_PATH,
				filename: `%DATE%.log`,
				maxFiles: 30, // 30일치 로그 파일 저장
				zippedArchive: true,
			}),
			// error 레벨 로그를 저장할 파일 설정
			new WinstonDaily({
				level: 'error',
				datePattern: 'YYYY-MM-DD',
				dirname: LOG_FOLDER_PATH,
				filename: `%DATE%.error.log`,
				maxFiles: 30,
				zippedArchive: true,
			}),
		])
		.setFormat([
			timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
			label({ label: 'LocalServer', message: true }),
			prettyPrint(),
		])
		.build();

	return logger;
};

const getDevModeLogger = () => {
	const logger = new LoggerBuilder()
		.activateConsole()
		.setFormat([
			timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
		])
		.build();

	return logger;
};

const getFullModeLogger = () => {
	const logger = new LoggerBuilder()
		.setTransportInstance([
			// info 레벨 로그를 저장할 파일 설정
			new WinstonDaily({
				level: 'info',
				datePattern: 'YYYY-MM-DD',
				dirname: LOG_FOLDER_PATH,
				filename: `%DATE%.log`,
				maxFiles: 30, // 30일치 로그 파일 저장
				zippedArchive: true,
			}),
			// error 레벨 로그를 저장할 파일 설정
			new WinstonDaily({
				level: 'error',
				datePattern: 'YYYY-MM-DD',
				dirname: LOG_FOLDER_PATH,
				filename: `%DATE%.error.log`,
				maxFiles: 30,
				zippedArchive: true,
			}),
		])
		.activateConsole()
		.setFormat([
			timestamp({
				format: 'YYYY-MM-DD HH:mm:ss',
			}),
			label({ label: 'LocalServer', message: true }),
			prettyPrint(),
		])
		.build();

	return logger;
};

const LOGGER_INFO: TLoggerInfo = {
	prod: getProdModeLogger,
	dev: getDevModeLogger,
	full: getFullModeLogger,
};

const isExistedType = (type: string): type is keyof typeof LOGGER_INFO => {
	return Object.keys(LOGGER_INFO).includes(type);
};

const getLogger = (type: keyof typeof LOGGER_INFO | string) => {
	return isExistedType(type) ? LOGGER_INFO[type]() : LOGGER_INFO.prod();
};

export default { getLogger };
