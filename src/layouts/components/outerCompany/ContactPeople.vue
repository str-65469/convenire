<template>
	<b-card>
		<Table
			:fields="fields"
			:items="Object.values($store.state.contactPeople)"
			:callBack="callBack"
			:actions="actions"
			:AddingModal="true"
			:isPlucIcon="true"
		/>

		<b-modal
			id="contact-people"
			:no-close-on-backdrop="true"
			size="lg"
			hide-footer
			title="დაამატეთ გარე კომპანიის საკონტაქტო პირი"
		>
			<ContactPersonForm :OldFromData="FormData" :callback="create" :errorMessage="errorMessage" />
		</b-modal>
	</b-card>
</template>

<script>
import Table from '@/layouts/components/Table';
import ContactPersonForm from '@/layouts/components/forms/ContactPersonForm';
import Swal from 'sweetalert2';
import constants from '@/libs/constants';

export default {
	name: 'Outer_Company_Contact_People',

	props: {
		currentOuterCompanyId: {
			type: Number,
			required: true,
		},
	},

	components: {
		Table,
		ContactPersonForm,
	},

	data: () => ({
		FormData: null,
		errorMessage: '',
		fields: [
			{ key: 'name', label: 'სახელი', sortable: true },
			{ key: 'surname', label: 'გვარი', sortable: true, formatter: val => val ?? 'არ ფიქსირდება' },
			{ key: 'phone', label: 'ტელეფონი', sortable: true },
			{ key: 'email', label: 'ელ.ფოსტა', sortable: true, formatter: val => val ?? 'არ ფიქსირდება' },
			{
				key: 'position',
				label: 'პოზიცია',
				sortable: true,
				formatter: id => constants.contactPeoplePositions[id] ?? 'არ ფიქსირდება',
			},
			{ key: 'actions', label: 'მოქმედებები' },
		],
		actions: [
			{ slug: 'edit', title: 'რედაქტირება' },
			{ slug: 'delete', title: 'წაშლა' },
		],
	}),

	created() {
		this.$store.dispatch('AllActiveContactPeople', this.currentOuterCompanyId, this.currentOuterCompanyId);
	},

	methods: {
		AddingModal() {
			this.clearForm();
			this.$bvModal.show('contact-people');
		},

		callBack(Select = null, method = null) {
			if (Select && method) {
				this[method](Select);
			}
		},

		create(Select) {
			// create data
			if (!Select['id']) {
				this.retrieve(
					'/v1/contact/people/create',
					{ ...Select, outer_company_id: this.currentOuterCompanyId },
					'საკონტაქტო პიროვნება წარმატებით დაემატა'
				);
			}
			// update data
			else {
				this.retrieve('/v1/contact/people/update', Select, 'საკონტაქტო პიროვნება წარმატებით დარედაქტირდა');
			}
		},

		edit(Select) {
			this.FormData = Select;
			this.$bvModal.show('contact-people');
		},

		delete(Select) {
			Swal.fire({
				title: 'დარწმუნებული ხართ რომ გსურთ წაშლა',
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
						'/v1/contact/people/delete',
						{ id: Select.id },
						'საკონტაქტო პიროვნება წარმატებით წაიშალა'
					);
				}
			});
		},

		retrieve(url, data, successMessage) {
			this.$http
				.post(url, data)
				.then(() => {
					this.$store.dispatch('AllActiveContactPeople', this.currentOuterCompanyId);
					this.$bvModal.hide('contact-people');

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
			this.errorMessage = '';
			this.FormData = null;
		},
	},
};
</script>
