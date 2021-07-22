<template>
	<layout-vertical v-if="$store.state.user && Object.values($store.state.user).length">
		<!-- აქ რენდერდება ყველაფერი -->
		<router-view />

		<template #navbar="{ toggleVerticalMenuActive }">
			<navbar :toggle-vertical-menu-active="toggleVerticalMenuActive" />
		</template>
	</layout-vertical>
</template>

<script>
import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue';
import Navbar from '../components/Navbar.vue';
import ToastificationContent from '@core/components/toastification/ToastificationContent.vue';

export default {
	components: {
		LayoutVertical,
		Navbar,
	},
	created() {
		//! dispatch users and general permissions
		this.$store.dispatch('SetUser').catch(() => {});
		this.$store.dispatch('PermissionsGeneral').catch(() => {});
	},

	methods: {
		showPasswordToastAndSetDate(localName) {
			const date = new Date();
			localStorage.setItem(localName, date.getDay());

			this.$toast(
				{
					component: ToastificationContent,
					props: {
						title: 'გაფრთხილება',
						icon: 'BellIcon',
						text:
							'👋 სასურველია პაროლის შეცვლა თქვენივე უსაფრთხოებისთვის, შეცვლისათვის შედით პროფილის გვერდზე',
						variant: 'warning',
					},
				},
				{ timeout: 5000 }
			);
		},
	},

	watch: {
		'$store.state.user.details.password_changed': {
			handler(val) {
				const localName = 'pwrg';

				// if auto generated password is not changed then popup will emerge
				if (!val) {
					// if null set date and show toast
					if (localStorage.getItem(localName) === null) {
						this.showPasswordToastAndSetDate(localName);
					} else {
						const lastDate = JSON.parse(localStorage.getItem(localName));

						// show date once in a day until user changes password
						if (lastDate !== new Date().getDay()) {
							this.showPasswordToastAndSetDate(localName);
						}
					}
				} else {
					if (localStorage.getItem(localName) !== null) {
						localStorage.removeItem(localName);
					}
				}
			},
		},
	},
};
</script>

<!--
<template>
	<layout-vertical>
		<router-view />

		<template #navbar="{ toggleVerticalMenuActive }">
			<navbar :toggle-vertical-menu-active="toggleVerticalMenuActive" />
		</template>

		<app-customizer v-if="showCustomizer" slot="customizer" />
	</layout-vertical>
</template>

<script>
import LayoutVertical from '@core/layouts/layout-vertical/LayoutVertical.vue';
import Navbar from '../components/Navbar.vue';
import AppCustomizer from '@core/layouts/components/app-customizer/AppCustomizer.vue';
import { $themeConfig } from '@themeConfig';

export default {
	components: {
		AppCustomizer,
		LayoutVertical,
		Navbar,
	},
	data() {
		return {
			showCustomizer: $themeConfig.layout.customizer,
		};
	},
};
</script>
-->
