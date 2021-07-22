<template>
	<!-- form -->
	<validation-observer ref="simpleRules">
		<b-form>
			<b-row>
				<b-col md="6">
					<b-form-group>
						<label>
							სათაური
							<p class="d-inline text-danger" v-if="!readOnly">*</p>
						</label>

						<validation-provider #default="{ errors }" name="სათაური" rules="required">
							<b-form-input v-if="readOnly" :value="FormData.title" />
							<b-form-input v-else v-model="FormData.title" placeholder="კონტაქტის სათაური" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							საკონტაქტო პირი
							<p class="d-inline text-danger" v-if="!readOnly">*</p>
						</label>

						<validation-provider #default="{ errors }" name="საკონტაქტო პირი" rules="required">
							<b-form-input
								v-if="readOnly"
								:value="contactPeople.find(el => el.value == FormData.contact_person_id).text"
							/>

							<b-form-select v-else v-model="FormData.contact_person_id" :options="contactPeople" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							კავშირის ტიპი
							<p class="d-inline text-danger" v-if="!readOnly">*</p>
						</label>
						<validation-provider #default="{ errors }" name="კავშირის ტიპი" rules="required">
							<b-form-input
								v-if="readOnly"
								:value="contactType.find(el => el.value == FormData.contact_type).text"
							/>

							<b-form-select v-else v-model="FormData.contact_type" :options="contactType" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							კავშირის სტატუსი
							<p class="d-inline text-danger" v-if="!readOnly">*</p>
						</label>
						<validation-provider #default="{ errors }" name="სტატუსი" rules="required">
							<b-form-input
								v-if="readOnly"
								:value="contactStatus.find(el => el.value == FormData.contact_status).text"
							/>

							<b-form-select v-else v-model="FormData.contact_status" :options="contactStatus" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							კონტაქტის თარიღი
							<p class="d-inline text-danger" v-if="!readOnly">*</p>
						</label>

						<validation-provider #default="{ errors }" name="კონტაქტის თარიღი" rules="required">
							<b-form-input v-if="readOnly" :value="FormData.contact_date" />

							<Flatpickr
								v-else
								v-model="FormData.contact_date"
								class="form-control"
								:config="constants.front.dateConfig"
							/>
							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6">
					<b-form-group>
						<label>
							კომპანია
							<p class="d-inline text-danger" v-if="!readOnly">*</p>
						</label>

						<validation-provider #default="{ errors }" name="კომპანიები" rules="required">
							<b-form-input
								v-if="readOnly"
								:value="companies.find(el => el.value == FormData.company_id).text"
							/>

							<b-form-select v-else v-model="FormData.company_id" :options="companies" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<b-col md="6" v-if="outerCompanyGeneral">
					<b-form-group>
						<label>
							გარე კომპანია
							<p class="d-inline text-danger" v-if="!readOnly">*</p>
						</label>

						<validation-provider #default="{ errors }" name="კომპანიები" rules="required">
							<b-form-input
								v-if="readOnly"
								:value="outerCompanies.find(el => el.value == FormData.outer_company_id).text"
							/>

							<b-form-select v-else v-model="FormData.outer_company_id" :options="outerCompanies" />

							<small class="text-danger">{{ errors[0] }}</small>
						</validation-provider>
					</b-form-group>
				</b-col>

				<!-- File Upload -->
				<b-col md="12" v-if="needsFilesent">
					<b-card class="border border-info">
						<b-form-group class="d-flex flex-column">
							<span class="small text-warning d-block">
								* დაშვებული ლიმიტი ფაილების ზომის 10 მბ, რაოდენობის 10
							</span>

							<label class="btn btn-primary mt-1">
								ატვირთეთ ფაილები
								<input class=" hidden" ref="files" type="file" @change="selectFiles" multiple />
							</label>

							<div class="files" v-if="Object.values(FormData.files).length">
								<b-alert variant="primary" show class="my-1">
									<div class="alert-body">ჯამში {{ fileSize.toFixed(2) }} მბ</div>
								</b-alert>

								<div
									v-for="(file, i) in FormData.files"
									:key="i"
									class="d-flex justify-content-between align-items-center"
								>
									{{ file.name }}
									<feather-icon
										icon="TrashIcon"
										class="pointer c-ml-1 text-danger"
										@click="removeFile(i)"
									/>
								</div>
							</div>

							<b-button
								variant="danger"
								size="sm"
								class="d-flex justify-content-between align-items-center mt-1"
								@click="clearFileInput()"
								v-if="Object.values(FormData.files).length"
							>
								გაწმენდა <feather-icon icon="TrashIcon" class="pointer c-ml-1" />
							</b-button>

							<b-alert variant="danger" show v-if="fileMessage" class="mt-1">
								<div class="alert-body">
									{{ fileMessage }}
								</div>
							</b-alert>
						</b-form-group>
					</b-card>
				</b-col>

				<b-col md="12">
					<b-form-group>
						<label>კავშირის აღწერა</label>

						<b-form-textarea
							v-if="readOnly"
							:value="FormData.comment"
							id="textarea-rows"
							placeholder="კავშირის აღწერა"
							rows="4"
						/>

						<b-form-textarea
							v-else
							v-model="FormData.comment"
							id="textarea-rows"
							placeholder="კავშირის აღწერა"
							rows="4"
						/>
					</b-form-group>
				</b-col>

				<!-- Readonly File -->
				<b-col md="12" class="my-1" v-if="readOnly && FormData.files && FormData.files.length">
					<b-form-group>
						<h4 class="d-flex align-items-center mb-1">
							გადაგზავნილი ფაილები

							<feather-icon
								icon="InfoIcon"
								class="pointer text-info c-ml-1"
								v-b-tooltip.hover.topright="'ფაილის ნახვა თუ გსურთ დააჭირეთ სათაურს'"
							/>
						</h4>
						<div
							v-for="file in FormData.files"
							:key="file.id + 'img'"
							class="pointer"
							@click="openLink(file.path)"
						>
							<!-- Img icon -->
							<feather-icon
								icon="ImageIcon"
								v-if="['png', 'jpg', 'jpeg'].includes(file.type)"
								class="text-primary mr-1"
							/>

							<!-- General icon -->
							<feather-icon icon="FileIcon" v-else class="c-ml-1 text-primary mr-1" />
							<span class="align-bottom">{{ file.title }}</span>
						</div>
					</b-form-group>
				</b-col>

				<!-- Error message -->
				<b-col class="mt-2" v-if="errorMessage">
					<b-alert variant="danger" show class="m-0">
						<div class="alert-body">
							{{ errorMessage }}
						</div>
					</b-alert>
				</b-col>

				<!-- Submit -->
				<b-col cols="12" v-if="!FormData.id" class="d-flex justify-content-between align-items-center">
					<b-form-checkbox v-model="needsFilesent" :value="true" class="custom-control-primary">
						მეილზე შეთავაზების გადაგზავნა
					</b-form-checkbox>

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
import flatpickr from 'vue-flatpickr-component';
import constants from '@/libs/constants';

export default {
	components: {
		ValidationProvider,
		ValidationObserver,
		Flatpickr: flatpickr,
	},

	props: {
		callback: Function,
		errorMessage: String,
		OldFromData: {
			required: false,
			type: [Object],
		},
		outerCompanyId: {
			required: false,
			type: [Number, String],
		},
		dispatchContactPeople: {
			default: false,
			type: Boolean,
		},
		outerCompanyGeneral: {
			default: false,
			type: Boolean,
		},
		readOnly: {
			default: false,
			type: Boolean,
		},
	},

	data: () => ({
		persons: [],

		FormData: {
			title: '',
			comment: '',
			contact_date: '',
			files: [],
			company_id: '',
			outer_company_id: '',
			contact_type: '',
			contact_status: '',
			contact_person_id: '',
		},

		needsFilesent: false,

		constants,
		fileMessage: '',
		fileSize: '',
		email,
		required,
	}),

	created() {
		if (this.OldFromData) {
			this.FormData = this.OldFromData;
		}

		if (this.outerCompanyId) {
			this.FormData.outer_company_id = this.outerCompanyId;
		}

		if (this.dispatchContactPeople) {
			this.$store.dispatch('AllActiveContactPeople', this.outerCompanyId);
		}

		if (this.outerCompanyGeneral && !Object.values(this.$store.state.OuterCompany).length) {
			// get all outer companies
			this.$store.dispatch('AllActiveOuterCompany');
		}
	},

	computed: {
		contactType() {
			return Object.entries(constants.contactType).map(arr => ({ value: arr[0], text: arr[1] }));
		},

		contactStatus() {
			return Object.entries(constants.contactStatus).map(arr => ({ value: arr[0], text: arr[1] }));
		},

		companies() {
			return Object.entries(this.$store.state.company).map(arr => ({
				value: arr[0],
				text: arr[1].name,
			}));
		},

		contactPeople() {
			return Object.entries(this.$store.state.contactPeople).map(arr => ({
				value: arr[0],
				text: arr[1].name,
			}));
		},

		outerCompanies() {
			return Object.entries(this.$store.state.OuterCompany).map(arr => ({
				value: arr[0],
				text: arr[1].name,
			}));
		},
	},

	methods: {
		selectFiles() {
			this.clearFileInput();

			const files = this.$refs.files.files;
			const final = [];
			const MAX_MB = 10;

			for (let i = 0; i < files.length; i++) {
				if (i > 9) {
					break;
				}
				const element = files[i];
				final.push(element);

				this.fileSize += element.size / 1024 / 1024; // MB
			}

			if (this.fileSize > MAX_MB) {
				this.fileMessage = `დაშვებული ლიმიტი ${MAX_MB} მბ-ია`;
				return;
			}

			this.FormData.files = final;
		},

		removeFile(index) {
			this.FormData.files = this.FormData.files.filter((el, i) => i !== index);
		},

		clearFileInput() {
			this.fileMessage = '';
			this.fileSize = 0;
			this.FormData.files = [];
		},

		validationForm() {
			this.$refs.simpleRules.validate().then(success => {
				if (success) {
					this.callback(this.FormData);
				}
			});
		},

		openLink(path) {
			window.open(process.env.VUE_APP_SERVER_URL + path);
		},
	},

	watch: {
		'$store.state.OuterCompany': {
			handler(val) {
				const outers = Object.values(val);

				if (outers.length) {
					this.currentOuterCompanyID = outers[0].id;
				}
			},
			immediate: true,
		},

		'$store.state.user': {
			handler(val) {
				if (val.active_position.company_id) {
					this.FormData.company_id = val.active_position.company_id;
				}
			},
			immediate: true,
		},
	},
};
</script>

<style lang="scss">
@import '@core/scss/vue/libs/vue-flatpicker.scss';
</style>
