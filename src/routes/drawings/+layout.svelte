<script>
	/** @type {import('./$types').LayoutData } */
	export let data;
</script>

<svelte:head>
	<title>SVGeometry - {data.title}</title>
</svelte:head>

<div id="container">
	<div class="item">
		<slot />
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
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
