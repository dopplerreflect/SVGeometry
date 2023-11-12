<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 12, 8),
		updated_at: new Date(2023, 10, 12, 8)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';
	import {
		anglesArray,
		arrayMap,
		polygonFromIntersectionOfLines,
		radialPoint
	} from '$lib/geometry';

	const id = 'TILED-SUN';
	const size = 2 ** 10;
	const d = 4;
	const angles = anglesArray(d, 0);
	const r = size * 0.165;
	const radii = arrayMap(3, (n) => r * Math.sqrt(2) ** n);
	const lineArray: Line[] = [
		...radii
			.map((r) =>
				angles.map(
					(a, i) =>
						[
							radialPoint(a - 45, r, { center: radialPoint(a, radii[0]) }),
							radialPoint(angles[(i + 1) % d] - 45, r, { center: radialPoint(a, radii[0]) })
						] as Line
				)
			)
			.flat(),
		...radii
			.map((r) =>
				angles.map(
					(a, i) =>
						[
							radialPoint(angles[(i + 1) % d] - 45, r, { center: radialPoint(a, radii[0]) }),
							radialPoint(angles[(i + 2) % d] - 45, r, {
								center: radialPoint(angles[(i + 2) % d], radii[0])
							})
						] as Line
				)
			)
			.flat(),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % d] - 45, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 3) % d] - 45, radii[2], { center: radialPoint(a, radii[0]) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % d] - 45, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 3) % d] - 45, radii[0], { center: radialPoint(a, radii[0]) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % d] - 45, radii[1], { center: radialPoint(a, radii[0]) }),
					{ x: 0, y: 0 }
				] as Line
		)
	];
	const polygonGroups: string[][] = [
		[polygonFromIntersectionOfLines([11, 23, 22, 19, 7, 17, 22, 21, 11], lineArray)],
		[
			polygonFromIntersectionOfLines([7, 19, 22, 15, 3, 13, 22, 17, 7], lineArray),
			polygonFromIntersectionOfLines([22, 23, 18, 19, 22], lineArray)
		],
		[
			polygonFromIntersectionOfLines([3, 15, 22, 13, 3], lineArray),
			polygonFromIntersectionOfLines([22, 19, 18, 15, 22], lineArray),
			polygonFromIntersectionOfLines([18, 23, 14, 19, 18], lineArray)
		],
		[
			polygonFromIntersectionOfLines([22, 15, 18, 26, 22], lineArray),
			polygonFromIntersectionOfLines([18, 19, 14, 15, 18], lineArray),
			polygonFromIntersectionOfLines([14, 23, 25, 19, 14], lineArray)
		],
		[
			polygonFromIntersectionOfLines([22, 26, 18, 24, 22], lineArray),
			polygonFromIntersectionOfLines([18, 15, 14, 26, 18], lineArray),
			polygonFromIntersectionOfLines([14, 19, 25, 15, 14], lineArray)
		],
		[
			polygonFromIntersectionOfLines([18, 26, 14, 34, 18], lineArray),
			polygonFromIntersectionOfLines([14, 15, 25, 26, 14], lineArray),
			polygonFromIntersectionOfLines([25, 19, 35, 15, 25], lineArray),
			polygonFromIntersectionOfLines([14, 28, 25, 34, 14], lineArray),
			polygonFromIntersectionOfLines([31, 15, 35, 26, 31], lineArray)
		],
		[
			polygonFromIntersectionOfLines([14, 26, 25, 28, 14], lineArray),
			polygonFromIntersectionOfLines([25, 15, 31, 26, 25], lineArray),
			polygonFromIntersectionOfLines([25, 28, 31, 34, 25], lineArray),
			polygonFromIntersectionOfLines([31, 26, 35, 28, 31], lineArray)
		],
		[polygonFromIntersectionOfLines([25, 26, 31, 28, 25], lineArray)]
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="TILED-SUN-shrink">
			<feMorphology in="SourceAlpha" operator="erode" radius="1" />
			<feGaussianBlur stdDeviation="2" />
			<feOffset dy="3" result="shadow" />
			<feMorphology in="SourceAlpha" result="erode2" operator="erode" radius="2" />
			<feColorMatrix
				in="erode2"
				result="border"
				values="1 0 0 0 1
                0 1 0 0 0.5
                0 0 1 0 0.25
                0 0 0 1 0"
			/>
			<feGaussianBlur stdDeviation="1" />
			<feOffset dy="-2" result="topglow" />
			<feMorphology in="SourceGraphic" operator="erode" radius="3" />
			<feMerge>
				<feMergeNode in="topglow" />
				<feMergeNode in="shadow" />
				<!-- <feMergeNode in="border" /> -->
				<feMergeNode />
			</feMerge>
		</filter>
		<style>
			svg#TILED-SUN {
				& g.filtered {
					filter: url(#TILED-SUN-shrink);
				}
		</style>
	</defs>
	<Background {size} fill="oklch(0.33 10% 30)" />
	<g id="polygons">
		{#each polygonGroups as pg, pgi}
			{#each pg as points, i}
				<PolygonToRadial
					{points}
					angles={angles.map((a) => a - 90)}
					classname={`filtered p${i} pg${pgi}`}
					style={`fill:oklch(${0.1 + (1 / polygonGroups.length) * pgi} 50% 60 / 1)`}
				/>
			{/each}
		{/each}
	</g>
</DopplerSvg>
