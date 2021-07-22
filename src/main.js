import Vue from 'vue';
import { ToastPlugin, ModalPlugin } from 'bootstrap-vue';
import VueCompositionAPI from '@vue/composition-api';

import router from './router';
import store from './store';
import App from './App.vue';

// Global Components
import './global';

// 3rd party plugins
import '@/libs/portal-vue';
import '@/libs/toastification';

// BSV Plugin Registration
Vue.use(ToastPlugin);
Vue.use(ModalPlugin);

// Composition API
Vue.use(VueCompositionAPI);

// import core styles
require('@core/scss/core.scss');

// import assets styles
require('@/assets/scss/style.scss');

Vue.config.productionTip = false;

/*
 ! before adding new route or new page 
 ! change permissions config in backend 
*/

new Vue({
	router,
	store,
	render: h => h(App),
}).$mount('#app');
