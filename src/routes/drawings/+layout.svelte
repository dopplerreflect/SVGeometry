<script lang>
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	/** @type {import('./$types').LayoutData } */
	export let data;
	$: drawingIndex = data.drawings.findIndex((d) => d.name === data.title);
	function handleKeyDown(e) {
		if (e.ctrlKey) return;
		switch (e.key) {
			case 'ArrowLeft':
				drawingIndex > 0 &&
					goto(`/drawings/${data.drawings[drawingIndex - 1].name}`, { replaceState: true });
				break;
			case 'ArrowRight':
				drawingIndex < data.drawings.length - 1 &&
					goto(`/drawings/${data.drawings[drawingIndex + 1].name}`, { replaceState: true });
				break;
			case 'Escape':
				goto('/');
				break;
			case 's':
				goto(`/source/${data.drawings[drawingIndex].name}`);
				break;
		}
	}
	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	});
</script>

<svelte:head>
	<title>SVGeometry - {data.title}</title>
</svelte:head>

<div id="container">
	<div class="item">
		<a href="/">
			<slot />
		</a>
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		background-color: black;
	}
	:global(::-webkit-scrollbar) {
		display: none;
	}
	#container {
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		background-color: oklch(0.2 0.05 240);
	}
	.item {
		width: 100vmin;
		height: 100vmin;
		background-image: url(/checkerboard.svg);
	}
</style>
