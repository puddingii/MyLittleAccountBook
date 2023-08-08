import { localStorageEffect } from '.';
import { atom } from 'recoil';

// initial state
const initialState = {
	nickname: '',
	isLogin: false,
};

const menuState = atom({
	key: 'menuState',
	default: initialState,
	effects: [localStorageEffect('menuState')],
});

export default menuState;
