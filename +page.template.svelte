<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: []
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
		</style>
	</defs>
	<Background {size} fill="none" />
</DopplerSvg>
