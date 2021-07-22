import Vue from 'vue';
import Vuex from 'vuex';

// Modules
import app from './app';
import appConfig from './app-config';
import verticalMenu from './vertical-menu';
import axiosIns from '@/libs/axios';

Vue.use(Vuex);

export default new Vuex.Store({
	modules: {
		app,
		appConfig,
		verticalMenu,
	},
	state: {
		// profile
		user: null,
		generalPermissions: {},

		// other
		users: {},
		company: {},
		department: {},
		departmentWithoutCompanies: {},
		position: [],
		OuterCompany: {},
		contactPeople: {},
		contactHistory: {},
		currentPosition: {},
	},

	mutations: {
		SET_GENERAL_PERMISSIONS(state, payload) {
			state.generalPermissions = payload;
		},
		SET_USER(state, payload) {
			state.user = payload;
		},
		SET_USERS(state, payload) {
			state.users = payload;
		},
		SET_DEPARTMENT(state, payload) {
			state.department = payload;
		},
		SET_POSITION(state, payload) {
			state.position = payload;
		},
		SET_CURRENT_POSITION(state, payload) {
			state.currentPosition = payload;
		},
		SET_CONTACT_PEOPLE(state, payload) {
			state.contactPeople = payload;
		},
		SET_CONTACT_HISTORY(state, payload) {
			state.contactHistory = payload;
		},
	},
	actions: {
		logout() {
			return axiosIns.post('/v1/user/logout').catch(err => console.log(err.message));
		},

		PermissionsGeneral(ctx) {
			return axiosIns
				.get('/permissions/all/general')
				.then(response => ctx.commit('SET_GENERAL_PERMISSIONS', response.data))
				.catch(err => console.log(err.message));
		},

		AllActiveUsers(ctx) {
			return axiosIns
				.get('/v1/user/active')
				.then(response => ctx.commit('SET_USERS', response.data))
				.catch(err => console.log(err.message));
		},

		AllActiveInnerCompany() {
			return axiosIns
				.get('/v1/inner_company/active')
				.then(response => {
					if (response.status === 200)
						if (response.data.status !== 'Token is Expired') this.state.company = response.data;
				})
				.catch(err => console.log(err.message));
		},

		AllActiveOuterCompany() {
			return axiosIns
				.get('/v1/outer_company/active')
				.then(response => {
					this.state.OuterCompany = response.data;
				})
				.catch(err => console.log(err.message));
		},

		SetUser(ctx) {
			return axiosIns
				.get('/v1/user')
				.then(response => {
					// console.log({ ...response.data });
					ctx.commit('SET_CURRENT_POSITION', response.data.active_position);
					ctx.commit('SET_USER', response.data);
				})
				.catch(err => console.log(err.message));
		},

		// 14-06-2021
		AllActiveDepartment(ctx) {
			return axiosIns
				.get('/v1/department/all')
				.then(response => {
					if (response.status === 200) {
						ctx.commit('SET_DEPARTMENT', response.data);
					}
				})
				.catch(err => console.log(err));
		},

		AllActiveDepartmentWithoutCompanies() {
			return axiosIns
				.get('/v1/department/all/general')
				.then(response => {
					if (response.status === 200) {
						this.state.departmentWithoutCompanies = response.data;
					}
				})
				.catch(err => console.log(err));
		},

		AllActivePosition(ctx) {
			return axiosIns
				.get('/v1/position/all')
				.then(response => {
					if (response.status === 200) {
						ctx.commit('SET_POSITION', response.data);
					}
				})
				.catch(err => console.log(err));
		},

		AllActiveContactPeople(ctx, outerCompanyID) {
			return axiosIns
				.post('/v1/contact/people/active', { id: outerCompanyID })
				.then(response => {
					console.log(response.data);
					ctx.commit('SET_CONTACT_PEOPLE', response.data);
				})
				.catch(err => console.log(err));
		},

		AllActiveContactHistories(ctx, outerCompanyID = null) {
			const data = {};

			if (outerCompanyID) {
				data.outer_company_id = outerCompanyID;
			}

			return axiosIns
				.post('/v1/contact/history/active', data)
				.then(response => ctx.commit('SET_CONTACT_HISTORY', response.data))
				.catch(err => console.log(err));
		},
	},

	// strict: JSON.parse(process.env.VUE_APP_DEBUG_MODE),
});
