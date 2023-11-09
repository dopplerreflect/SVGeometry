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
	import { Phi, anglesArray, arrayMap, pentagram, phi, radialPoint } from '$lib/geometry';

	const id = 'PENTAMARBLES';
	const size = 2 ** 10;
	const ro = size / 5.5;
	const angles = anglesArray(10);
	const radii = arrayMap(10, (n) => ro * phi ** n);
	const circles: Circle[] = [
		...radii
			.reverse()
			.map((r, i) =>
				angles.map((a) => ({ r, ...radialPoint(i % 2 === 0 ? a : a + 0, r * Phi ** 3 - r) }))
			)
			.flat()
	];
	const stars = [
		...radii
			.map((r) =>
				angles.map((a, i) =>
					pentagram(r, {
						rotate: i % 2 === 0 ? 180 : 0,
						center: radialPoint(i % 2 === 0 ? a : a + 0, r * Phi ** 3 - r)
					})
				)
			)
			.flat()
	];
</script>

<DopplerSvg {id} {size}>
	<radialGradient id={`${id}-bg`} r="0.7">
		<stop offset="0%" stop-color="oklch(0 0 0)" />
		<stop offset="100%" stop-color="oklch(1 0 0)" />
	</radialGradient>
	<radialGradient id={`${id}-rg`} r="0.5">
		<stop offset="0%" stop-color="oklch(1 0 0)" />
		<stop offset="100%" stop-color="oklch(0 10% 300)" />
	</radialGradient>
	<Background {size} fill={`url(#${id}-bg)`} />
	{#each circles as c, i}
		<circle
			r={c.r}
			cx={c.x}
			cy={c.y}
			style={`fill:url(#${id}-rg);stroke:oklch(0 0 0);stroke-width:1;`}
		/>
		<path
			d={stars[i]}
			style={`fill:oklch(0 0 0 / 0.125);fill-rule:evenodd;stroke:oklch(0.5 0 0);stroke-width:2`}
		/>
	{/each}
</DopplerSvg>
