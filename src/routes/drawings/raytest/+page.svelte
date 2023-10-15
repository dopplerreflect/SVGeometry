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
	import {
		anglesArray,
		pentagram,
		phi,
		polygonFromIntersectionOfLines,
		radialPoint
	} from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const angles = anglesArray(20);
	const r = (size / 2) * 0.95;
	const lineArray: Line[] = [
		...angles.map((a) => [radialPoint(a, r), { x: 0, y: -r * phi ** 2 }] as Line),
		...angles.map((a) => [radialPoint(a, r), { x: 0, y: r * phi ** 2 }] as Line),
		[
			{ x: 0, y: -r * phi ** 2 },
			{ x: 0, y: r * phi ** 2 }
		]
	];
	const polygons: string[] = [
		polygonFromIntersectionOfLines([11, 31, 29, 9, 28, 32, 11], lineArray),
		polygonFromIntersectionOfLines([12, 32, 28, 8, 27, 33, 12], lineArray),
		polygonFromIntersectionOfLines([13, 33, 27, 7, 26, 34, 13], lineArray),
		polygonFromIntersectionOfLines([14, 34, 26, 6, 25, 35, 14], lineArray),
		polygonFromIntersectionOfLines([15, 35, 25, 5, 24, 36, 15], lineArray),
		polygonFromIntersectionOfLines([16, 36, 24, 4, 23, 37, 16], lineArray),
		polygonFromIntersectionOfLines([17, 37, 23, 3, 22, 38, 17], lineArray),
		polygonFromIntersectionOfLines([18, 38, 22, 2, 21, 39, 18], lineArray),
		polygonFromIntersectionOfLines([19, 39, 21, 1, 19], lineArray)
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TEMPLATE {
				& circle {
					stroke: oklch(0.5 0 0);
					fill: oklch(0.2 100% 300);
				}
				& line {
					stroke: oklch(0.5 0 0);
				}
			}
		</style>
		<linearGradient id="TEMPLATE-lg" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="oklch(0 10% 300)" />
			<stop offset="100%" stop-color="oklch(1 10% 300)" />
		</linearGradient>
		<filter id="TEMPLATE-filter" width={size / 2} height={size / 2}>
			<feMorphology operator="dilate" radius="10" />
			<feFlood flood-color="oklch(0 0 0)" />
			<feComposite in2="SourceGraphic" operator="in" />
			<feGaussianBlur stdDeviation="10" />
			<feOffset dy="20" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="url(#TEMPLATE-lg)" />
	{#each polygons as points, i}
		<polygon
			{points}
			style={`fill:oklch(${1 - (1 / polygons.length) * i} 25% 90 / 1);stroke:oklch(${
				(1 / polygons.length) * i
			} 0 0 / 1);stroke-width:5;`}
			filter="url(#TEMPLATE-filter)"
		/>
	{/each}
	<LineWithLegend {lineArray} showLegend />
</DopplerSvg>
