// assets
import { DashboardOutlined, EditOutlined } from '@ant-design/icons';

// icons
const icons = {
	DashboardOutlined,
	EditOutlined,
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
	id: 'group-dashboard',
	title: '내 가계부',
	type: 'group',
	children: [
		{
			id: 'summary',
			title: '이번 달 요약',
			type: 'item',
			url: '/group/:id/summary',
			icon: icons.DashboardOutlined,
			breadcrumbs: false,
		},
		{
			id: 'spendingAndIncomeManageBoard',
			title: '지출/수입 관리',
			type: 'item',
			url: '/group/:id/spending-income',
			icon: icons.EditOutlined,
			breadcrumbs: false,
		},
	],
};

export default dashboard;
