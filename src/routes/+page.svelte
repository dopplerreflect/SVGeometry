<script lang="ts">
	const modules = import.meta.glob('./drawings/**/+page.svelte', { eager: true });

	const drawings = Object.entries(modules)
		.slice(0, 3)
		.map(([path, module]: any) => ({
			name: path.replace(/.*drawings\//, '').replace(/\/\+page\.svelte/, ''),
			module: module
		}))
		.filter((d) => {
			let metadata: DrawingMetadata = d.module.metadata;
			return metadata;
		});
</script>

<svelte:head>
	<title>SVGeometry</title>
</svelte:head>

<div id="background">
	<div id="container">
		{#each drawings as drawing}
			<div class="item">
				<a href={`/drawings/${drawing.name}`}>
					<svelte:component this={drawing.module.default} />
				</a>
			</div>
		{/each}
	</div>
</div>

<style>
	:global(body) {
		margin: 0;
		/* height: 100vh; */
	}
	:root {
		--rowLength: 3;
	}
	#background {
		height: 100vh;
		background-color: black;
	}
	#container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding: 10px;
		background-color: oklch(0.1 0.18 300);
	}
	.item {
		flex-basis: calc((100% - calc(var(--rowLength) * 10px)) / var(--rowLength));
		height: fit-content;
		justify-content: center;
		align-items: center;
		border: 1px solid oklch(0.5 0.18 200);
		background: url(/checkerboard.svg);
	}
	.item:hover {
		border: 1px solid oklch(0.75 0.18 200);
	}
</style>
