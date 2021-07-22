<template>
	<div>
		<!-- User Interface controls -->
		<b-row>
			<!-- სორტირება -->
			<b-col xl="6">
				<b-form-group>
					<b-input-group size="md">
						<b-form-select id="sort-by-select" v-model="sortBy" :options="sortOptions" class="w-25">
							<template #first>
								<option value="">სორტირება</option>
							</template>
						</b-form-select>

						<b-form-select v-model="sortDesc" :disabled="!sortBy">
							<option :value="false">ზრდადობა</option>
							<option :value="true">კლებადობა</option>
						</b-form-select>
					</b-input-group>
				</b-form-group>
			</b-col>

			<!-- გასუფთავება -->
			<b-col :xl="AddingModal ? 5 : 6">
				<b-form-group>
					<b-input-group size="md">
						<b-form-input
							id="filter-input"
							v-model="filter"
							type="search"
							placeholder="ჩაწერეთ გასაფილტრად"
						/>

						<b-input-group-append>
							<b-button :disabled="!filter" @click="filter = ''">
								გასუფთავება
							</b-button>
						</b-input-group-append>
					</b-input-group>
				</b-form-group>
			</b-col>
			<!-- class="w-100 d-flex justify-content-center align-items-center" -->

			<!-- დამატების მოდალი -->
			<b-col v-if="AddingModal" xl="1" class="d-flex align-items-start">
				<b-button
					variant="primary"
					size="md"
					@click="localCallBack(1, 'AddingModal')"
					class="w-100 d-flex justify-content-center align-items-center"
				>
					<FeatherIcon v-if="isPlucIcon" icon="PlusIcon" style="min-width:3rem" />
					<template v-else>დამატება</template>
				</b-button>
			</b-col>
		</b-row>

		<!--
			<div class="table-responsive">
				<b-table
					table-class="text-nowrap"
					responsive
					:items="items"
					:fields="fields"
					:current-page="currentPage"
					:per-page="perPage"
					:filter="filter"
					:filter-included-fields="filterOn"
					:sort-by.sync="sortBy"
					:sort-desc.sync="sortDesc"
					:sort-direction="sortDirection"
					stacked="md"
					show-empty
					@filtered="onFiltered"
				>
					<template #cell(actions)="row">
						<b-dropdown
							v-if="Array.isArray(actions)"
							text=""
							variant="flat-primary"
							class="my-1"
							menu-class="w-100"
							id="dropdown-1"
						>
							<template #button-content>
								<span>მოქმედება</span>
							</template>

							<b-dropdown-item
								v-for="action in actions"
								@click="localCallBack(row.item, action.slug)"
								:key="Math.random() + action.title"
							>
								{{ action.title }}
							</b-dropdown-item>
						</b-dropdown>

						<b-button v-else class="my-1" variant="flat-primary" @click="localCallBack(row.item, actions.slug)">
							{{ actions.title }}
						</b-button>
					</template>
				</b-table>
			</div>
		-->

		<b-table
			:items="items"
			:fields="fields"
			:current-page="currentPage"
			:per-page="perPage"
			:filter="filter"
			:filter-included-fields="filterOn"
			:sort-by.sync="sortBy"
			:sort-desc.sync="sortDesc"
			:sort-direction="sortDirection"
			class="w-100"
			stacked="xl"
			show-empty
			@filtered="onFiltered"
		>
			<template #cell(actions)="row">
				<b-dropdown
					v-if="Array.isArray(actions)"
					text=""
					variant="flat-primary"
					class="my-1"
					menu-class="w-100"
					id="dropdown-1"
				>
					<template #button-content>
						<span>მოქმედება</span>
					</template>

					<b-dropdown-item
						v-for="action in actions"
						@click="localCallBack(row.item, action.slug)"
						:key="Math.random() + action.title"
					>
						{{ action.title }}
					</b-dropdown-item>
				</b-dropdown>

				<b-button v-else class="my-1" variant="flat-primary" @click="localCallBack(row.item, actions.slug)">
					{{ actions.title }}
				</b-button>
			</template>
		</b-table>

		<!-- Pagination -->
		<div class="d-flex justify-content-center" v-if="totalRows > perPage">
			<b-pagination
				v-model="currentPage"
				:total-rows="totalRows"
				:per-page="perPage"
				align="fill"
				size="sm"
				class="my-0 mt-2 col-3"
			/>
		</div>

		<!-- Info modal -->
		<b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="resetInfoModal">
			<pre>{{ infoModal.content }}</pre>
		</b-modal>
	</div>
</template>

<script>
export default {
	props: {
		items: Array,
		fields: Array,
		callBack: Function,
		AddingModal: Boolean,
		addIcon: {
			default: false,
			type: Boolean,
		},
		actions: {
			value: [Array, Object],
		},
		isPlucIcon: {
			default: false,
			type: Boolean,
		},
	},

	computed: {
		sortOptions() {
			// Create an options list from our fields
			return this.fields.filter(f => f.sortable).map(f => ({ text: f.label, value: f.key }));
		},
	},

	data: () => ({
		totalRows: 1,
		currentPage: 1,
		perPage: 5,
		pageOptions: [5, 10, 15, { value: 100, text: 'Show a lot' }],
		sortBy: '',
		sortDesc: true,
		sortDirection: 'asc',
		filter: null,
		filterOn: [],
		infoModal: {
			id: 'info-modal',
			title: '',
			content: '',
		},
	}),

	mounted() {
		// Set the initial number of items
		this.totalRows = this.items.length;
	},

	methods: {
		localCallBack(Select, method) {
			this.callBack(Select, method);
		},

		info(item, index, button) {
			this.infoModal.title = `Row index: ${index}`;
			this.infoModal.content = JSON.stringify(item, null, 2);
			this.$root.$emit('bv::show::modal', this.infoModal.id, button);
		},

		resetInfoModal() {
			this.infoModal.title = '';
			this.infoModal.content = '';
		},

		onFiltered(filteredItems) {
			// Trigger pagination to update the number of buttons/pages due to filtering
			this.totalRows = filteredItems.length;
			this.currentPage = 1;
		},
	},
	watch: {
		items: {
			handler() {
				this.totalRows = this.items.length;
			},
		},
	},
};
</script>

<!-- {{ $store.state['app/posts'] }} -->

<!-- label="სორტირება"
label-cols-sm="2"
label-align-sm="left"
label-size="sm" 
-->

<!-- label="გაფილტრვა"
label-for="filter-input"
label-align-sm="left"
label-cols-sm="2"
label-size="sm" -->

<!-- Pagination -->
<!-- <div class="col-lg-1 text-right">
<b-form-select id="per-page-select" v-model="perPage" :options="pageOptions"></b-form-select>
</div> -->
