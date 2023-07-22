import express from 'express';

import { getUser } from '@/controller/userController';
import { isLoggedIn } from '@/middleware/authentication';

const router = express.Router();

router.get('/', isLoggedIn, getUser);

export default router;
