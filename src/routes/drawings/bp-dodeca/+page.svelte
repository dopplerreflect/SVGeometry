<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 30, 20),
		updated_at: new Date(2023, 8, 30, 20)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import GridPattern from '$lib/components/GridPattern.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { anglesArray, pathFromIntersectionsOfLines, phi, radialPoint } from '$lib/geometry';

	const id = 'BP-DODECA';
	const size = 2 ** 10;
	const r = (size / 4) * 0.95;
	const angles = anglesArray(10, 0);
	const circles: Circle[] = [
		...[-r, 0, r].map((x) => [...[r, r * phi].map((r) => ({ r, x, y: 0 }))])
	].flat();
	const lineArray: Line[] = [
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(angles[(i + 1) % 10], r)] as Line),
		...angles
			.slice(0, 5)
			.map(
				(a, i) =>
					[radialPoint(angles[i * 2] - 180, r), radialPoint(angles[i * 2] - 180, r * phi)] as Line
			),
		...angles
			.slice(0, 5)
			.map(
				(a, i) =>
					[
						radialPoint(angles[i * 2] - 180, r * phi),
						radialPoint(angles[i * 2] - 108, r * phi)
					] as Line
			)
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[7, 8, 12, 16, 11, 7].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[5, 6, 11, 15, 10, 5].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[9, 0, 13, 17, 12, 9].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[15, 16, 17, 18, 19, 15].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[3, 4, 10, 19, 14, 3].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[1, 2, 14, 18, 13, 1].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#BP-DODECA {
				& circle,
				path:not(.Background) {
					fill: none;
				}
				& circle {
					stroke: oklch(0.75 15% 300);
				}
				& line {
					stroke: oklch(1 0% 150);
				}
				& line.bg {
					stroke: oklch(1 0% 300);
					stroke-dasharray: 3 5;
				}
			}
		</style>
		<GridPattern id="bp-dodeca-grid" size={r} stroke="oklch(0.5 100% 300)" />
	</defs>
	<Background {size} fill="oklch(0 100% 300)" />
	<Background {size} fill="url(#bp-dodeca-grid)" />
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<g transform="rotate(36)">
		<LineWithLegend name="bg" {lineArray} />
		{#each paths as d, i}
			<path {d} style={`fill:oklch(${1 - (0.15 + 0.15 * i)} 50% 300 / 0.1)`} />
		{/each}
	</g>
	{#each lineArray as l}
		<LineWithLegend {lineArray} />
	{/each}
	{#each paths as d, i}
		<path {d} style={`fill:oklch(${1 - (0.15 + 0.15 * i)} 100% 300 / 0.25)`} />
	{/each}
</DopplerSvg>
