<template>
	<div>
		<b-button
			v-b-modal.modal-xl
			class="hidden"
			data-backdrop="static"
			ref="addModalButton"
			variant="primary"
			@click="removeErrorMessage()"
		/>

		<b-modal id="modal-xl" :no-close-on-backdrop="true" size="xl" hide-footer title="პოზიციის დამატება">
			<PositionForm :callback="create" :OldFromData="FormData" :errorMessage="errorMessage" />
		</b-modal>

		<Table
			:fields="fields"
			:items="Object.values($store.state.position)"
			:actions="actions"
			:AddingModal="true"
			:callBack="callBack"
		/>
	</div>
</template>

<script>
import Table from '@/layouts/components/Table.vue';
import store from '@/store/index';
import Swal from 'sweetalert2';
import PositionForm from '@/layouts/components/forms/PositionForm.vue';

export default {
	name: 'Position',
	components: {
		Table,
		PositionForm,
	},

	data: () => ({
		FormData: null,

		// for ui
		errorMessage: null,
		actions: [
			{ slug: 'edit', title: 'რედაქტირება' },
			{ slug: 'delete', title: 'წაშლა' },
		],
		fields: [
			{ key: 'id', label: 'იდენთიფიკატორი', sortable: true },
			{ key: 'title', label: 'სათაური', sortable: true },
			{
				key: 'company_id',
				label: 'კომპანია',
				sortable: true,
				formatter: id => store.state.company[id]?.name ?? 'არ ფიქსირდება',
			},
			{
				key: 'department_id',
				label: 'დეპარტამენტი',
				sortable: true,
				formatter: id => store.state.departmentWithoutCompanies[id]?.name ?? 'არ ფიქსირდება',
			},
			{
				key: 'parent_id',
				label: 'ექვემდებარება',
				sortable: true,
				formatter: id => store.state.departmentWithoutCompanies[id]?.name ?? 'არ ექვემდებარება',
			},
			{ key: 'actions', label: 'მოქმედებები' },
		],
	}),

	created() {
		this.$store.dispatch('AllActivePosition');
		this.$store.dispatch('AllActiveInnerCompany');
		this.$store.dispatch('AllActiveDepartment');
		this.$store.dispatch('AllActiveDepartmentWithoutCompanies');
	},

	methods: {
		callBack(Select = null, method = null) {
			this[method](Select);
		},

		AddingModal() {
			this.$refs.addModalButton.click();
			this.FormData = null;
			this.removeErrorMessage();
		},

		create(data) {
			if (data.id) {
				this.retrieve('/v1/position/update', data, 'პოზიცია წარმატებით დარედაქტირდა');
			} else {
				this.retrieve('/v1/position/create', data, 'პოზიცია წარმატებით დაემატა');
			}

			this.FormData = null;
			this.removeErrorMessage();
		},

		view(data) {
			console.log('view');
			console.log(data);
		},

		edit(data) {
			// create is used for edit
			// this method just opens create model !

			if (data.parent_id && !data.department_id) {
				data = { ...data, department_detail: 1 };
			}

			if (!data.parent_id && data.department_id) {
				data = { ...data, department_detail: 2 };
			}

			if (data.parent_id) {
				data.department_id = data.parent_id;
			}

			this.FormData = data;
			this.$bvModal.show('modal-xl');
		},

		showAnotherSwal(data) {
			Swal.fire({
				title: 'აღნიშნული ქმედებით წაიშლება თანამშრომლ(ებ)ის ბოლო პოზიცია, ნამდვილად გსურთ წაშლა ? ',
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
					this.retrieve('/v1/position/delete', { id: data.id }, 'პოზიცია წარმატებით წაიშალა');
				}
			});
		},

		delete(data) {
			Swal.fire({
				title: 'დარწმუნებული ხართ რომ გსურთ წაშალოთ პოზიცია',
				showDenyButton: true,
				icon: 'info',
				confirmButtonText: 'წაშლა',
				denyButtonText: 'უარყოფა',
				customClass: {
					confirmButton: 'btn btn-primary',
					denyButton: 'btn btn-danger',
				},
			})
				.then(result => {
					if (result.isConfirmed) {
						this.$http.post('/v1/position/delete', { id: data.id, check_pos: true }).then(res => {
							if (res.data && res.data.hasOwnProperty('safe')) {
								this.$bvModal.hide('modal-xl');
								this.showAnotherSwal(data);
							} else {
								this.$store.dispatch('AllActivePosition');
								this.$bvModal.hide('modal-xl');

								Swal.fire({
									icon: 'success',
									title: 'პოზიცია წარმატებით წაიშალა',
									timer: 3000,
								});
							}
						});
					}
				})
				.catch(error => {
					if (error.response.data && error.response.data.message) {
						this.errorMessage = error.response.data.message;
					}
				});
		},

		retrieve(url, data, successMessage) {
			return this.$http
				.post(url, data)
				.then(res => {
					this.$store.dispatch('AllActivePosition');
					this.$bvModal.hide('modal-xl');

					Swal.fire({
						icon: 'success',
						title: successMessage,
						timer: 3000,
					});

					return res.data;
				})
				.catch(error => {
					if (error.response.data && error.response.data.message) {
						this.errorMessage = error.response.data.message;
					}
				});
		},

		removeErrorMessage() {
			this.errorMessage = '';
		},
	},
};
</script>
