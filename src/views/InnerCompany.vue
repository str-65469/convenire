<template>
	<div>
		<!-- User Interface controls -->
		<Table
			:fields="fields"
			:items="Object.values($store.state.company)"
			:callBack="callBack"
			:actions="actions"
			:AddingModal="true"
		/>

		<b-button
			v-b-modal.modal-xl
			class="hidden"
			data-backdrop="static"
			ref="addModalButton"
			variant="primary"
			@click="removeErrorMessage()"
		/>

		<b-modal id="modal-xl" :no-close-on-backdrop="true" size="xl" hide-footer title="კომპანიის დამატება">
			<InnerCompanyForm :OldFromData="innerCompanyData" :callback="create" :errorMessage="errorMessage" />
		</b-modal>
	</div>
</template>

<script>
import Table from '@/layouts/components/Table';
import InnerCompanyForm from '@/layouts/components/forms/InnerCompanyForm';
import Swal from 'sweetalert2';
import constants from '@/libs/constants';

export default {
	components: {
		Table,
		InnerCompanyForm,
	},

	data: () => ({
		fields: [
			{ key: 'name', label: 'სახელი', sortable: true },
			{ key: 'legal_name', label: 'იურიდიული სახელწოდება', sortable: true },
			{ key: 'id_code', label: 'იდენტიფიკატორი', sortable: true },
			{ key: 'phone', label: 'საკონტაქტო ინფორმაცია', sortable: true },
			{ key: 'address', label: 'მისამართი', sortable: true },
			{ key: 'email', label: 'ელფოსტა', sortable: true },

			{ key: 'account_number', label: 'ანგარიშის ნომერი', sortable: true },
			{ key: 'bank_code', label: 'ბანკის კოდი', sortable: true },
			{
				key: 'company_type',
				label: 'კომპანიის ტიპი',
				sortable: true,
				formatter: value => constants.company_type[value],
			},
			{
				key: 'vat_type',
				label: 'დღგ.',
				sortable: true,
				formatter: value => (value == 1 ? 'კი' : 'არა'),
			},
			{ key: 'actions', label: 'მოქმედებები' },
		],

		actions: [
			// { slug: 'view', title: 'ნახვა' },
			{ slug: 'edit', title: 'რედაქტირება' },
			{ slug: 'delete', title: 'წაშლა' },
		],

		innerCompanyData: null,
		errorMessage: '',
	}),

	created() {
		this.$store.dispatch('AllActiveInnerCompany');
	},

	methods: {
		callBack(Select = null, method = null) {
			this[method](Select);
		},

		AddingModal() {
			this.innerCompanyData = null;
			this.$refs.addModalButton.click();
		},

		create(data) {
			// create data
			if (!data['id']) {
				this.retrieve('/v1/inner_company/create', data, 'კომპანია წარმატებით დაემატა');
			}
			// update data
			else {
				this.retrieve('/v1/inner_company/update', data, 'კომპანია წარმატებით დარედაქტირდა');
			}
		},

		view(Select) {
			console.log(Select);
		},

		edit(data) {
			// create is used for edit
			// this method just opens create model !

			this.innerCompanyData = data;
			this.$bvModal.show('modal-xl');
		},

		delete(Select) {
			Swal.fire({
				title: 'დარწმუნებული ხართ რომ გსურთ წაშალოთ კომპანია',
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
					this.retrieve('/v1/inner_company/delete', { id: Select.id }, 'კომპანია წარმატებით წაიშალა');
				}
			});
		},

		retrieve(url, data, successMessage) {
			this.$http
				.post(url, data)
				.then(() => {
					this.$store.dispatch('AllActiveInnerCompany', true);
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

		removeErrorMessage() {
			this.errorMessage = '';
		},
	},
};
</script>
