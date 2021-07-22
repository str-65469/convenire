<template>
	<div class="navbar-container d-flex content align-items-center">
		<!-- Nav Menu Toggler For Mobile-->
		<ul class="nav navbar-nav d-xl-none">
			<li class="nav-item">
				<b-link class="nav-link" @click="toggleVerticalMenuActive">
					<feather-icon icon="MenuIcon" size="21" />
				</b-link>
			</li>
		</ul>

		<div class="bookmark-wrapper align-items-center flex-grow-1 d-none d-lg-flex">
			<dark-Toggler class="d-none d-lg-block" />
		</div>

		<!-- <b-button @click="store">see $store</b-button>
		<b-button variant="primary" @click="user">see user</b-button>
		<b-button variant="danger" @click="test">test</b-button> -->

		<!-- User -->
		<b-navbar-nav class="nav align-items-center ml-auto">
			<b-nav-item-dropdown
				right
				toggle-class="d-flex align-items-center dropdown-user-link"
				class="dropdown-user"
			>
				<template #button-content>
					<div class="d-sm-flex d-none user-nav">
						<p class="user-name font-weight-bolder mb-0">
							{{ userName }}
						</p>

						<span class="user-status" v-if="Object.values($store.state.currentPosition).length">
							{{ $store.state.currentPosition.title }}
						</span>
					</div>

					<!-- <b-avatar
						size="40"
						variant="light-primary"
						badge
						:src="require('@/assets/images/avatars/13-small.png')"
						class="badge-minimal"
						badge-variant="success"
					/> -->

					<b-avatar size="40" badge class="badge-minimal" badge-variant="success">
						<feather-icon icon="UserIcon" />
					</b-avatar>
				</template>

				<b-dropdown-item link-class="d-flex align-items-center" @click="profile()">
					<feather-icon size="16" icon="UserIcon" class="mr-50" />

					<span>პროფილი</span>
				</b-dropdown-item>

				<b-dropdown-item @click="logout()" link-class="d-flex align-items-center">
					<feather-icon size="16" icon="LogOutIcon" class="mr-50" />
					<span>გასვლა</span>
				</b-dropdown-item>
			</b-nav-item-dropdown>
		</b-navbar-nav>
	</div>
</template>

<script>
import DarkToggler from '@core/layouts/components/app-navbar/components/DarkToggler.vue';

export default {
	components: {
		DarkToggler,
	},
	props: {
		toggleVerticalMenuActive: {
			type: Function,
			default: () => {},
		},
	},
	methods: {
		store() {
			console.log({ ...this.$store.state });
		},
		user() {
			console.log({ ...this.$store.state.user });
		},
		test() {
			this.$http
				.post('/test')
				.then(res => console.log(res))
				.catch(err => console.log(err));
		},

		profile() {
			this.$router.push({ name: 'profile' }).catch(() => {});
		},

		async logout() {
			await this.$store.dispatch('logout');
			localStorage.removeItem('jwttoken');

			this.$router.push({ name: 'login' }).catch(() => {});
		},
	},

	computed: {
		userName() {
			return this.$store.state.user.details.name;
		},
	},
};
</script>
