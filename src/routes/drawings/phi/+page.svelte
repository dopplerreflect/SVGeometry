<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 11, 23, 9),
		updated_at: new Date(2023, 11, 23, 9)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import GridPattern from '$lib/components/GridPattern.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		Phi,
		arrayMap,
		circleLineIntersections,
		intersection,
		phi,
		pointToString,
		radialPoint
	} from '$lib/geometry';

	const id = 'PHI';
	const size = 2 ** 10;
	const r = (size * phi) / 10;
	const radii = arrayMap(5, (n) => r * Phi ** n);
	const angles = [-72, 72, 108, 252];
	const circles: Circle[] = [
		...angles.map((a) => ({ r, ...radialPoint(a, radii[3] + radii[0]) })),
		...radii.map((r) => ({ r, x: 0, y: 0 }))
	];
	const lineArray: Line[] = [
		[
			{ x: -r * phi, y: -size / 2 },
			{ x: -r * phi, y: size / 2 }
		],
		[
			{ x: r * phi, y: -size / 2 },
			{ x: r * phi, y: size / 2 }
		],
		[
			{ x: -r, y: -size / 2 },
			{ x: -r, y: size / 2 }
		],
		[
			{ x: r, y: -size / 2 },
			{ x: r, y: size / 2 }
		],
		[
			{ x: circles[1].x, y: circles[3].y },
			{ x: circles[2].x, y: circles[0].y }
		],
		[
			{ x: circles[1].x, y: circles[1].y },
			{ x: circles[2].x, y: circles[2].y }
		],

		[
			{ x: circles[1].x, y: circles[3].y - r },
			{ x: circles[2].x, y: circles[0].y - r }
		],
		[
			{ x: circles[1].x, y: circles[1].y + r },
			{ x: circles[2].x, y: circles[2].y + r }
		]
	];
	const d: string = [
		'M',
		pointToString(intersection(lineArray[2], lineArray[6])),
		pointToString(intersection(lineArray[6], lineArray[3])),
		pointToString(circleLineIntersections(circles[0], lineArray[3])[0]),
		'A',
		r,
		r,
		'0 0 0',
		pointToString(intersection(lineArray[1], lineArray[4])),
		'L',
		pointToString(circleLineIntersections(circles[7], lineArray[1])[0]),
		'A',
		radii[3],
		radii[3],
		'0 0 1',
		pointToString(circleLineIntersections(circles[7], lineArray[1])[1]),
		'L',
		pointToString(intersection(lineArray[1], lineArray[5])),
		'A',
		r,
		r,
		'0 0 0',
		pointToString(circleLineIntersections(circles[1], lineArray[3])[1]),
		'L',
		pointToString(intersection(lineArray[3], lineArray[7])),
		pointToString(intersection(lineArray[2], lineArray[7])),
		pointToString(circleLineIntersections(circles[2], lineArray[2])[1]),
		'A',
		r,
		r,
		'0 0 0',
		pointToString(intersection(lineArray[0], lineArray[5])),
		'L',
		pointToString(circleLineIntersections(circles[7], lineArray[0])[1]),
		'A',
		radii[3],
		radii[3],
		'0 0 1',
		pointToString(circleLineIntersections(circles[7], lineArray[0])[0]),
		'L',
		pointToString(intersection(lineArray[0], lineArray[4])),
		'A',
		r,
		r,
		'0 0 0',
		pointToString(circleLineIntersections(circles[3], lineArray[2])[0]),
		'Z',
		'M',
		pointToString(circleLineIntersections(circles[6], lineArray[1])[0]),
		'A',
		radii[2],
		radii[2],
		'0 0 1',
		pointToString(circleLineIntersections(circles[6], lineArray[1])[1]),
		'Z',
		'M',
		pointToString(circleLineIntersections(circles[6], lineArray[0])[0]),
		'A',
		radii[2],
		radii[2],
		'0 0 0',
		pointToString(circleLineIntersections(circles[6], lineArray[0])[1]),
		'Z'
	].join(' ');
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#PHI {
				& circle,
				line {
					stroke: white;
					fill: none;
				}
			}
		</style>
		<GridPattern size={r} stroke="oklch(0.75 100% 270)" />
	</defs>
	<Background {size} fill="white" />
	<Background {size} fill="url(#gridPattern)" />
	{#each radii as r}
		<circle {r} />
	{/each}
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<LineWithLegend {lineArray} />
	<path
		{d}
		style="stroke:oklch(0.99 100% 150);stroke-width:2;fill:oklch(0.66 100% 150 / 0.5);fill-rule:evenodd;"
	/>
</DopplerSvg>
