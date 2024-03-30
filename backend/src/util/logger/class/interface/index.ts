export interface ILogger {
	error(message: string, depthList: Array<string>): void;
	info(message: string, depthList: Array<string>): void;
	log(info: { message: string; level: string }, depthList: Array<string>): void;
	warn(message: string, depthList: Array<string>): void;
}
