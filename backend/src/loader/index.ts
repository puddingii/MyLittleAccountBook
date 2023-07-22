import { Express } from 'express';
import expressLoader from './express';

export default ({ app }: { app: Express }): void => {
	expressLoader(app);
};
