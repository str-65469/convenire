<template>
	<div>
		<Table
			:callBack="callBack"
			:fields="fields"
			:items="Object.values($store.state.users)"
			:actions="actions"
			:AddingModal="true"
		/>

		<b-button v-b-modal.modal-xl class="hidden" data-backdrop="static" ref="addModalButton" variant="primary" />

		<b-modal id="modal-xl" :no-close-on-backdrop="true" size="xl" hide-footer title="მომხმარებლის დამატება">
			<UserAddingForm :OldFromData="FormData" :callback="create" :errorMessage="errorMessage" />
		</b-modal>
	</div>
</template>

<script>
import Table from '@/layouts/components/Table';
import UserAddingForm from '@/layouts/components/forms/UserAddingForm';
import Swal from 'sweetalert2';

export default {
	components: {
		Table,
		UserAddingForm,
		Swal,
	},

	data: () => ({
		fields: [
			{ key: 'id', label: 'იდენთიფიკატორი', sortable: true },
			{ key: 'name', label: 'სახელი', sortable: true },
			{ key: 'lastname', label: 'გვარი', sortable: true },
			{ key: 'email', label: 'ელ.ფოსტა', sortable: true },
			{ key: 'phone', label: 'ტელეფონი', sortable: true },
			{
				key: 'birth_date',
				label: 'დაბადების თარიღი',
				sortable: true,
				formatter: val => new Date(val).toLocaleDateString(),
			},
			{
				key: 'positions',
				label: 'პოზიციები',
				sortable: true,
				formatter: arr => arr.reduce((acc, el) => (acc += el.title + ', '), '').slice(0, -2),
			},
			{ key: 'actions', label: 'Actions' },
		],
		actions: [
			{ slug: 'view', title: 'ნახვა' },
			{ slug: 'edit', title: 'რედაქტირება' },
			{ slug: 'delete', title: 'წაშლა' },
		],

		FormData: null,
		errorMessage: '',
	}),

	created() {
		this.$store.dispatch('AllActiveUsers');
		this.$store.dispatch('AllActivePosition');
	},

	methods: {
		callBack(Select = null, method = null) {
			if (Select && method) {
				this[method](Select);
			}
		},

		AddingModal() {
			this.FormData = null;
			this.$refs.addModalButton.click();
		},

		view(Select) {
			// named route
			this.$router.push({ name: 'user', params: { id: Select.id } });
		},

		edit(Select) {
			console.log(Select);
			this.FormData = Select;
			this.$refs.addModalButton.click();
		},

		delete(Select) {
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
					this.retrieve('/v1/user/delete', { id: Select.id }, 'მომხმარებელი წარმატებით წაიშალა');
				}
			});
		},

		create(data) {
			if (data.id) {
				this.retrieve('/v1/user/update', data, 'მომხმარებელი წარმატებით დარედაქტირდა');
			} else {
				this.retrieve('v1/user/register', data, 'მომხმარებელი წარმატებით დაემატა');
			}

			this.clearForm();
		},

		retrieve(url, data, successMessage) {
			this.$http
				.post(url, data)
				.then(() => {
					this.$store.dispatch('AllActiveUsers');
					this.$bvModal.hide('modal-xl');

					Swal.fire({
						icon: 'success',
						title: successMessage,
						timer: 3000,
					});
				})
				.catch(error => {
					let message = 'რაღაც შეცდომა მოხდა';

					if (error.response.data && error.response.data.message) {
						message = error.response.data.message;
					}

					Swal.fire({
						title: message,
						icon: 'error',

						confirmButtonText: `დახურვა`,
						confirmButtonColor: 'red',
					});
				});
		},

		clearForm() {
			this.FormData = null;
			this.errorMessage = null;
		},

		removeErrorMessage() {
			this.errorMessage = '';
		},
	},
};
</script>
