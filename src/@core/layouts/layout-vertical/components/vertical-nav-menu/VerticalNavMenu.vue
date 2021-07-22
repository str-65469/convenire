<template>
	<div
		class="main-menu menu-fixed menu-accordion menu-shadow"
		:class="[
			{
				expanded: !isVerticalMenuCollapsed || (isVerticalMenuCollapsed && isMouseHovered),
			},
			skin === 'semi-dark' ? 'menu-dark' : 'menu-light',
		]"
		@mouseenter="updateMouseHovered(true)"
		@mouseleave="updateMouseHovered(false)"
	>
		<!-- main menu header-->
		<div class="navbar-header expanded">
			<slot
				name="header"
				:toggleVerticalMenuActive="toggleVerticalMenuActive"
				:toggleCollapsed="toggleCollapsed"
				:collapseTogglerIcon="collapseTogglerIcon"
			>
				<ul class="nav navbar-nav flex-row">
					<!-- Logo & Text -->
					<li class="nav-item mr-auto">
						<b-link class="navbar-brand" to="/">
							<span class="brand-logo">
								<b-img :src="appLogoImage" alt="logo" />
							</span>
							<h2 class="brand-text">
								{{ appName }}
							</h2>
						</b-link>
					</li>

					<!-- Toggler Button -->
					<li class="nav-item nav-toggle">
						<b-link class="nav-link modern-nav-toggle">
							<feather-icon
								icon="XIcon"
								size="20"
								class="d-block d-xl-none"
								@click="toggleVerticalMenuActive"
							/>
							<feather-icon
								:icon="collapseTogglerIconFeather"
								size="20"
								class="d-none d-xl-block collapse-toggle-icon"
								@click="toggleCollapsed"
							/>
						</b-link>
					</li>
				</ul>
			</slot>
		</div>
		<!-- / main menu header-->

		<!-- Shadow -->
		<div :class="{ 'd-block': shallShadowBottom }" class="shadow-bottom" />

		<!-- main menu content-->
		<vue-perfect-scrollbar
			:settings="perfectScrollbarSettings"
			class="main-menu-content scroll-area"
			tagname="ul"
			@ps-scroll-y="
				evt => {
					shallShadowBottom = evt.srcElement.scrollTop > 0;
				}
			"
		>
			<!-- vertical routes -->
			<vertical-nav-menu-items
				v-if="permissionNavMenuItems"
				:items="permissionNavMenuItems"
				class="navigation navigation-main"
			/>
			<!-- <vertical-nav-menu-items :items="navMenuItems" class="navigation navigation-main" /> -->
		</vue-perfect-scrollbar>
	</div>
</template>

<script>
import { BLink, BImg } from 'bootstrap-vue';
import { provide, computed, ref, onMounted, watch } from '@vue/composition-api';
import { $themeConfig } from '@themeConfig';
import VuePerfectScrollbar from 'vue-perfect-scrollbar';
import useAppConfig from '@core/app-config/useAppConfig';
import VerticalNavMenuItems from './components/vertical-nav-menu-items/VerticalNavMenuItems.vue';
import useVerticalNavMenu from './useVerticalNavMenu';
import store from '@/store/index';

// vertical tabs
import navMenuItems from '@/navigation/vertical';

export default {
	components: {
		VuePerfectScrollbar,
		VerticalNavMenuItems,
		BLink,
		BImg,
	},
	props: {
		isVerticalMenuActive: {
			type: Boolean,
			required: true,
		},
		toggleVerticalMenuActive: {
			type: Function,
			required: true,
		},
	},
	setup(props) {
		const permissionNavMenuItems = ref(null);

		if (!Object.values(store.state.user).length) {
			store.dispatch('SetUser').catch(() => {});
		}

		watch(
			() => store.state.user,
			user => {
				permissionNavMenuItems.value = navMenuItems.filter(el =>
					user.active_permission.includes(el.id)
				);
			},
			{ deep: true, immediate: true }
		);

		const {
			isMouseHovered,
			isVerticalMenuCollapsed,
			collapseTogglerIcon,
			toggleCollapsed,
			updateMouseHovered,
		} = useVerticalNavMenu(props);

		const { skin } = useAppConfig();

		// Shadow bottom is UI specific and can be removed by user => It's not in `useVerticalNavMenu`
		const shallShadowBottom = ref(false);

		provide('isMouseHovered', isMouseHovered);

		const perfectScrollbarSettings = {
			maxScrollbarLength: 60,
			wheelPropagation: false,
		};

		const collapseTogglerIconFeather = computed(() =>
			collapseTogglerIcon.value === 'unpinned' ? 'CircleIcon' : 'DiscIcon'
		);

		// App Name
		const { appName, appLogoImage } = $themeConfig.app;

		return {
			// vertical routes
			// navMenuItems,
			permissionNavMenuItems,

			perfectScrollbarSettings,
			isVerticalMenuCollapsed,
			collapseTogglerIcon,
			toggleCollapsed,
			isMouseHovered,
			updateMouseHovered,
			collapseTogglerIconFeather,

			// Shadow Bottom
			shallShadowBottom,

			// Skin
			skin,

			// App Name
			appName,
			appLogoImage,
		};
	},
};
</script>

<style lang="scss">
@import '~@core/scss/base/core/menu/menu-types/vertical-menu.scss';
</style>
