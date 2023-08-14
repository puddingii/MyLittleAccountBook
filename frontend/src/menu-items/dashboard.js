// assets
import { DashboardOutlined, EditOutlined } from '@ant-design/icons';
import { useLocation } from 'react-router';

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
			id: 'incomeAndSpendingManageBoard',
			title: '지출/수입 관리',
			type: 'item',
			url: '/group/:id/income-spending',
			icon: icons.EditOutlined,
			breadcrumbs: false,
		},
	],
};

export default dashboard;
