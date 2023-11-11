<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 11, 8),
		updated_at: new Date(2023, 10, 11, 8)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, arrayMap, phi, polygon, polygonPath, radialPoint } from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const d = 10;
	const angles = anglesArray(d);
	const r = size * 0.25;
	const radii = arrayMap(3, (n) => r * phi ** n);
	const paths = [
		...radii.map((r) => polygonPath(d, r, { rotate: 0 })),
		...radii
			.map((r) =>
				angles.map((a) => polygonPath(d, r, { center: radialPoint(a, radii[0]), rotate: 0 }))
			)
			.flat()
	];
	const circles = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...radii.map((r) => angles.map((a) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TEMPLATE {
				& path:not(.Background),
				polygon,
				line,
				circle {
					stroke: white;
					fill: none;
				}
				& circle {
					stroke: oklch(0.5 0 0);
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} />
		<path d={polygonPath(d, c.r, { center: { x: c.x, y: c.y } })} />
	{/each}
</DopplerSvg>
