<script lang="ts">
	import { get } from 'svelte/store';
	import { drawingsStore } from '$lib/stores/drawingStore';
	import { onMount } from 'svelte';

	const allDrawings = get(drawingsStore);
	const tags = ['', ...new Set([...allDrawings.map((d) => d.module.metadata.tags).flat()])].sort();
	allDrawings.sort((b, a) => a.module.metadata.created_at - b.module.metadata.created_at);

	let nav: HTMLElement;
	let drawings = allDrawings;
	let tag = '';

	function setTag(event: Event) {
		const target = event.target as HTMLSelectElement;
		tag = target.value;
		drawings = tag ? allDrawings.filter((d) => d.module.metadata.tags.includes(tag)) : allDrawings;
		toggleNav();
	}

	function toggleNav() {
		nav.classList.toggle('hidden');
		console.log(nav.classList);
	}

	function handleKeyDown(e: KeyboardEvent) {
		switch (e.key) {
			case 'm':
				toggleNav();
				break;
		}
	}
	onMount(() => {
		document.addEventListener('keydown', handleKeyDown);
		return () => document.removeEventListener('keydown', handleKeyDown);
	});
</script>

<svelte:head>
	<title>SVGeometry</title>
</svelte:head>

<main>
	<header>
		<div class="item">
			<h1>SVGeometry</h1>
		</div>
		<div class="item">
			<h1>@dopplerreflect</h1>
		</div>
	</header>
	<div id="container">
		{#each drawings as drawing}
			<div class="item">
				<a href={`/drawings/${drawing.name}`}>
					<svelte:component this={drawing.module.default} />
				</a>
			</div>
		{/each}
	</div>
	<svg width="0px" height="0px">
		<filter id="textFilter">
			<feMorphology in="SourceAlpha" operator="dilate" radius="0" result="morph" />
			<feFlood flood-color="oklch(100% 50% 300)" result="flood" />
			<feComposite in="flood" in2="morph" operator="in" result="composite" />
			<feOffset in="composite" dx="1" dy="1" result="offset" />
			<feGaussianBlur in="offset" stdDeviation="0" result="blur" />
			<feMerge>
				<feMergeNode in="blur" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</svg>
</main>
<nav bind:this={nav} class="hidden">
	<select bind:value={tag} on:change={setTag}>
		{#each tags as tag}
			<option value={tag}>{tag}</option>
		{/each}
	</select>
</nav>

<style>
	:global(body) {
		margin: 0;
		font-family: 'Courier New', Courier, monospace;
		/* height: 100vh; */
	}
	@font-face {
		font-family: 'Russo One';
		src: url('/fonts/RussoOne-Regular.ttf');
		font-weight: normal;
	}
	:root {
		--rowLength: 3;
	}
	main {
		height: 100vh;
		background-color: oklch(0.2 50% 300);
	}
	header {
		height: 3em;
		display: flex;
	}
	header .item {
		flex-basis: calc(100% / 2);
	}
	header h1 {
		font-family: 'Russo One';
		text-align: center;
		line-height: 0.5em;
		color: oklch(0.3 25% 300);
		filter: url('#textFilter');
	}
	#container {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		padding: 10px;
		background-color: oklch(0.1 50% 300);
	}
	nav {
		position: absolute;
		left: 0;
		top: 0;
		width: 100vw;
		height: 100vh;
		background-color: oklch(0 100% 300 / 0.75);
		transition: top 0.25s;
	}
	nav.hidden {
		top: -100vh;
		transition: top 0.25s;
	}
	nav select {
		position: relative;
		left: 50%;
		top: 50%;
	}
	#container .item {
		flex-basis: calc((100% - calc(var(--rowLength) * 10px)) / var(--rowLength));
		height: fit-content;
		justify-content: center;
		align-items: center;
		border: 1px solid oklch(0.5 50% 200);
		background: url(/checkerboard.svg);
	}
	#container .item:hover {
		border: 1px solid oklch(0.75 50% 200);
	}
</style>
