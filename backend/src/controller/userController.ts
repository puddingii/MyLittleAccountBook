import { Request, Response } from 'express';

export const getUser = (req: Request, res: Response) => {
	return res.status(200).send('hi');
};
