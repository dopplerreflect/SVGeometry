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
	const polygonGroups: string[][] = [
		[
			polygonFromIntersectionOfLines([11, 31, 33, 11], lineArray),
			polygonFromIntersectionOfLines([9, 29, 27, 9], lineArray)
		],
		[
			polygonFromIntersectionOfLines([12, 32, 11, 34, 12], lineArray),
			polygonFromIntersectionOfLines([11, 32, 34, 11], lineArray),
			polygonFromIntersectionOfLines([9, 28, 26, 9], lineArray),
			polygonFromIntersectionOfLines([8, 28, 9, 26, 8], lineArray)
		],
		[
			polygonFromIntersectionOfLines([13, 33, 12, 35, 13], lineArray),
			polygonFromIntersectionOfLines([12, 33, 11, 35, 12], lineArray),
			polygonFromIntersectionOfLines([11, 33, 35, 11], lineArray),
			polygonFromIntersectionOfLines([9, 27, 25, 9], lineArray),
			polygonFromIntersectionOfLines([8, 27, 9, 25, 8], lineArray),
			polygonFromIntersectionOfLines([7, 27, 8, 25, 7], lineArray)
		],
		[
			polygonFromIntersectionOfLines([14, 34, 13, 36, 14], lineArray),
			polygonFromIntersectionOfLines([13, 34, 12, 36, 13], lineArray),
			polygonFromIntersectionOfLines([12, 34, 11, 36, 12], lineArray),
			polygonFromIntersectionOfLines([11, 34, 36, 11], lineArray),
			polygonFromIntersectionOfLines([9, 26, 24, 9], lineArray),
			polygonFromIntersectionOfLines([8, 26, 9, 24, 8], lineArray),
			polygonFromIntersectionOfLines([7, 26, 8, 24, 7], lineArray),
			polygonFromIntersectionOfLines([6, 26, 7, 24, 6], lineArray)
		],
		[
			polygonFromIntersectionOfLines([15, 35, 14, 37, 15], lineArray),
			polygonFromIntersectionOfLines([14, 35, 13, 37, 14], lineArray),
			polygonFromIntersectionOfLines([13, 35, 12, 37, 13], lineArray),
			polygonFromIntersectionOfLines([12, 35, 11, 37, 12], lineArray),
			polygonFromIntersectionOfLines([11, 35, 37, 11], lineArray),
			polygonFromIntersectionOfLines([9, 25, 23, 9], lineArray),
			polygonFromIntersectionOfLines([8, 25, 9, 23, 8], lineArray),
			polygonFromIntersectionOfLines([7, 25, 8, 23, 7], lineArray),
			polygonFromIntersectionOfLines([6, 25, 7, 23, 6], lineArray),
			polygonFromIntersectionOfLines([5, 25, 6, 23, 5], lineArray)
		],
		[
			polygonFromIntersectionOfLines([16, 36, 15, 38, 16], lineArray),
			polygonFromIntersectionOfLines([15, 36, 14, 38, 15], lineArray),
			polygonFromIntersectionOfLines([14, 36, 13, 38, 14], lineArray),
			polygonFromIntersectionOfLines([13, 36, 12, 38, 13], lineArray),
			polygonFromIntersectionOfLines([12, 36, 11, 38, 12], lineArray),
			polygonFromIntersectionOfLines([11, 36, 38, 11], lineArray),
			polygonFromIntersectionOfLines([9, 24, 22, 9], lineArray),
			polygonFromIntersectionOfLines([8, 24, 9, 22, 8], lineArray),
			polygonFromIntersectionOfLines([7, 24, 8, 22, 7], lineArray),
			polygonFromIntersectionOfLines([6, 24, 7, 22, 6], lineArray),
			polygonFromIntersectionOfLines([5, 24, 6, 22, 5], lineArray),
			polygonFromIntersectionOfLines([4, 24, 5, 22, 4], lineArray)
		],
		[
			polygonFromIntersectionOfLines([17, 37, 16, 39, 17], lineArray),
			polygonFromIntersectionOfLines([16, 37, 15, 39, 16], lineArray),
			polygonFromIntersectionOfLines([15, 37, 14, 39, 15], lineArray),
			polygonFromIntersectionOfLines([14, 37, 13, 39, 14], lineArray),
			polygonFromIntersectionOfLines([13, 37, 12, 39, 13], lineArray),
			polygonFromIntersectionOfLines([12, 37, 11, 39, 12], lineArray),
			polygonFromIntersectionOfLines([11, 37, 39, 11], lineArray),
			polygonFromIntersectionOfLines([9, 23, 21, 9], lineArray),
			polygonFromIntersectionOfLines([8, 23, 9, 21, 8], lineArray),
			polygonFromIntersectionOfLines([7, 23, 8, 21, 7], lineArray),
			polygonFromIntersectionOfLines([6, 23, 7, 21, 6], lineArray),
			polygonFromIntersectionOfLines([5, 23, 6, 21, 5], lineArray),
			polygonFromIntersectionOfLines([4, 23, 5, 21, 4], lineArray),
			polygonFromIntersectionOfLines([3, 23, 4, 21, 3], lineArray)
		],
		[
			polygonFromIntersectionOfLines([18, 38, 17, 18], lineArray),
			polygonFromIntersectionOfLines([17, 38, 16, 17], lineArray),
			polygonFromIntersectionOfLines([16, 38, 15, 16], lineArray),
			polygonFromIntersectionOfLines([15, 38, 14, 15], lineArray),
			polygonFromIntersectionOfLines([14, 38, 13, 14], lineArray),
			polygonFromIntersectionOfLines([13, 38, 12, 14], lineArray),
			polygonFromIntersectionOfLines([12, 38, 11, 13], lineArray),
			polygonFromIntersectionOfLines([11, 38, 10, 11], lineArray),
			polygonFromIntersectionOfLines([9, 22, 10, 9], lineArray),
			polygonFromIntersectionOfLines([8, 22, 9, 8], lineArray),
			polygonFromIntersectionOfLines([7, 22, 8, 7], lineArray),
			polygonFromIntersectionOfLines([6, 22, 7, 6], lineArray),
			polygonFromIntersectionOfLines([5, 22, 6, 5], lineArray),
			polygonFromIntersectionOfLines([4, 22, 5, 4], lineArray),
			polygonFromIntersectionOfLines([3, 22, 4, 3], lineArray),
			polygonFromIntersectionOfLines([2, 22, 3, 2], lineArray)
		],
		[
			polygonFromIntersectionOfLines([19, 39, 20, 19], lineArray),
			polygonFromIntersectionOfLines([1, 21, 20, 1], lineArray)
		]
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
					stroke: oklch(0.5 50% 90);
				}
			}
		</style>
		<linearGradient id="TEMPLATE-lg" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="oklch(0.75 10% 60)" />
			<stop offset="100%" stop-color="oklch(0.25 10% 60)" />
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
		<filter id="TEMPLATE-shrink">
			<feMorphology operator="erode" radius="5" />
		</filter>
	</defs>
	<Background {size} fill="url(#TEMPLATE-lg)" />
	{#each polygonGroups as group, gi}
		<g
			style={`fill:oklch(${1 - (1 / (polygonGroups.length + 2)) * gi} 33% 60 / 1);`}
			filter="url(#TEMPLATE-filter)"
		>
			{#each group as points, i}
				<polygon {points} filter="url(#TEMPLATE-shrink" />
			{/each}
		</g>
	{/each}
	<!-- <LineWithLegend {lineArray} /> -->
</DopplerSvg>
