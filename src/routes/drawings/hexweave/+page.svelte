<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 11, 12),
		updated_at: new Date(2023, 9, 11, 15)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { anglesArray, linePoints, pathFromPoints, radialPoint } from '$lib/geometry';

	const id = 'HEXWEAVE';
	const size = 2 ** 10;
	const angles = anglesArray(6, 0);
	const r = (size / 2) * 0.95;
	const outerHex: Line[] = [
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(angles[(i + 1) % 6], r)] as Line)
	];
	const outerHexPoints: Point[] = outerHex.map((l, i) => linePoints(l, 12)).flat();

	const hexDivisionLines = outerHexPoints
		.slice(0, 25)
		.map((p, i) => [p, outerHexPoints[60 - (i % 40)]] as Line);

	// p: intersection points inside the hexagon
	const p: Point[] = [
		...hexDivisionLines
			.slice(0, 13)
			.map((l, i) => linePoints(l, 12 + i, true))
			.flat(),
		...hexDivisionLines
			.slice(13)
			.reverse()
			.map((l, i) => linePoints(l, 12 + i, true))
			.flat()
	];
	const paths = [
		pathFromPoints([242, 465, 466, 244, 72, 63, 80, 89, 243].map((i) => p[i])),
		pathFromPoints([111, 105, 125, 129, 170, 193].map((i) => p[i])),
		pathFromPoints([104, 103, 185, 184, 208, 209, 123, 124].map((i) => p[i])),
		pathFromPoints([183, 181, 450, 427, 205, 207].map((i) => p[i]))
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#HEXWEAVE {
				& circle,
				line {
					stroke: oklch(0.5 0 0);
					fill: none;
				}
				& text {
					fill: oklch(1 100% 90);
				}
				& path:not(.Background) {
					fill: oklch(0.1 100% 150);
					stroke: oklch(1 100% 150);
				}
				& line.fill {
					stroke: oklch(1 100% 150);
				}
				& path.outer {
					fill: oklch(0.1 100% 210);
					stroke: oklch(1 100% 210);
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.1 50% 300)" />
	{#each outerHexPoints as p, i}
		<circle r={10} cx={p.x} cy={p.y} />
	{/each}
	{#each [0, 60, 120] as a}
		<g transform={`rotate(${a})`}>
			<LineWithLegend lineArray={hexDivisionLines} />
		</g>
	{/each}
	{#each angles as a}
		<g transform={`rotate(${a})`}>
			{#each paths as d, i}
				<path {d} class={i > 0 ? 'outer' : 'inner'} />
			{/each}
		</g>
	{/each}
	{#each angles as a}
		<g transform={`rotate(${a})`}>
			<line x1={p[68].x} y1={p[68].y} x2={p[67].x} y2={p[67].y} class="fill" />
			<line x1={p[86].x} y1={p[86].y} x2={p[85].x} y2={p[85].y} class="fill" />
		</g>
	{/each}
	<!-- {#each p as p, i}
		<text x={p.x} y={p.y} text-anchor="middle" alignment-baseline="middle">{i}</text>
	{/each} -->
</DopplerSvg>
