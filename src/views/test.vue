<template>
	<div>
		<h1>Sidebar test</h1>

		<b-button v-ripple.400="'rgba(113, 102, 240, 0.15)'" v-b-toggle.sidebar variant="outline-primary">
			Toggle Sidebar Without Backdrop
		</b-button>

		<b-sidebar id="sidebar" bg-variant="dark" text-variant="light" shadow backdrop right>
			<h1>Hello</h1>
			<template #footer>
				logout
			</template>
		</b-sidebar>
	</div>
</template>

<script>
import { BButton, BSidebar, VBToggle } from 'bootstrap-vue';
import Ripple from 'vue-ripple-directive';

export default {
	components: {
		BButton,
		BSidebar,
	},
	directives: {
		'b-toggle': VBToggle,
		Ripple,
	},
};
</script>
