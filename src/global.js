import Vue from 'vue';
import FeatherIcon from '@core/components/feather-icon/FeatherIcon.vue';
import vSelect from 'vue-select';

// Global registration of components
Vue.component(FeatherIcon.name, FeatherIcon);
Vue.component('v-select', vSelect);

// Global filters
Vue.filter('capitalize', value => {
	if (!value) {
		return '';
	}

	value = value.toString();
	return value.charAt(0).toUpperCase() + value.slice(1);
});

// global scss
import '@core/scss/vue/libs/vue-select.scss';
