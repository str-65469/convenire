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

						<validation-provider #default="{ errors }" name="კომპანიის სახელი" rules="required">
							<b-form-input v-model="FormData.name" placeholder="კომპანიის სახელი" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							იურიდიული სახელი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="იურიდიული სახელი" rules="required">
							<b-form-input v-model="FormData.legal_name" placeholder="იურიდიული სახელი" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							კომპანიის იდენტიფიკატორი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="კომპანიის იდენტიფიკატორი" rules="required">
							<b-form-input v-model="FormData.id_code" placeholder="კომპანიის იდენტიფიკატორი" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							საკონტაქტო ინფორმაცია
							<p class="d-inline text-danger">*</p>
						</label>
						<validation-provider #default="{ errors }" name="საკონტაქტო ინფორმაცია" rules="required">
							<b-form-input v-model="FormData.phone" placeholder="საკონტაქტო ინფორმაცია" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							მისამართი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="მისამართი" rules="required">
							<b-form-input v-model="FormData.address" placeholder="მისამართი" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							ელფოსტა
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="ელფოსტა" rules="email">
							<b-form-input v-model="FormData.email" placeholder="ელფოსტა" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							კომპანიის ტიპი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="კომპანიის ტიპი" rules="required">
							<b-form-select v-model="FormData.company_type" :options="company_types" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							დღგ
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="დღგ" rules="required">
							<b-form-select v-model="FormData.vat_type" :options="vat_types" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							შიდა კომპანია
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="შიდა კომპანია" rules="required">
							<b-form-select v-model="FormData.company_id" :options="companies" :disabled="!isAdmin" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col class="mt-2" v-if="errorMessage">
					<b-alert variant="danger" show class="m-0">
						<div class="alert-body">
							{{ errorMessage }}
						</div>
					</b-alert>
				</b-col>

				<b-col cols="12" class="d-flex justify-content-end mt-2">
					<b-button variant="primary" type="submit" @click.prevent="validationForm">
						გაგზავნა
					</b-button>
				</b-col>
				<!--end-->
			</b-row>
		</b-form>
	</validation-observer>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { required, email } from '@validations';
import constants from '@/libs/constants';

export default {
	components: {
		ValidationProvider,
		ValidationObserver,
	},

	props: {
		OldFromData: Object,
		callback: Function,
		errorMessage: String,
	},

	data: () => ({
		FormData: {
			name: '',
			legal_name: '',
			id_code: '',
			phone: '',
			address: '',
			email: '',
			vat_type: '',
			company_type: '',
			owner_id: '',
			company_id: '',
		},
		isAdmin: false,
		email,
		required,
	}),

	created() {
		if (this.OldFromData) {
			this.FormData = this.OldFromData;
		}

		if (!Object.values(this.$store.state.company).length) {
			this.$store.dispatch('AllActiveInnerCompany');
		}
	},

	computed: {
		vat_types() {
			return Object.keys(constants.vat_type).map(key => ({
				value: key,
				text: constants.vat_type[key],
			}));
		},

		company_types() {
			return Object.keys(constants.company_type).map(key => ({
				value: key,
				text: constants.company_type[key],
			}));
		},

		companies() {
			return Object.entries(this.$store.state.company).map(arr => ({
				value: arr[0],
				text: arr[1].name,
			}));
		},
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

	watch: {
		'$store.state.user.active_position': {
			handler(val) {
				if (val.company_id) {
					// is admin
					this.FormData.company_id = val.company_id;
				} else {
					this.isAdmin = true;
				}
			},
			immediate: true,
		},
	},
};
</script>
