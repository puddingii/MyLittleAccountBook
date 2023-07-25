export interface ILogger {
	error(message: string, depthList: Array<string>): void;
	info(message: string, depthList: Array<string>): void;
	warn(message: string, depthList: Array<string>): void;
}
