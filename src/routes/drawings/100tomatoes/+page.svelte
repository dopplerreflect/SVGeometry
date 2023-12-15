<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 7, 19),
		updated_at: new Date(2023, 10, 7, 19)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { Phi, anglesArray, arrayMap, phi, radialPoint } from '$lib/geometry';

	const id = '100TOMATOES';
	const size = 2 ** 10;
	const ro = size / 5.5;
	const angles = anglesArray(10);
	const radii = arrayMap(10, (n) => ro * phi ** n);
	const circles: Circle[] = [
		...radii
			.map((r, i) =>
				angles.map((a) => ({ r, ...radialPoint(i % 2 === 0 ? a : a + 18, r * Phi ** 3 - r) }))
			)
			.flat()
	];
</script>

<DopplerSvg {id} {size}>
	<radialGradient id="100TOMATOES-bg" r="0.5">
		<stop offset="0%" stop-color="oklch(0.99 100% 150)" />
		<stop offset="100%" stop-color="oklch(0.01 100% 150)" />
	</radialGradient>
	<radialGradient id="100TOMATOES-rg" r="0.5">
		<stop offset="0%" stop-color="oklch(0.99 100% 90)" />
		<stop offset="100%" stop-color="oklch(0.01 100% 0)" />
	</radialGradient>
	<Background {size} fill="url(#100TOMATOES-bg)" />
	{#each circles as c}
		<circle
			r={c.r}
			cx={c.x}
			cy={c.y}
			style={`fill:url(#100TOMATOES-rg);stroke:oklch(0.01 0 0);stroke-width:2;`}
		/>
	{/each}
</DopplerSvg>
