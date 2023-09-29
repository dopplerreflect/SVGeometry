<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 29, 17),
		updated_at: new Date(2023, 8, 29, 17)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		arrayMap,
		interpolate,
		intersection,
		missingX,
		phi,
		pointToString,
		slope
	} from '$lib/geometry';

	const id = 'ELLIPSETUBE';
	const size = 2 ** 10;
	const h = size * 0.95;
	const w = h * phi;
	const vpl: Point[] = interpolate(10).map((i) => ({
		x: -w / 2,
		y: -h / 2 + (-w / 2 - -h / 2) * i
	}));
	const hp: Point[] = interpolate(10).map((i) => ({
		x: -w / 2 + (w / 2 - -w / 2) * i,
		y: -h / 2 + (-w / 2 - -h / 2) / 2
	}));
	const vpr: Point[] = vpl.map((p) => ({ ...p, x: w / 2 }));
	const cpu: Point[] = [
		...vpl.slice(1, 6),
		...hp.slice(1, 6),
		...hp.slice(6, 11),
		...vpr.slice(1, 5).reverse()
	];
	const cpl: Point[] = [
		...vpl.slice(5, 10).reverse(),
		...hp.slice(1, 6),
		...hp.slice(6, 11),
		...vpr.slice(6, 10)
	].reverse();
	const ellipseLines: Line[] = [
		...cpu.map(
			(p, i) =>
				[
					{ x: 0, y: -h / 2 },
					i > 4 && i < 14
						? { x: missingX(p, -w / 2, slope([{ x: 0, y: -h / 2 }, p])), y: -w / 2 }
						: p
				] as Line
		),
		...cpl.map(
			(p, i) =>
				[
					{ x: 0, y: -w / 2 },
					i > 4 && i < 14
						? { x: missingX(p, -h / 2, slope([{ x: 0, y: -w / 2 }, p])), y: -h / 2 }
						: p
				] as Line
		)
	];
	const ellipsePoints: Point[] = [
		{ x: 0, y: -h / 2 },
		...arrayMap(9, (n) => n).map((n) => intersection(ellipseLines[n], ellipseLines[n + 29])),
		{ x: 0, y: -w / 2 }
	];
	ellipsePoints.push(
		...ellipsePoints
			.slice(1, 10)
			.reverse()
			.map((p) => ({ ...p, x: -p.x }))
	);
	const ellipsePoints2: Point[] = ellipsePoints.map((p) => ({ ...p, y: -p.y }));
	const lineArray: Line[] = ellipsePoints.map((p, i) => [
		p,
		ellipsePoints2[(i + 5) % ellipsePoints.length]
	]);
	const ellipseLineArray: Line[] = ellipsePoints.map(
		(p, i) => [p, ellipsePoints[(i + 1) % ellipsePoints.length]] as Line
	);
	const ellipseLineArray2: Line[] = ellipsePoints2.map(
		(p, i) => [p, ellipsePoints2[(i + 1) % ellipsePoints2.length]] as Line
	);
	const paths: string[] = ellipsePoints.map(
		(p, i) =>
			`M${pointToString(p)}L${pointToString(ellipsePoints2[(i + 5) % 20])}L${pointToString(
				ellipsePoints2[(i + 6) % 20]
			)}L${pointToString(ellipsePoints[(i + 1) % 20])}Z`
	);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#ELLIPSETUBE {
				& circle,
				line,
				path:not(.Background) {
					stroke: white;
					fill: none;
				}
				& text {
					fill: white;
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0 100% 300)" />
	<!-- {#each vpl as p}
		<circle r={2} cx={p.x} cy={p.y} />
	{/each}
	{#each hp as p}
		<circle r={2} cx={p.x} cy={p.y} />
	{/each}
	{#each vpr as p}
		<circle r={2} cx={p.x} cy={p.y} />
	{/each}
	{#each cpl as p}
		<circle r={4} cx={p.x} cy={p.y} />
	{/each} -->
	<!-- <LineWithLegend lineArray={ellipseLines} /> -->
	<!-- {#each ellipsePoints as p, i}
		<circle r={4} cx={p.x} cy={p.y} />
		<text x={p.x} y={p.y}>{i}</text>
	{/each}
	{#each ellipsePoints2 as p, i}
		<circle r={4} cx={p.x} cy={p.y} />
		<text x={p.x} y={p.y}>{i}</text>
	{/each} -->
	<!-- <LineWithLegend {lineArray} />
	<LineWithLegend lineArray={ellipseLineArray} />
	<LineWithLegend lineArray={ellipseLineArray2} /> -->
	{#each paths as d, i}
		<path {d} style={`stroke:oklch(1 100% ${(360 / 20) * i} / 1);fill:oklch(0.0 0 0 / 0.2)`} />
	{/each}
</DopplerSvg>
