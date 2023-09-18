<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { HighlightSvelte } from 'svelte-highlight';
	import github from 'svelte-highlight/styles/github-dark';
</script>

<svelte:head>
	{@html github}
</svelte:head>

<HighlightSvelte code={data.source} />

<style>
	:global(body) {
		margin: 0;
	}
</style>
