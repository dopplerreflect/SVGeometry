<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 2, 20),
		updated_at: new Date(2023, 9, 2, 20)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { anglesArray, circleIntersections, phi, pythag, radialPoint } from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const angles10 = anglesArray(10, 0);
	const angles = anglesArray(5, 180);
	const r = size / 3.3;
	const radii = [r, r * phi, r * phi ** 2];
	const circles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...angles10
			.map((a) =>
				radii
					.slice(1, 3)
					.map((r) => ({ r, ...radialPoint(a, radii[2], { center: radialPoint(a, radii[1]) }) }))
			)
			.flat()
	];
	const ci = circleIntersections(circles[4], circles[6]);
	const r2 = pythag(ci[1].x, ci[1].y);
	const lineArray: Line[] = [
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(angles[(i + 2) % 5], r)] as Line),
		...angles.map((a, i) => [radialPoint(a + 36, r), { x: 0, y: 0 }] as Line),
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(a + 36, radii[1])] as Line),
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(a - 36, radii[1])] as Line),
		...angles.map((a, i) => [radialPoint(a + 36, r), radialPoint(a + 54, r2)] as Line),
		...angles.map((a, i) => [radialPoint(a + 36, r), radialPoint(a + 18, r2)] as Line)
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TEMPLATE {
				& circle {
					stroke: grey;
					fill: none;
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.25 0 0)" />
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} id={`c${i}`} style="stroke:oklch(0.5 100% 300)" />
	{/each}
	<LineWithLegend {lineArray} showLegend style="stroke:oklch(1 100% 150);" />
	<circle r={r2} />
</DopplerSvg>
