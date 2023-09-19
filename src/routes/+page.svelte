<script lang="ts">
	import { get } from 'svelte/store';
	import { drawingsStore } from '$lib/stores/drawingStore';

	const allDrawings = get(drawingsStore);
	const tags = ['', ...new Set([...allDrawings.map((d) => d.module.metadata.tags).flat()])].sort();
	allDrawings.sort((b, a) => a.module.metadata.created_at - b.module.metadata.created_at);

	let drawings = allDrawings;
	let tag = '';

	function setTag(event: Event) {
		const target = event.target as HTMLSelectElement;
		tag = target.value;
		drawings = tag ? allDrawings.filter((d) => d.module.metadata.tags.includes(tag)) : allDrawings;
	}
</script>

<svelte:head>
	<title>SVGeometry</title>
</svelte:head>

<div id="background">
	<div id="header">
		<select bind:value={tag} on:change={setTag}>
			{#each tags as tag}
				<option value={tag}>{tag}</option>
			{/each}
		</select>
	</div>
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
	p {
		color: white;
	}
	#background {
		height: 100vh;
		background-color: oklch(0.2 50% 300);
	}
	#header {
		height: 3em;
	}
	#container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding: 10px;
		background-color: oklch(0.1 50% 300);
	}
	.item {
		flex-basis: calc((100% - calc(var(--rowLength) * 10px)) / var(--rowLength));
		height: fit-content;
		justify-content: center;
		align-items: center;
		border: 1px solid oklch(0.5 50% 200);
		background: url(/checkerboard.svg);
	}
	.item:hover {
		border: 1px solid oklch(0.75 50% 200);
	}
</style>
