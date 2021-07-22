<template>
	<div>
		<!-- {{ currentOuterCompany }} -->
		<!-- {{ $store.state.contactPeople }} -->

		<b-row v-if="currentOuterCompany">
			<b-col md="5">
				<b-row>
					<b-col cols="12">
						<!-- OuterCompany Detail -->
						<b-card>
							<b-row>
								<b-col cols="12" xl="4">
									<div class="d-flex">
										<b-avatar size="105" class="badge-minimal" rounded>
											<feather-icon icon="HelpCircleIcon" size="50" />
										</b-avatar>

										<div class="d-flex flex-column justify-content-between ml-1">
											<div>
												<h4 class="mb-0">
													{{ currentOuterCompany.name }}
												</h4>

												<span class="card-text">
													{{ currentOuterCompany.email }}
												</span>
											</div>

											<!-- <div class="d-flex">
								<b-button variant="outline-primary">
									რედაქტირება
								</b-button>

								<b-button variant="outline-danger" class="ml-1">
									წაშლა
								</b-button>
							</div> -->
										</div>
									</div>
								</b-col>

								<b-col xl="8">
									<b-row>
										<b-col md="12" class="d-flex justify-content-center">
											<table>
												<tr>
													<th class="pb-50">
														<feather-icon icon="UserIcon" class="mr-75" />
														<span class="font-weight-bold">იურიდიული სახელწოდება</span>
													</th>
													<td class="pb-50 pl-1">
														{{ currentOuterCompany.legal_name }}
													</td>
												</tr>
												<tr>
													<th class="pb-50">
														<feather-icon icon="UserIcon" class="mr-75" />
														<span class="font-weight-bold">საკონტაკტო ნომერი</span>
													</th>
													<td class="pb-50 pl-1">
														{{ currentOuterCompany.phone }}
													</td>
												</tr>
												<tr>
													<th class="pb-50">
														<feather-icon icon="UserIcon" class="mr-75" />
														<span class="font-weight-bold">მისამართი</span>
													</th>
													<td class="pb-50 pl-1">
														{{ currentOuterCompany.address }}
													</td>
												</tr>
												<tr>
													<th class="pb-50">
														<feather-icon icon="UserIcon" class="mr-75" />
														<span class="font-weight-bold">საიდენტიფიკაციო კოდი</span>
													</th>
													<td class="pb-50 pl-1">
														{{ currentOuterCompany.id_code }}
													</td>
												</tr>
												<tr>
													<th class="pb-50">
														<feather-icon icon="UserIcon" class="mr-75" />
														<span class="font-weight-bold">დღგ.</span>
													</th>
													<td class="pb-50 pl-1">
														{{ currentOuterCompany.vat_type === 1 ? 'კი' : 'არა' }}
													</td>
												</tr>
												<tr>
													<th class="pb-50">
														<feather-icon icon="UserIcon" class="mr-75" />
														<span class="font-weight-bold">კომპანიის ტიპი</span>
													</th>
													<td class="pb-50 pl-1">
														{{ constants.company_type[currentOuterCompany.company_type] }}
													</td>
												</tr>
											</table>
										</b-col>
									</b-row>
								</b-col>
							</b-row>
						</b-card>
					</b-col>

					<b-col cols="12">
						<ContactFormsTimeline />
					</b-col>
				</b-row>
			</b-col>

			<b-col md="7">
				<b-row>
					<b-col cols="12">
						<ContactPeople :currentOuterCompanyId="currentOuterCompany.id" />
					</b-col>
				</b-row>
			</b-col>
		</b-row>
	</div>
</template>

<script>
//! load people and history after these are loaded with ocmputed property

import ContactPeople from '@/layouts/components/outerCompany/ContactPeople.vue';
import ContactFormsTimeline from '@/layouts/components/outerCompany/ContactFormsTimeline.vue';
import constants from '@/libs/constants';

export default {
	name: 'Outer_Company_Detail',

	components: {
		ContactPeople,
		ContactFormsTimeline,
	},

	data: () => ({
		constants,
		currentOuterCompany: null,
	}),

	mounted() {
		this.$store.dispatch('AllActiveOuterCompany');
		this.$store.dispatch('AllActiveInnerCompany');
		this.$store.dispatch('AllActiveUsers');
	},

	watch: {
		'$store.state.OuterCompany': {
			handler() {
				this.currentOuterCompany = this.$store.state.OuterCompany[this.$route.params.id];
			},

			immediate: true,
		},
	},
};
</script>

<!--
	<b-col xl="8">
							<b-row>
								<b-col md="6">
									<table>
										<tr>
											<th class="pb-50">
												<feather-icon icon="UserIcon" class="mr-75" />
												<span class="font-weight-bold">იურიდიული სახელწოდება</span>
											</th>
											<td class="pb-50 pl-1">
												{{ currentOuterCompany.legal_name }}
											</td>
										</tr>
										<tr>
											<th class="pb-50">
												<feather-icon icon="UserIcon" class="mr-75" />
												<span class="font-weight-bold">საკონტაკტო ნომერი</span>
											</th>
											<td class="pb-50 pl-1">
												{{ currentOuterCompany.phone }}
											</td>
										</tr>
										<tr>
											<th class="pb-50">
												<feather-icon icon="UserIcon" class="mr-75" />
												<span class="font-weight-bold">მისამართი</span>
											</th>
											<td class="pb-50 pl-1">
												{{ currentOuterCompany.address }}
											</td>
										</tr>
									</table>
								</b-col>

								<b-col md="6">
									<table>
										<tr>
											<th class="pb-50">
												<feather-icon icon="UserIcon" class="mr-75" />
												<span class="font-weight-bold">საიდენტიფიკაციო კოდი</span>
											</th>
											<td class="pb-50 pl-1">
												{{ currentOuterCompany.id_code }}
											</td>
										</tr>
										<tr>
											<th class="pb-50">
												<feather-icon icon="UserIcon" class="mr-75" />
												<span class="font-weight-bold">დღგ.</span>
											</th>
											<td class="pb-50 pl-1">
												{{ currentOuterCompany.vat_type === 1 ? 'კი' : 'არა' }}
											</td>
										</tr>
										<tr>
											<th class="pb-50">
												<feather-icon icon="UserIcon" class="mr-75" />
												<span class="font-weight-bold">კომპანიის ტიპი</span>
											</th>
											<td class="pb-50 pl-1">
												{{ constants.company_type[currentOuterCompany.company_type] }}
											</td>
										</tr>
									</table>
								</b-col>
							</b-row>
						</b-col>
-->
