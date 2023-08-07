import express from 'express';

import { getUser } from '@/service/userService';
import { verifyToken } from '@/middleware/authentication';

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
	try {
		const user = getUser();
		return res.status(200).json({ nickname: user });
	} catch (error) {
		return res.status(404).json({ isSucceed: false });
	}
});

export default router;
