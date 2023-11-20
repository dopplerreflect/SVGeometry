<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 16, 19),
		updated_at: new Date(2023, 10, 16, 19)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import GridPattern from '$lib/components/GridPattern.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { Phi, circleIntersections, phi } from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const r = (size * 0.95) / 6;
	const circles = [
		{ r, x: 0, y: 0 },
		{ r, x: -r, y: 0 },
		{ r, x: r, y: 0 },
		{ r: r * 2, x: -r, y: 0 },
		{ r: r * 2, x: r, y: 0 },
		{ r: Math.hypot(r / 2, r), x: -r / 2, y: 0 },

		{ r: Math.hypot(r / 2, r), x: r / 2, y: 0 },
		{ r: Math.hypot(r / 2, r), x: 0, y: 0 },
		{ r: Math.hypot(r / 2, r), x: -r, y: 0 },
		{ r: Math.hypot(r / 2, r), x: r, y: 0 },
		{ r, x: -r / 2, y: 0 },
		{ r, x: r / 2, y: 0 },
		{ r: r * Math.sqrt(3), x: 0, y: 0 },
		{ r: r * Math.sqrt(3), x: -r / 2, y: 0 },
		{ r: r * Math.sqrt(3), x: r / 2, y: 0 },
		{ r: r * Math.sqrt(3), x: -r, y: 0 },
		{ r: r * Math.sqrt(3), x: r, y: 0 },
		{ r: r * 2, x: -r / 2, y: 0 },
		{ r: r * 2, x: r / 2, y: 0 },
		{ r: r * 2, x: 0, y: 0 }
	];
	const lineArray: Line[] = [
		[
			{ x: -size, y: 0 },
			{ x: size, y: 0 }
		],
		circleIntersections(circles[0], circles[1]),
		circleIntersections(circles[0], circles[2]),
		circleIntersections(circles[3], circles[4])
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TEMPLATE {
				& circle {
					stroke: none;
					fill: oklch(0.75 100% 150 / 0.1);
				}
			}
		</style>
		<GridPattern size={r} stroke="oklch(0.5 100% 300)" />
	</defs>
	<Background {size} fill="url(#gridPattern)" />
	{#each circles as c}
		<circle
			r={c.r}
			cx={c.x}
			cy={c.y}
			style={`fill:oklch(${(0.75 / (r * 2)) * r + 0.25} 100% ${Math.abs(c.x) + 210} / 0.15)`}
		/>
	{/each}
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} style={`fill:none;stroke:oklch(1 0 0)`} />
	{/each}
	<LineWithLegend {lineArray} style="stroke:oklch(1 0% 300)" />
</DopplerSvg>
