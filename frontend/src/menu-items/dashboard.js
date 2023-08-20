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
	title: 'Navigation',
	type: 'group',
	children: [
		{
			id: 'dashboard',
			title: '종합 대시보드',
			type: 'item',
			url: '/group/:id/dashboard/default',
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
