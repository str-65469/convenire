<template>
	<validation-observer ref="simpleRules">
		<b-form>
			<b-row>
				<b-col md="6">
					<b-form-group>
						<label>
							პოზიციის სათაური
							<p class="d-inline text-danger">*</p>
						</label>

						<validation-provider #default="{ errors }" name="პოზიციის სათაური" rules="required">
							<b-form-input v-model="FormData.title" placeholder="პოზიციის სათაური" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<label>
						კომპანია
						<p class="d-inline text-danger">*</p>
					</label>

					<validation-provider #default="{ errors }" name="კომპანია" rules="required">
						<b-form-select v-model="FormData.company_id" :options="companies" />
						<small class="text-danger">{{ errors[0] }}</small>
					</validation-provider>
				</b-col>

				<b-col md="6">
					<label>
						დეპარტამენტი
						<p class="d-inline text-danger">*</p>
					</label>

					<b-form-select
						:disabled="!FormData.company_id"
						v-model="FormData.department_id"
						:options="departments"
					/>
				</b-col>

				<b-col md="6" v-if="FormData.department_id">
					<label>
						პოზიცის დაკონკრეტება
						<p class="d-inline text-danger">*</p>
					</label>

					<validation-provider #default="{ errors }" name="პოზიციის დაკონკრეტება" rules="required">
						<b-form-select v-model="FormData.department_detail" :options="departmentOptions" />
						<small class="text-danger">{{ errors[0] }}</small>
					</validation-provider>
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

				<!-- ssh root@139.59.143.158 -->

				<b-col cols="12" class="mt-2" v-if="errorMessage">
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

	data: () => ({
		FormData: {
			title: '',
			company_id: '',
			department_id: '',
			department_detail: '',
			permissions: [],
		},

		departmentOptions: [
			{ value: 1, text: 'ექვემდებარება' },
			{ value: 2, text: 'მართავს' },
		],

		required,
	}),

	created() {
		if (this.OldFromData) {
			this.FormData = Object.assign({}, this.OldFromData);
		}

		// if (!Object.values(this.$store.state.generalPermissions).length) {
		// 	this.$store.dispatch('PermissionsGeneral').catch(() => {});
		// }
	},

	computed: {
		companies() {
			return Object.values(this.$store.state.company).map(el => ({
				value: el.id,
				text: el.name,
			}));
		},

		departments() {
			const id = this.FormData.company_id;

			if (!this.$store.state.department[id]) return [{ value: '', text: 'არცერთი' }];

			if (id) {
				return [
					...this.$store.state.department[id].map(el => ({ value: el.id, text: el.name })),
					{ value: '', text: 'არცერთი' },
				];
			}
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
		'FormData.company_id': {
			handler() {
				this.FormData.department_id = '';
				this.FormData.department_detail = '';
			},
		},
	},
};
</script>
