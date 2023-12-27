// assets
import {
	AppstoreOutlined,
	AppstoreAddOutlined,
	AntDesignOutlined,
	BarcodeOutlined,
	BgColorsOutlined,
	FontSizeOutlined,
	LoadingOutlined,
	TeamOutlined,
	SettingOutlined,
} from '@ant-design/icons';

// icons
const icons = {
	FontSizeOutlined,
	BgColorsOutlined,
	BarcodeOutlined,
	AntDesignOutlined,
	LoadingOutlined,
	AppstoreAddOutlined,
	TeamOutlined,
	SettingOutlined,
	AppstoreOutlined,
};

// ==============================|| MENU ITEMS - UTILITIES ||============================== //

const utilities = {
	id: 'manager',
	title: '가계부 설정',
	type: 'group',
	children: [
		{
			id: 'manage-accountbook',
			title: '가계부 설정',
			type: 'item',
			url: '/group/:id/manage-accountbook',
			icon: icons.SettingOutlined,
			breadcrumbs: false,
		},
		{
			id: 'manage-user',
			title: '멤버 관리',
			type: 'item',
			url: '/group/:id/manage-user',
			icon: icons.TeamOutlined,
			breadcrumbs: false,
		},
		{
			id: 'manage-category',
			title: '카테고리 관리',
			type: 'item',
			url: '/group/:id/manage-category',
			icon: icons.AppstoreOutlined,
			breadcrumbs: false,
		},
		// {
		// 	id: 'util-typography',
		// 	title: 'Typography',
		// 	type: 'item',
		// 	url: '/group/:id/typography',
		// 	icon: icons.FontSizeOutlined,
		// },
		// {
		// 	id: 'util-color',
		// 	title: 'Color',
		// 	type: 'item',
		// 	url: '/group/:id/color',
		// 	icon: icons.BgColorsOutlined,
		// },
		// {
		// 	id: 'util-shadow',
		// 	title: 'Shadow',
		// 	type: 'item',
		// 	url: '/group/:id/shadow',
		// 	icon: icons.BarcodeOutlined,
		// },
		// {
		// 	id: 'ant-icons',
		// 	title: 'Ant Icons',
		// 	type: 'item',
		// 	url: '/group/:id/icons/ant',
		// 	icon: icons.AntDesignOutlined,
		// 	breadcrumbs: false,
		// },
	],
};

export default utilities;
