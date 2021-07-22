import routes from '@/router/routes';

const verticalViews = [
	{
		title: 'მთავარი', // მთავარი კომპანია
		route: 'home',
		icon: 'HomeIcon',
	},

	{
		title: 'შიდა კომპანიები',
		route: 'inner_company',
		icon: 'TrelloIcon',
	},

	{
		title: 'გარე კომპანიები',
		route: 'outer_company',
		icon: 'ColumnsIcon',
	},

	{
		title: 'დეპარტამენტები',
		route: 'department',
		icon: 'ColumnsIcon',
	},

	{
		title: 'პოზიციები',
		route: 'position',
		icon: 'SidebarIcon',
	},

	{
		title: 'თანამშრომლები',
		route: 'employee',
		icon: 'UserIcon',
	},

	{
		title: 'ქმედება',
		route: 'action',
		icon: 'PenToolIcon',
	},
	{
		title: 'პარამეტრები',
		route: 'settings',
		icon: 'SettingsIcon',
	},
];

const final = verticalViews.map(el => {
	return {
		...el,
		id: routes[el.route].id,
	};
});

export default final;
