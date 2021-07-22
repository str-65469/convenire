import Vue from 'vue';
import axios from 'axios';

const axiosIns = axios.create({
	baseURL: process.env.VUE_APP_SERVER_BASE_URL,
	headers: { 'Content-Type': 'application/json' },
});

// Add a request interceptor
axiosIns.interceptors.request.use(config => {
	const token = localStorage.getItem('jwttoken');
	config.headers.Authorization = `Bearer ${token}`;

	return config;
});

Vue.prototype.$http = axiosIns;

export default axiosIns;
