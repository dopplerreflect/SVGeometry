<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(),
		updated_at: new Date()
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { anglesArray, linePoints, pathFromPoints, radialPoint } from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const angles = anglesArray(6, 0);
	const r = (size / 2) * 0.95;
	const outerHex: Line[] = [
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(angles[(i + 1) % 6], r)] as Line)
	];
	const outerHexPoints: Point[] = outerHex.map((l, i) => linePoints(l, 10)).flat();

	const hexDivisionLines = outerHexPoints
		.slice(0, 21)
		.map((p, i) => [p, outerHexPoints[50 - (i % 30)]] as Line);
	const xl2 = outerHexPoints
		.slice(10, 31)
		.map((p, i) => [p, outerHexPoints[(60 - (i % 30)) % 60]] as Line);

	// p: intersection points inside the hexagon
	const p: Point[] = [
		...hexDivisionLines
			.slice(0, 11)
			.map((l, i) => linePoints(l, 10 + i, true))
			.flat(),
		...hexDivisionLines
			.slice(11)
			.reverse()
			.map((l, i) => linePoints(l, 10 + i, true))
			.flat()
	];
	const paths = [
		pathFromPoints([80, 74, 91, 95, 130, 150].map((i) => p[i])),
		pathFromPoints([].map((i) => p[i]))
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TEMPLATE {
				& circle,
				line {
					stroke: oklch(0.5 0 0);
					fill: none;
				}
				& text {
					fill: oklch(1 100% 90);
				}
				& path:not(.Background) {
					stroke: oklch(0.5 100% 150);
					fill: oklch(0.25 0 0);
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.33 0 0)" />
	{#each angles as a}
		<g transform={`rotate(${a})`}>
			{#each paths as d}
				<path {d} />
			{/each}
		</g>
	{/each}
	<!-- <LineWithLegend {lineArray} /> -->
	{#each p as p, i}
		<text x={p.x} y={p.y} alignment-baseline="middle" text-anchor="middle">{i}</text>
	{/each}
	<!-- <LineWithLegend lineArray={hexDivisionLines} /> -->
	<!-- <LineWithLegend lineArray={xl2} /> -->
</DopplerSvg>
