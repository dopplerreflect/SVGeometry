<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(),
		updated_at: new Date()
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TEMPLATE {
				& circle {
					stroke: white;
					fill: none;
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
</DopplerSvg>
