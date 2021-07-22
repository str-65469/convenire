<template>
	<div>
		<Table
			:callBack="callback"
			:fields="fields"
			:items="Object.values($store.state.contactHistory)"
			:actions="actions"
			:AddingModal="true"
		/>

		<b-modal id="open_modal" size="lg" hide-footer title="კავშირის დამატება">
			<ContactForm
				:callback="create"
				:errorMessage="errorMessage"
				:OldFromData="FormData"
				:outerCompanyGeneral="true"
				:readOnly="showReadOnly"
			/>
		</b-modal>
	</div>
</template>

<script>
import Table from '@/layouts/components/Table.vue';
import store from '@/store/index';
import constants from '@/libs/constants';
import ContactForm from '@/layouts/components/forms/ContactForm.vue';
import Swal from 'sweetalert2';

export default {
	components: {
		Table,
		ContactForm,
	},

	data: () => ({
		fields: [
			{ key: 'title', label: 'სათაური', sortable: true },

			{
				key: 'company_id',
				label: 'კომპანია',
				sortable: true,
				formatter: id => {
					if (store.state.company[id]) return store.state.company[id].name;
				},
			},
			{
				key: 'outer_company_id',
				label: 'გარე კომპანია',
				sortable: true,
				formatter: id => {
					if (store.state.OuterCompany[id]) return store.state.OuterCompany[id].name;
				},
			},
			{
				key: 'contact_type',
				label: 'კონტაქტის ტიპი',
				sortable: true,
				formatter: id => constants.contactType[id],
			},
			{
				key: 'contact_status',
				label: 'კონტაქტის სტატუსი',
				sortable: true,
				formatter: id => constants.contactStatus[id],
			},
			{
				key: 'contact_person_id',
				label: 'საკონტაქტო პიროვნება',
				sortable: true,
				formatter: id => {
					if (store.state.contactPeople[id]) return store.state.contactPeople[id].name;
				},
			},

			{ key: 'contact_date', label: 'კონტაქტის თარიღი', sortable: true },
			{ key: 'actions', label: 'მოქმედებები' },
		],
		actions: [
			{ slug: 'view', title: 'ნახვა' },
			{ slug: 'delete', title: 'წაშლა' },
		],
		FormData: null,
		errorMessage: '',
		showReadOnly: false,
	}),

	created() {
		// main data
		this.$store.dispatch('AllActiveContactHistories');
		this.$store.dispatch('AllActiveContactPeople');

		// check
		this.$store.dispatch('AllActiveInnerCompany');
		this.$store.dispatch('AllActiveOuterCompany');
	},

	methods: {
		callback(Select = null, method = null) {
			this[method](Select);
		},

		AddingModal() {
			this.errorMessage = '';
			this.FormData = null;
			this.showReadOnly = false;
			this.$bvModal.show('open_modal');
		},

		async create(Select) {
			const resp = await this.retrieve(
				'/v1/contact/history/create',
				Select,
				'საკონტაქტო ისტორია წარმატებით დაემატა'
			);

			if (Select.files && Select.files.length) {
				for (let file of Select.files) {
					const formData = new FormData();
					formData.append('file', file);
					formData.append('contact_histories_id', resp.id);

					await this.retrieve('/v1/contact/history/create/file', formData, '', true);
				}

				this.$store.dispatch('AllActiveContactHistories');
			}
		},

		view(Select) {
			this.FormData = Select;
			this.showReadOnly = true;
			this.$bvModal.show('open_modal');
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
					this.retrieve(
						'/v1/contact/history/delete',
						{ id: Select.id },
						'საკონტაქტო ისტორია წარმატებით წაიშალა'
					);
				}
			});
		},

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

					this.$bvModal.hide('open_modal');

					if (res && res.data) {
						return res.data;
					}
				})
				.catch(error => {
					if (error.response.data && error.response.data.message) {
						this.errorMessage = error.response.data.message;
					}
				});
		},
	},
};
</script>
