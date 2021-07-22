<template>
	<b-card no-body class=" shadow-none">
		<!-- სათაური -->
		<b-card-title class="d-flex justify-content-between align-items-center">
			<h1>უფლებები</h1>

			<b-form-checkbox v-model="selectedAll" class="d-flex align-items-center custom-control-info">
				მონიშნე ყველა
			</b-form-checkbox>
		</b-card-title>

		<!-- გვერდების ნახვა -->
		<div class="mt-2">
			<h5 class="d-flex align-items-center">
				გვერდების ნახვა

				<b-form-checkbox
					v-model="selectedRouterViews"
					class="ml-1 d-flex align-items-center custom-control-info"
				/>
			</h5>

			<b-form-group>
				<b-row>
					<b-col md="4" class="pt-2" v-for="perm in generalRouterViews" :key="perm.id">
						<b-form-checkbox v-model="selected" :value="parseInt(perm.id)" inline>
							{{ perm.description }}
						</b-form-checkbox>
					</b-col>
				</b-row>
			</b-form-group>
		</div>

		<!-- მოქმედებები -->
		<div class="mt-2">
			<h5 class="d-flex align-items-center">
				მოქმედებები

				<b-form-checkbox
					v-model="selectedActions"
					variant="info"
					class="ml-1 d-flex align-items-center custom-control-info"
				/>
			</h5>

			<b-form-group>
				<b-row>
					<b-col md="4" class="pt-2" v-for="perm in generalActions" :key="perm.id">
						<b-form-checkbox v-model="selected" :value="parseInt(perm.id)" inline>
							{{ perm.description }}
						</b-form-checkbox>
					</b-col>
				</b-row>
			</b-form-group>
		</div>
	</b-card>
</template>

<script>
export default {
	name: 'test',
	props: {
		actions: {
			required: true,
			type: Object,
		},
		router_view: {
			required: true,
			type: Object,
		},
		activePermissions: {
			required: true,
			type: Array,
		},
	},

	data: () => ({
		selected: [],
		selectedAll: false,
		selectedRouterViews: false,
		selectedActions: false,

		allPermission: null,
		actionPermissions: null,
		routerPermissions: null,

		generalActions: null,
		generalRouterViews: null,
	}),

	created() {
		this.generalActions = this.actions;
		this.generalRouterViews = this.router_view;

		this.actionPermissions = Object.values(this.actions).map(el => parseInt(el.id));
		this.routerPermissions = Object.keys(this.router_view).map(id => parseInt(id));
		this.allPermission = [...this.actionPermissions, ...this.routerPermissions];

		if (this.activePermissions.length) {
			this.selected = this.activePermissions;
		}
	},

	watch: {
		selected() {
			this.selectedRouterViews = this.routerPermissions.every(el => this.selected.includes(el));
			this.selectedActions = this.actionPermissions.every(el => this.selected.includes(el));
			this.selectedAll = this.allPermission.every(el => this.selected.includes(el));
			this.$emit('selected', this.selected);
		},

		selectedAll() {
			if (this.selectedAll) {
				this.selected = this.allPermission;
			}

			if (!this.selectedAll && this.allPermission.every(el => this.selected.includes(el))) {
				this.selected = [];
			}
		},

		selectedRouterViews() {
			if (this.selectedRouterViews) {
				const old = this.selected.filter(id => !this.routerPermissions.includes(id));
				this.selected = [...old, ...this.routerPermissions];
			}

			if (!this.selectedRouterViews && this.routerPermissions.every(el => this.selected.includes(el))) {
				this.selected = this.selected.filter(id => !this.routerPermissions.includes(id));
			}
		},

		selectedActions() {
			if (this.selectedActions) {
				const old = this.selected.filter(id => !this.actionPermissions.includes(id));
				this.selected = [...old, ...this.actionPermissions];
			}

			if (!this.selectedActions && this.actionPermissions.every(el => this.selected.includes(el))) {
				this.selected = this.selected.filter(id => !this.actionPermissions.includes(id));
			}
		},
	},
};
</script>
