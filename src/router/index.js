import axiosIns from '@/libs/axios';
import Vue from 'vue';
import VueRouter from 'vue-router';
import routes from './routes';

Vue.use(VueRouter);

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,

	scrollBehavior() {
		return {
			x: 0,
			y: 0,
		};
	},

	routes: [
		{
			path: routes.home.path,
			name: routes.home.name,
			component: () => import('@/views/Home.vue'),

			meta: {
				pageTitle: 'მთავარი',
				breadcrumb: [
					{
						text: 'მთავარი',
						active: true,
					},
				],
			},
		},
		{
			path: routes.employee.path,
			name: routes.employee.name,
			component: () => import('@/views/Employee.vue'),
			meta: {
				pageTitle: 'თანამშრომლები',
				breadcrumb: [
					{
						text: 'თანამშრომლები',
						active: true,
					},
				],
			},
		},
		{
			path: routes.inner_company.path,
			name: routes.inner_company.name,
			component: () => import('@/views/InnerCompany.vue'),
			meta: {
				pageTitle: 'შიდა კომპანიები',
				breadcrumb: [
					{
						text: 'შიდა კომპანიები',
						active: true,
					},
				],
			},
		},
		{
			path: routes.department.path,
			name: routes.department.name,
			component: () => import('@/views/Department.vue'),
			meta: {
				pageTitle: 'დეპარტამენტები',
				breadcrumb: [
					{
						text: 'დეპარტამენტები',
						active: true,
					},
				],
			},
		},
		{
			path: routes.outer_company.path,
			name: routes.outer_company.name,
			component: () => import('@/views/OuterCompany.vue'),
			meta: {
				pageTitle: 'გარე კომპანიები',
				breadcrumb: [
					{
						text: 'გარე კომპანიები',
						active: true,
					},
				],
			},
		},
		{
			path: routes.outer_company_detail.path,
			name: routes.outer_company_detail.name,
			component: () => import('@/views/OuterCompanyDetail.vue'),
			meta: {
				pageTitle: 'კომპანიის დეტალური',
				breadcrumb: [
					{
						text: 'კომპანიის დეტალური',
						active: true,
					},
				],
			},
		},
		{
			path: routes.settings.path,
			name: routes.settings.name,
			component: () => import('@/views/Settings.vue'),
			meta: {
				pageTitle: 'პარამეტრები',
				breadcrumb: [
					{
						text: 'პარამეტრები',
						active: true,
					},
				],
			},
		},
		{
			path: routes.user.path,
			name: routes.user.name,
			component: () => import('@/views/User.vue'),
			meta: {
				pageTitle: 'თანამშრომლის დეტალური',
				breadcrumb: [
					{
						text: 'თანამშრომები',
						active: false,
						to: '/employee',
					},
					{
						text: 'თანამშრომლის დეტალური',
						active: true,
					},
				],
			},
		},

		{
			path: routes.position.path,
			name: routes.position.name,
			component: () => import('@/views/Position.vue'),
			meta: {
				pageTitle: 'პოზიციები',
				breadcrumb: [
					{
						text: 'პოზიციები',
						active: true,
					},
				],
			},
		},

		{
			path: routes.action.path,
			name: routes.action.name,
			component: () => import('@/views/Action.vue'),
			meta: {
				pageTitle: 'ქმედება',
				breadcrumb: [
					{
						text: 'ქმედება',
						active: true,
					},
				],
			},
		},

		{
			path: '/profile',
			name: 'profile',
			component: () => import('@/views/Profile.vue'),
			meta: {
				pageTitle: 'პროფილი',
				breadcrumb: [
					{
						text: 'პროფილი',
						active: true,
					},
				],
			},
		},

		{
			path: '/login',
			name: 'login',
			component: () => import('@/views/Login.vue'),
			meta: {
				layout: 'full',
			},
		},

		{
			path: '/error-404',
			name: 'error-404',
			component: () => import('@/views/error/Error404.vue'),
			meta: {
				layout: 'full',
			},
		},

		{
			path: '/test',
			name: 'test',
			component: () => import('@/views/test.vue'),
			meta: {
				pageTitle: 'კომპანიები xxx',
				breadcrumb: [
					{
						text: 'კომპანიები xxx',
						active: true,
					},
				],
			},
		},

		{
			path: '*',
			redirect: 'error-404',
		},
	],
});

function isAuthenticated() {
	if (!localStorage.getItem('jwttoken')) return false;

	return axiosIns
		.get('/token/check', {
			headers: {
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + localStorage.getItem('jwttoken'),
			},
		})
		.then(({ data }) => data.status == 1)
		.catch(() => false);
}

/*
 * 	Auth Logic
 *	==================================
 *	login 	-- auth 	-> main page
 *	login 	-- !auth 	-> don't care
 *	!login 	-- auth 	-> next()
 *	!login 	-- !auth 	-> login
 *	==================================
 */
router.beforeEach(async (to, _, next) => {
	const auth = await isAuthenticated();

	if (auth && to.path === '/login') {
		next({ path: '/' });
	}

	if (!auth && to.path !== '/login') {
		['jwttoken', 'user'].forEach(e => localStorage.removeItem(e));
		next({ path: '/login' });
	}

	const appLoading = document.getElementById('loading-bg');
	if (appLoading) appLoading.style.display = 'none';

	next();
});

export default router;
