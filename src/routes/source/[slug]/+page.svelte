<script>
	/** @type {import('./$types').PageData} */
	export let data;

	import { HighlightSvelte, LineNumbers } from 'svelte-highlight';
	import github from 'svelte-highlight/styles/github-dark';
</script>

<svelte:head>
	{@html github}
</svelte:head>

<HighlightSvelte code={data.source} let:highlighted>
	<LineNumbers {highlighted} />
</HighlightSvelte>

<style>
	:global(body) {
		margin: 0;
		background-color: black;
	}
</style>
