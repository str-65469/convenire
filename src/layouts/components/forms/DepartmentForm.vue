<template>
	<validation-observer ref="simpleRules">
		<b-form>
			<b-row>
				<b-col md="6">
					<b-form-group>
						<label>
							დეპარტამენტის სახელი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="სახელი" rules="required">
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
					<label>კომპანიები</label>

					<validation-provider #default="{ errors }" name="კომპანიები" rules="required">
						<b-form-select v-model="FormData.company_id" :options="companies" />
						<small class="text-danger">{{ errors[0] }}</small>
					</validation-provider>
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
			</b-row>
		</b-form>
	</validation-observer>
</template>

<script>
import { ValidationProvider, ValidationObserver } from 'vee-validate';
import { required } from '@validations';

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
			company_id: '',
		},

		required,
	}),

	mounted() {
		if (this.OldFromData) {
			this.FormData = this.OldFromData;
		}
	},

	computed: {
		companies() {
			return Object.keys(this.$store.state.company).map(key => ({
				value: key,
				text: this.$store.state.company[key].name,
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
		'$store.state.company': {
			handler(companiesData) {
				if (Object.values(companiesData).length) this.FormData.company_id = Object.values(companiesData)[0].id;
			},
			immediate: true,
		},
	},
};
</script>
