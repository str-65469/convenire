<template>
	<!-- form -->
	<validation-observer ref="simpleRules">
		<b-form>
			<b-row>
				<b-col md="6">
					<b-form-group>
						<label>
							სახელი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="First Name" rules="required">
							<b-form-input
								v-model="FormData.name"
								:state="errors.length > 0 ? false : null"
								placeholder="სახელი"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							გვარი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="გვარი" rules="required">
							<b-form-input
								v-model="FormData.lastname"
								:state="errors.length > 0 ? false : null"
								placeholder="გვარი"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							ტელეფონი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="ტელეფონი" rules="required">
							<b-form-input
								v-model="FormData.phone"
								:state="errors.length > 0 ? false : null"
								placeholder="ტელეფონი"
								type="number"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							ელ.ფოსტა
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="ელ. ფოსტა" rules="required|email">
							<b-form-input
								v-model="FormData.email"
								:state="errors.length > 0 ? false : null"
								type="email"
								placeholder="ელ. ფოსტა"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>
				<!--       born-->

				<b-col md="4">
					<b-form-group>
						<label>
							დაბადების დღე
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="დაბადების დღე" rules="required">
							<b-form-group>
								<v-select
									v-model="FormData.birth_day"
									label="title"
									:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
									:options="dayOptions"
								/>
							</b-form-group>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="4">
					<b-form-group>
						<label>
							თვე
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="თვე" rules="required">
							<v-select
								v-model="FormData.birth_month"
								label="label"
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="monthOption"
							/>

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="4">
					<b-form-group>
						<label>
							წელი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="წელი" rules="required" type="number">
							<v-select
								v-model="FormData.birth_year"
								label="title"
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="yearOptions"
							/>

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="12">
					<b-form-group>
						<label>
							პოზიციები
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="პოზიციები" rules="required">
							<v-select
								v-model="FormData.positions"
								label="title"
								multiple
								:dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
								:options="Object.values($store.state.position)"
							/>

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col cols="12" class="mt-2">
					<Permissions
						v-if="Object.values(this.$store.state.generalPermissions).length"
						:actions="$store.state.generalPermissions.actions"
						:router_view="$store.state.generalPermissions.router_view"
						:activePermissions="FormData.permissions"
						@selected="FormData.permissions = $event"
					/>
				</b-col>

				<b-col cols="12" class="mt-2" v-if="errorMessage">
					<b-alert variant="danger" show class="m-0">
						<div class="alert-body">
							{{ errorMessage }}
						</div>
					</b-alert>
				</b-col>

				<b-col cols="12" class="d-flex justify-content-end">
					<b-button variant="primary" type="submit" @click.prevent="validationForm">
						გაგზავნა
					</b-button>
				</b-col>
			</b-row>
		</b-form>
	</validation-observer>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { required, email } from '@validations';
import Permissions from '@/layouts/components/Pemissions.vue';

export default {
	components: {
		ValidationProvider,
		ValidationObserver,
		Permissions,
	},
	props: {
		OldFromData: Object,
		callback: Function,
		errorMessage: String,
	},
	data() {
		return {
			FormData: {
				email: '',
				name: '',
				lastname: '',
				phone: '',
				birth_day: '',
				birth_month: '',
				birth_year: '',
				img_url: '',
				positions: [],
				permissions: [],
			},

			monthOption: [
				{ label: 'იანვარი', value: '1' },
				{ label: 'თებერვალი', value: '2' },
				{ label: 'მარტი', value: '3' },
				{ label: 'აპრილი', value: '4' },
				{ label: 'მაისი', value: '5' },
				{ label: 'ივნისი', value: '6' },
				{ label: 'ივლისი', value: '7' },
				{ label: 'აგვისტო', value: '8' },
				{ label: 'სექტემბერი', value: '9' },
				{ label: 'ოქტომებერი', value: '10' },
				{ label: 'ნოემბერი', value: '11' },
				{ label: 'დეკემბერი', value: '12' },
			],
			email,
			required,
		};
	},
	computed: {
		dayOptions: () => Array.from({ length: 31 }, (_, i) => i + 1),
		yearOptions: () => Array.from({ length: 65 }, (_, i) => i + new Date().getFullYear() - 65 - 16).reverse(),
	},
	created() {
		if (this.OldFromData) {
			this.FormData = this.OldFromData;
		}

		// if (!Object.values(this.$store.state.generalPermissions).length) {
		// 	this.$store.dispatch('PermissionsGeneral').catch(() => {});
		// }
	},
	methods: {
		validationForm() {
			this.$refs.simpleRules.validate().then(success => {
				if (success) {
					this.callback(this.FormData);
				}
			});
		},
	},
};
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-select.scss';
</style>
