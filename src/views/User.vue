<template>
	<div>
		<b-tabs
			vertical
			content-class="col-12 col-md-9 mt-1 mt-md-0"
			pills
			nav-wrapper-class="col-md-3 col-12"
			nav-class="nav-left"
		>
			<!-- general tab -->
			<b-tab :active="activeTab === 1" @click="setTab(1)">
				<template #title>
					<feather-icon icon="UserIcon" size="18" class="mr-50" />
					<span class="font-weight-bold">ზოგადი ინფორმაცია</span>
				</template>

				<b-card>
					<div class="d-flex">
						<div>
							<b-avatar style="min-width:4.2rem;height:100%" rounded variant="warning">
								<feather-icon icon="UserIcon" style="width:2rem;height:2rem" />
							</b-avatar>
						</div>

						<div class="ml-1">
							<b-button
								v-ripple.400="'rgba(255, 255, 255, 0.15)'"
								variant="info"
								size="sm"
								class="mb-75 mr-75"
								disabled
							>
								ატვირთვა
							</b-button>

							<b-card-text>დაშვებულია მხოლოდ JPG,JPEG ან PNG მაქსიმალური ზომა 800kB</b-card-text>
						</div>
					</div>

					<!-- form -->
					<b-form class="mt-2">
						<b-row v-if="currentUser">
							<b-col sm="6">
								<b-form-group label="სახელი">
									<b-form-input v-model="currentUser.name" placeholder="სახელი" />
								</b-form-group>
							</b-col>

							<b-col sm="6">
								<b-form-group label="გვარი">
									<b-form-input v-model="currentUser.lastname" placeholder="გვარი" />
								</b-form-group>
							</b-col>

							<b-col sm="6">
								<b-form-group label="ელ.ფოსტა">
									<b-form-input v-model="currentUser.email" placeholder="ელ.ფოსტა" />
								</b-form-group>
							</b-col>

							<b-col sm="6">
								<b-form-group label="ტელეფონის ნომერი">
									<b-form-input v-model="currentUser.phone" placeholder="ტელეფონის ნომერი" />
								</b-form-group>
							</b-col>

							<b-col cols="12">
								<b-button
									v-ripple.400="'rgba(255, 255, 255, 0.15)'"
									variant="primary"
									class="mt-2 mr-1"
									disabled
								>
									შენახვა
								</b-button>
							</b-col>
						</b-row>
					</b-form>
				</b-card>
			</b-tab>

			<!-- change password tab -->
			<b-tab :active="activeTab === 2" @click="setTab(2)">
				<template #title>
					<feather-icon icon="LockIcon" size="18" class="mr-50" />
					<span class="font-weight-bold">შეცვალეთ პაროლი</span>
				</template>

				<b-card>
					<b-form>
						<b-row v-if="currentUser">
							<b-col sm="6">
								<b-form-group>
									<div class="d-flex justify-content-between">
										<label for="current-password">მიმდინარე პაროლი</label>
									</div>
									<b-input-group class="input-group-merge">
										<b-form-input
											id="current-password"
											v-model="changePassword.current"
											class="form-control-merge"
											:type="passwordFieldType"
											placeholder="მიმდინარე პაროლი"
										/>
										<b-input-group-append is-text>
											<feather-icon
												class="cursor-pointer"
												:icon="passwordToggleIcon"
												@click="togglePasswordVisibility"
											/>
										</b-input-group-append>
									</b-input-group>
								</b-form-group>
							</b-col>

							<b-col sm="6">
								<b-form-group>
									<div class="d-flex justify-content-between">
										<label for="new-password">ახალი პაროლი</label>
									</div>
									<b-input-group class="input-group-merge">
										<b-form-input
											id="new-password"
											v-model="changePassword.new"
											class="form-control-merge"
											:type="passwordFieldType"
											placeholder="ახალი პაროლი"
										/>
										<b-input-group-append is-text>
											<feather-icon
												class="cursor-pointer"
												:icon="passwordToggleIcon"
												@click="togglePasswordVisibility"
											/>
										</b-input-group-append>
									</b-input-group>
								</b-form-group>
							</b-col>

							<b-col sm="6">
								<b-form-group>
									<div class="d-flex justify-content-between">
										<label for="repeat-password">გაიმეორეთ ახალი პაროლი</label>
									</div>
									<b-input-group class="input-group-merge">
										<b-form-input
											id="repeat-password"
											v-model="changePassword.repeat"
											class="form-control-merge"
											:type="passwordFieldType"
											placeholder="გაიმეორეთ ახალი პაროლი"
										/>
										<b-input-group-append is-text>
											<feather-icon
												class="cursor-pointer"
												:icon="passwordToggleIcon"
												@click="togglePasswordVisibility"
											/>
										</b-input-group-append>
									</b-input-group>
								</b-form-group>
							</b-col>

							<b-col sm="12" v-if="notValidPassword">
								<b-alert variant="danger" show class="m-0">
									<div class="alert-body m-0">
										<span>
											{{ notValidPassword }}
										</span>
									</div>
								</b-alert>
							</b-col>

							<b-col cols="12">
								<b-button
									v-ripple.400="'rgba(255, 255, 255, 0.15)'"
									variant="primary"
									class="mt-1"
									@click="updatePassword"
								>
									შეცვლა
								</b-button>
							</b-col>
						</b-row>
					</b-form>
				</b-card>
			</b-tab>

			<!-- position change -->
			<b-tab :active="activeTab === 3" @click="setTab(3)">
				<template #title>
					<feather-icon icon="UserIcon" size="18" class="mr-50" />
					<span class="font-weight-bold">პოზიციის შეცვლა</span>
				</template>

				<b-card>
					<v-select v-model="currentPosition" :options="availablePositions" />
					<!-- {{ availablePositions }}
					{{ currentPosition }} -->

					<b-button
						v-ripple.400="'rgba(255, 255, 255, 0.15)'"
						variant="primary"
						class="mt-2 mr-1"
						@click="changePosition()"
					>
						შენახვა
					</b-button>
				</b-card>
			</b-tab>
		</b-tabs>
	</div>
</template>

<script>
import { avatarText } from '@core/utils/filter';
import Table from '@/layouts/components/Table';
import Ripple from 'vue-ripple-directive';
import axiosIns from '@/libs/axios';
import Swal from 'sweetalert2';
import { togglePasswordVisibility } from '@core/mixins/ui/forms';
// temp

export default {
	name: 'OuterCompanyDetail',

	components: {
		Table,
		avatarText,
	},

	mixins: [togglePasswordVisibility],

	directives: {
		Ripple,
	},

	data: () => ({
		activeTab: 1,

		changePassword: {
			current: '',
			new: '',
			repeat: '',
		},

		currentPosition: '',
	}),

	created() {
		if (!Object.values(this.$store.state.users).length) {
			this.$store.dispatch('AllActiveUsers');
		}
	},

	methods: {
		setTab(tabID) {
			this.activeTab = tabID;
		},

		updatePassword() {
			axiosIns
				.post('/v1/user/password/update', this.changePassword)
				.then(() => {
					Swal.fire({
						icon: 'success',
						title: 'პაროლი წარმატებით განახლდა',
						timer: 3000,
					});

					this.$store.dispatch('SetUser').catch(() => {});
				})
				.catch(() => {
					Swal.fire({
						title: 'შეიტანეთ სწორი მონაცემები',
						icon: 'error',
						confirmButtonText: `დახურვა`,
						confirmButtonColor: 'red',
						timer: 3000,
					});
				})
				.finally(() => (this.changePassword = { current: '', new: '', repeat: '' }));
		},

		changePosition() {
			axiosIns
				.post('/v1/position/update/current', { id: this.currentPosition.value })
				.then(() => {
					Swal.fire({
						icon: 'success',
						title: 'აქტიური პოზიცია წარმატებით შეიცვალა',
						timer: 3000,
					});

					this.$store.dispatch('SetUser').catch(() => {});
				})
				.catch(() => {
					Swal.fire({
						title: 'აქტიური პოზიცია ვერ შეიცვალა',
						icon: 'error',
						confirmButtonText: `დახურვა`,
						confirmButtonColor: 'red',
						timer: 3000,
					});
				});
		},
	},

	computed: {
		currentUser() {
			return this.$store.state.users[this.$route.params.id];
		},

		availablePositions() {
			if (Object.values(this.$store.state.user).length) {
				return Object.entries(this.$store.state.user.user_positions).map(arr => ({
					value: arr[0],
					label: arr[1].title,
				}));
			}
		},

		notValidPassword() {
			const password = this.changePassword.new;
			if (password) {
				if (password.length < 6) {
					return 'პაროლი უნდა შეიცავდეს მინიმუმ 6 სიმბოლოს';
				}

				if (!/^[a-z0-9]+$/i.test(password)) {
					return 'პაროლი უნდა შეიცავდეს ლათინურ ასოებს [a-z, A-Z], პაროლი უნდა შეიცავდეს მინიმუმ 1 ციფრს';
				}

				if (!/[a-zA-Z]/.test(password)) {
					return 'პაროლი უნდა შეიცავდეს ლათინურ ასოებს [a-z, A-Z]';
				}

				if (!/\d/.test(password)) {
					return 'პაროლი უნდა შეიცავდეს მინიმუმ 1 ციფრს';
				}

				if (this.changePassword.new !== this.changePassword.repeat) {
					return 'გამეორებული პაროლი უნდა ემთხვეოდეს ახალ პაროლს';
				}
			}

			return '';
		},

		passwordToggleIcon() {
			return this.passwordFieldType === 'password' ? 'EyeIcon' : 'EyeOffIcon';
		},
	},

	watch: {
		'$store.state.user': {
			handler(user) {
				this.currentPosition = {
					value: user.active_position.id,
					label: user.active_position.title,
				};
			},
			immediate: true,
		},
	},
};
</script>

<!--
user salary
-->

<!-- User Stats -->
<!-- <div class="d-flex align-items-center mt-2">
<div class="d-flex align-items-center mr-2">
	<b-avatar variant="light-primary" rounded>
		<feather-icon icon="DollarSignIcon" size="18" />
	</b-avatar>
	<div class="ml-1">
		<h5 class="mb-0">
			1223₾
		</h5>
		<small>თვიური ჯამური გადასახადი</small>
	</div>
</div>

<div class="d-flex align-items-center">
	<b-avatar variant="light-success" rounded>
		<feather-icon icon="TrendingUpIcon" size="18" />
	</b-avatar>
	<div class="ml-1">
		<h5 class="mb-0">
			$99.87k
		</h5>
		<small>სულ შემოსავალი</small>
	</div>
</div>
</div> -->
