import { localStorageEffect } from '.';
import { atom } from 'recoil';

// initial state
const initialState = {
	openItem: ['summary'],
	defaultId: 'summary',
	openComponent: 'buttons',
	drawerOpen: false,
	componentDrawerOpen: true,
};

const menuState = atom({
	key: 'menuState',
	default: initialState,
	effects: [localStorageEffect('menuState')],
});

export default menuState;
