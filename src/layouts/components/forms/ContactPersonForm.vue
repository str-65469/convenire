<template>
	<validation-observer ref="simpleRules">
		<b-form>
			<b-row>
				<b-col md="6">
					<b-form-group>
						<label>
							სახელი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="სახელი" rules="required">
							<b-form-input v-model="FormData.name" placeholder="სახელი" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>გვარი</label>

						<b-form-input v-model="FormData.surname" placeholder="გვარი" />
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							ტელეფონის ნომერი
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="ტელეფონის ნომერი" rules="required">
							<b-form-input v-model="FormData.phone" placeholder="ტელეფონის ნომერი" type="number" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>პოზიცია</label>

						<b-form-select v-model="FormData.position" :options="positions" placeholder="პოზიცია" />
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>ელ.ფოსტა</label>

						<!-- Only email correctness not existence :d -->
						<validation-provider #default="{ errors }" name="ელ.ფოსტა" rules="email">
							<b-form-input v-model="FormData.email" placeholder="ელ.ფოსტა" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
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
			surname: '',
			phone: '',
			email: '',
			position: '',
		},

		// other
		email,
		required,
	}),

	mounted() {
		if (this.OldFromData) {
			this.FormData = this.OldFromData;
		}
	},

	computed: {
		positions() {
			return [
				...Object.entries(constants.contactPeoplePositions).map(arr => ({ value: arr[0], text: arr[1] })),
				{ value: '', text: 'არცერთი' },
			];
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
};
</script>
