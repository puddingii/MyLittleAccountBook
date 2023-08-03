import { Request, Response } from 'express';
import { google } from 'googleapis';
import { nanoid } from 'nanoid/async';

import secret from '@/config/secret';
import UserModel from '@/model/user';
import redisClient from '@/loader/redis';
import { CustomError } from '@/util/error/class';
import { convertErrorToCustomError } from '@/util/error';

const { google: googleKey, naver: naverKey } = secret.social;

type TSocialLogin = 'Google' | 'Naver';

/** FIXME test code */
export const emailLogin = async () => {
	const a = await UserModel.create({ email: 'asd', nickname: 'sdf', password: 'asf' });

	const s = await a.createOauthuser({ type: 'ss' });
	return s;
};

const getGoogleLocation = (state: string) => {
	const client = new google.auth.OAuth2(
		googleKey.clientId,
		googleKey.secret,
		'http://localhost:3044/auth/social/google',
	);
	const authorizationConfig = {
		access_type: 'offline',
		scope: [
			'https://www.googleapis.com/auth/userinfo.profile',
			'https://www.googleapis.com/auth/userinfo.email',
		],
		include_granted_scopes: true,
		state,
	};
	const url = client.generateAuthUrl(authorizationConfig);

	return url;
};

/** FIXME 나중에 네이버 Docs 읽어본 후 작업 예정 */
const getNaverLocation = (state: string) => {
	return state;
};

const SOCIAL_LOCATION_FN_MAPPER = {
	Google: getGoogleLocation,
	Naver: getNaverLocation,
};

export const getSocialLoginLocation = async (type: TSocialLogin) => {
	try {
		const randomState = await nanoid(15);
		await redisClient.set(randomState, 1, { EX: 180 });

		return SOCIAL_LOCATION_FN_MAPPER[type](randomState);
	} catch (error) {
		const customError = convertErrorToCustomError(error, { trace: 'Service' });
		throw customError;
	}
};

export const googleLogin = (req: Request, res: Response) => {
	return res.status(200).send('hi');
};
