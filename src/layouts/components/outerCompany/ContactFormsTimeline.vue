<template>
	<b-card no-body>
		<b-card class="overflow-auto contact-item-timeline" style="max-height: 70vh;">
			<!-- Header -->
			<b-card-title class="d-flex justify-content-between align-items-center mb-3">
				ქმედებები

				<b-button variant="outline-primary" size="sm" @click="open()" data-backdrop="static">
					დამატება
				</b-button>
			</b-card-title>

			<!-- Histories -->
			<app-timeline v-if="Object.values($store.state.contactHistory).length">
				<app-timeline-item
					v-for="history in $store.state.contactHistory"
					:key="history.id"
					:variant="constants.contactStatusColors[history.contact_status]"
				>
					<!-- Title -->
					<div class="d-flex flex-sm-row flex-column flex-wrap justify-content-between mb-1">
						<div class="d-flex pointer">
							<h6
								class="font-weight-bolder m-0"
								v-b-tooltip.hover.top="constants.contactStatus[history.contact_status]"
							>
								{{ history.title }}
							</h6>

							<div class="c-ml-1">({{ constants.contactType[history.contact_type] }})</div>

							<div>
								<feather-icon
									icon="TrashIcon"
									class="pointer c-ml-1 text-danger"
									@click="destroy(history)"
								/>
								<feather-icon
									icon="EyeIcon"
									class="pointer c-ml-1 text-info"
									v-b-tooltip.hover.top="'დეტალური ნახვა'"
									@click="open(history, true)"
								/>
							</div>
						</div>

						<small class="text-muted">{{ history.contact_date }}</small>
					</div>

					<!-- Comment -->
					<p v-if="history.comment">{{ history.comment }}</p>
					<p v-else>არაა კომენტარი</p>

					<!-- Contact Person -->
					<template>
						<b-media class="mt-2" v-if="person(history.contact_person_id)">
							<template #aside>
								<b-avatar variant="info">
									<feather-icon icon="UserIcon" />
								</b-avatar>
							</template>

							<h6 class="d-flex align-items-center">
								<div v-if="person(history.contact_person_id)">
									{{ person(history.contact_person_id).name }}
								</div>

								<small
									class="text-info c-ml-1"
									v-if="person(history.contact_person_id).position !== null"
								>
									-
									{{ constants.contactPeoplePositions[person(history.contact_person_id).position] }}
								</small>
							</h6>

							<p v-if="$store.state.OuterCompany[history.outer_company_id]">
								{{ $store.state.OuterCompany[history.outer_company_id].name }}
							</p>
						</b-media>
					</template>
				</app-timeline-item>
			</app-timeline>
		</b-card>

		<!-- Add contact form modal -->
		<b-modal id="contactForm" :no-close-on-backdrop="true" size="lg" hide-footer title="კავშირის დამატება">
			<!-- if needsFilter is true then outers are general -->
			<ContactForm
				:callback="create"
				:outerCompanyId="currentOuterCompanyID"
				:errorMessage="errorMessage"
				:outerCompanyGeneral="needsFilter"
				:OldFromData="FormData"
				:readOnly="showReadOnly"
			/>
		</b-modal>
	</b-card>
</template>

<script>
import AppTimeline from '@core/components/app-timeline/AppTimeline.vue';
import AppTimelineItem from '@core/components/app-timeline/AppTimelineItem.vue';
import ContactForm from '@/layouts/components/forms/ContactForm.vue';
import Swal from 'sweetalert2';
import constants from '@/libs/constants';

export default {
	props: {
		outerCompanyID: {
			required: false,
			type: [Number, String],
		},
	},

	components: {
		AppTimeline,
		AppTimelineItem,
		ContactForm,
	},

	data: () => ({
		constants,
		errorMessage: '',
		currentOuterCompanyID: '',
		currentPage: 1,
		countPage: null,
		perPage: 5,

		FormData: null,
		showReadOnly: false,

		needsFilter: false,
	}),

	created() {
		this.loadData();
	},

	methods: {
		loadData() {
			// setting current outer company id
			const routeID = this.$route.params.id;
			this.currentOuterCompanyID = routeID ? parseInt(routeID) : this.outerCompanyID;

			// get contact histories
			if (routeID) {
				this.$store.dispatch('AllActiveContactHistories', this.currentOuterCompanyID);
			} else {
				this.needsFilter = true;
				this.$store.dispatch('AllActiveContactHistories');
			}

			// get all contact people
			if (!Object.values(this.$store.state.contactPeople).length) {
				this.$store.dispatch('AllActiveContactPeople');
			}
		},

		async create(Select) {
			if (Select.id) {
				Swal.fire({
					title: 'განახლება ჯერ ჯერობით ვერ მოხერხდება',
					icon: 'info',
					confirmButtonText: 'დახურვა',
					customClass: {
						confirmButton: 'btn btn-primary',
					},
				});
			}
			// upload files if exists
			else {
				const resp = await this.retrieve(
					'/v1/contact/history/create',
					Select,
					'საკონტაქტო ისტორია წარმატებით დაემატა'
				);

				const files = Select.files;
				if (files && files.length) {
					for (let file of files) {
						const formData = new FormData();
						formData.append('file', file);
						formData.append('contact_histories_id', resp.id);

						await this.retrieve('/v1/contact/history/create/file', formData, '', true);
					}

					this.$store.dispatch('AllActiveContactHistories', this.currentOuterCompanyID);
				}
			}

			this.errorMessage = null;
		},

		open(data = null, readonly = false) {
			this.FormData = data;
			this.showReadOnly = readonly;
			this.$bvModal.show('contactForm');
		},

		edit() {
			//TODo later needs to be done
			this.$bvModal.show('contactForm');
		},

		destroy(Select) {
			Swal.fire({
				title: 'დარწმუნებული ხართ რომ გსურთ წაშალოთ',
				showDenyButton: true,
				icon: 'info',
				confirmButtonText: 'წაშლა',
				denyButtonText: 'უარყოფა',
				customClass: {
					confirmButton: 'btn btn-primary',
					denyButton: 'btn btn-danger',
				},
			}).then(result => {
				if (result.isConfirmed) {
					this.retrieve(
						'/v1/contact/history/delete',
						{ id: Select.id },
						'საკონტაქტო ისტორია წარმატებით წაიშალა'
					);
				}
			});
		},

		// Helpers

		retrieve(url, data, successMessage, file = null) {
			let config = null;

			if (file) {
				config = {
					headers: {
						'Content-Type': 'multipart/form-data',
					},
				};
			}

			return this.$http
				.post(url, data, config)
				.then(res => {
					// show message only when file upload doesn't happens
					if (!file) {
						this.$store.dispatch('AllActiveContactHistories', this.currentOuterCompanyID);

						Swal.fire({
							icon: 'success',
							title: successMessage,
							timer: 3000,
						});
					}

					this.$bvModal.hide('contactForm');

					return res.data;
				})
				.catch(error => {
					if (error.response.data && error.response.data.message) {
						this.errorMessage = error.response.data.message;
					}
				});
		},

		person(id) {
			return this.$store.state.contactPeople[id];
		},
	},

	watch: {
		'$store.state.contactHistory': {
			handler(val) {
				this.countPage = Object.values(val).length;
			},
			immediate: true,
		},
	},
};
</script>
<!-- <feather-icon icon="Edit2Icon" class="pointer c-ml-1 text-primary" @click="edit" /> -->

<!--//TODO paginate on back and new page new request
		<b-pagination
			align="center"
			class="mt-2"
			v-model="currentPage"
			hide-goto-end-buttons
			:total-rows="countPage"
			:per-page="perPage"
			v-if="countPage && countPage > perPage && Object.values($store.state.contactHistory).length"
		/> -->

<!-- {{ currentPage }}
		{{ countPage }} -->
