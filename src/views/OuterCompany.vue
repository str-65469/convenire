<template>
	<div>
		<Table
			:fields="fields"
			:items="Object.values($store.state.OuterCompany)"
			:callBack="callBack"
			:actions="actions"
			:AddingModal="true"
		/>

		<b-button v-b-modal.modal-xl class="hidden" data-backdrop="static" ref="addModalButton" variant="primary" />

		<b-modal id="modal-xl" :no-close-on-backdrop="true" size="lg" hide-footer title="გარე კომპანიის დამატება">
			<OuterCompanyForm :OldFromData="outerCompanyData" :callback="create" :errorMessage="errorMessage" />
		</b-modal>
	</div>
</template>

<script>
import Table from '@/layouts/components/Table';
import Swal from 'sweetalert2';
import OuterCompanyForm from '@/layouts/components/forms/OuterCompanyForm';
import constants from '@/libs/constants';

export default {
	components: {
		Table,
		OuterCompanyForm,
	},

	data: () => ({
		fields: [
			{ key: 'name', label: 'სახელი', sortable: true },
			{ key: 'legal_name', label: 'იურიდიული სახელწოდება', sortable: true },
			{ key: 'id_code', label: 'იდენტიფიკატორი', sortable: true },
			{ key: 'phone', label: 'საკონტაქტო ინფორმაცია', sortable: true },
			{ key: 'address', label: 'მისამართი', sortable: true },
			{ key: 'email', label: 'ელფოსტა', sortable: true },
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
			{ slug: 'view', title: 'ნახვა' },
			{ slug: 'edit', title: 'რედაქტირება' },
			{ slug: 'delete', title: 'წაშლა' },
		],

		outerCompanyData: null,
		errorMessage: '',
	}),

	created() {
		this.$store.dispatch('AllActiveOuterCompany');
	},

	methods: {
		callBack(Select = null, method = null) {
			if (Select && method) {
				this[method](Select);
			}
		},

		AddingModal() {
			this.outerCompanyData = null;
			this.removeErrorMessage();
			this.$refs.addModalButton.click();
		},

		create(data) {
			// create data
			if (!data['id']) {
				this.retrieve('/v1/outer_company/create', data, 'გარე კომპანია წარმატებით დაემატა');
			}
			// update data
			else {
				this.retrieve('/v1/outer_company/update', data, 'გარე კომპანია წარმატებით დარედაქტირდა');
			}
		},

		view(Select) {
			console.log(Select);
			this.$router.push('/outer_company/' + Select.id);
		},

		edit(data) {
			this.outerCompanyData = data;
			this.removeErrorMessage();
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
					this.retrieve('/v1/outer_company/delete', { id: Select.id }, 'გარე კომპანია წარმატებით წაიშალა');
				}
			});
		},

		retrieve(url, data, successMessage) {
			this.$http
				.post(url, data)
				.then(() => {
					this.$store.dispatch('AllActiveOuterCompany');
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
