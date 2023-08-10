import { localStorageEffect } from '.';
import { atom } from 'recoil';

// initial state
const initialState = {
	email: '',
	nickname: '',
	isLogin: false,
};

const userState = atom({
	key: 'userState',
	default: initialState,
	effects: [localStorageEffect('userState')],
});

export default userState;
