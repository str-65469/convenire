<template>
	<div>
		<!-- {{ selectedDepartmentID }}
		-
		{{ selectedDepartmentName }}
		-
		{{ selectedCompanyID }}
		-
		{{ selectedCompanyName }} -->
		<!-- 
			webapp.crm.salesapp 
			webapp.crm.salesapp.123
			-->

		<!-- [{{ selectedCompanyID }}- {{ selectedCompanyName }}- {{ selectedDepartmentID }}- {{ selectedDepartmentName }}-
		{{ FormData }}] -->

		<b-row class="mt-1 mb-3">
			<b-col>
				<!-- primary -->
				<b-dropdown id="dropdown-1" :text="selectedCompanyName" variant="outline-primary">
					<template v-for="comp in $store.state.company">
						<b-dropdown-item @click="setCompany(comp.id)" :key="comp.id">
							{{ comp.name }}
						</b-dropdown-item>
					</template>
				</b-dropdown>

				<b-button
					v-b-modal.modal-xl
					class="btn-icon ml-2"
					variant="outline-primary"
					data-backdrop="static"
					ref="addModalButton"
					@click="clearForm()"
				>
					დეპარტამენტის დამატება
				</b-button>
			</b-col>
		</b-row>

		<b-row>
			<b-col lg="3">
				<b-card no-body>
					<b-card-header>
						<div v-if="selectedDepartmentName" class="w-100 d-flex justify-content-between">
							<h1 class="m-0">{{ selectedDepartmentName }}</h1>

							<b-dropdown variant="flat-primary" size="sm">
								<template #button-content>
									<feather-icon icon="Edit2Icon" />
								</template>

								<b-dropdown-item
									v-for="action in actions"
									@click="
										action.slug === 'edit'
											? edit(selectedDepartmentID)
											: destroy(selectedDepartmentID)
									"
									:key="action.slug"
								>
									{{ action.title }}
								</b-dropdown-item>
							</b-dropdown>
						</div>

						<h1 class="m-0" v-else>აირჩიეთ დეპარტამენტი</h1>
					</b-card-header>

					<b-list-group>
						<b-list-group-item
							button
							v-for="pos in $store.state.department[selectedCompanyID]"
							:key="pos.id"
							@click="setDepartment(pos.id)"
							class="d-flex justify-content-between align-items-center pointer"
						>
							<span>{{ pos.name }}</span>
						</b-list-group-item>
					</b-list-group>
				</b-card>
			</b-col>

			<b-col lg="9" v-if="currentDepartmentPeople">
				<Table :fields="fields" :items="currentDepartmentPeople" />
			</b-col>
		</b-row>

		<!-- Modal for adding and editing department -->
		<b-modal id="modal-xl" :no-close-on-backdrop="true" size="xl" hide-footer title="დეპარტამენტის დამატება">
			<DepartmentForm :callback="create" :errorMessage="errorMessage" :OldFromData="FormData" />
		</b-modal>

		<!-- End -->
	</div>
</template>

<script>
import DepartmentForm from '@/layouts/components/forms/DepartmentForm.vue';
import Swal from 'sweetalert2';
import Table from '@/layouts/components/Table.vue';
import axiosIns from '@/libs/axios';

export default {
	name: 'Departments',
	components: {
		DepartmentForm,
		Table,
	},

	data: () => ({
		selectedCompanyID: null,
		selectedCompanyName: null,
		selectedDepartmentID: null,
		selectedDepartmentName: null,
		errorMessage: '',
		FormData: null,

		actions: [
			{ slug: 'edit', title: 'რედაქტირება' },
			{ slug: 'delete', title: 'წაშლა' },
		],

		fields: [
			{ key: 'id', label: 'იდენთიფიკატორი', sortable: true },
			{ key: 'name', label: 'სახელი', sortable: true },
			{ key: 'lastname', label: 'გვარი', sortable: true },
			{ key: 'email', label: 'ელ.ფოსტა', sortable: true },
			{ key: 'phone', label: 'ტელ.ნომერი', sortable: true },
		],

		currentDepartmentPeople: null,
	}),

	mounted() {
		// dispatch companies and departments
		this.$store.dispatch('AllActiveInnerCompany');
		this.$store.dispatch('AllActiveDepartment');
	},

	methods: {
		edit(id) {
			this.FormData = {
				name: this.selectedDepartmentName,
				company_id: this.selectedCompanyID,
				id,
			};

			this.$bvModal.show('modal-xl');
		},

		destroy(id) {
			Swal.fire({
				title: 'დარწმუნებული ხართ რომ გსურთ წაშალოთ დეპარტამენტი',
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
					this.retrieve('/v1/department/delete', { id }, 'დეპარტამენტი წარმატებით წაიშალა');
				}
			});
		},

		setCompany(id) {
			this.selectedCompanyID = id;
			this.selectedCompanyName = this.$store.state.company[id].name;
			this.selectedDepartmentName = null;
		},

		setDepartment(id) {
			this.selectedDepartmentID = id;
			this.selectedDepartmentName = this.$store.state.department[this.selectedCompanyID].find(el => {
				return el.id == id;
			}).name;

			axiosIns
				.post('/v1/department/all/people', { id })
				.then(res => {
					this.currentDepartmentPeople = res.data;
					console.log(res);
				})
				.catch(err => {
					console.log(err);
				});
		},

		create(data) {
			console.log(data);
			if (data.id) {
				this.retrieve('/v1/department/update', data, 'დეპარტამენტი წარმატებით დარედაქტირდა');
			} else {
				this.retrieve('/v1/department/create', data, 'დეპარტამენტი წარმატებით დაემატა');
			}

			this.clearForm();
		},

		retrieve(url, data, successMessage) {
			this.$http
				.post(url, data)
				.then(() => {
					this.$store.dispatch('AllActiveDepartment');
					this.$bvModal.hide('modal-xl');

					Swal.fire({
						icon: 'success',
						title: successMessage,
						timer: 3000,
					});
				})
				.catch(error => {
					if (error.response.data && error.response.data.message) {
						this.errorMessage = error.response.data.message;
					}
				});
		},

		clearForm() {
			// this.FormData = null;
			this.FormData = { company_id: this.selectedCompanyID };
			this.errorMessage = null;
		},

		removeErrorMessage() {
			this.errorMessage = '';
		},
	},

	watch: {
		'$store.state.company': {
			handler(data) {
				if (Object.values(data).length) {
					const id = Object.keys(data)[0];

					this.selectedCompanyID = id;
					this.selectedCompanyName = this.$store.state.company[id].name;
				}
			},
		},

		'$store.state.department': {
			handler(data) {
				console.log(data);
			},
		},
	},
};
</script>
