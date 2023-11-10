<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 9, 16),
		updated_at: new Date(2023, 10, 9, 16)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';
	import {
		SQRT3,
		anglesArray,
		arrayMap,
		phi,
		polygonFromIntersectionOfLines,
		radialPoint
	} from '$lib/geometry';

	const id = 'HEXLINES';
	const size = 2 ** 10;
	const angles = anglesArray(6);
	const ro = size * 0.18;
	const radii = arrayMap(3, (n) => ro * phi ** n);
	const circles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...radii.map((r) => angles.map((a) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
	const lineArray: Line[] = [
		...radii
			.map((r) =>
				angles.map(
					(a, i) =>
						[
							radialPoint(a, r, { center: radialPoint(a, radii[0]) }),
							radialPoint(angles[(i + 1) % 6], r, {
								center: radialPoint(angles[(i + 1) % 6], radii[0])
							})
						] as Line
				)
			)
			.flat(),

		...angles.map((a) => [radialPoint(a + 0, radii[0] * 2), { x: 0, y: 0 }] as Line),
		...radii
			.map((r) =>
				angles.map(
					(a, i) =>
						[
							radialPoint(a + 0, r, { center: radialPoint(a + 0, radii[0] * SQRT3) }),
							radialPoint(angles[(i + 1) % 6] + 0, r, {
								center: radialPoint(angles[(i + 1) % 6] + 0, radii[0] * SQRT3)
							})
						] as Line
				)
			)
			.flat(),
		...radii
			.map((r) =>
				angles.map(
					(a, i) =>
						[
							radialPoint(angles[(i + 1) % 6] + 0, r, {
								center: radialPoint(a + 0, radii[0] * SQRT3)
							}),
							radialPoint(angles[(i + 2) % 6] + 0, r, {
								center: radialPoint(angles[(i + 3) % 6] + 0, radii[0] * SQRT3)
							})
						] as Line
				)
			)
			.flat()
	];
	const polygonGroups: string[][] = [
		[
			polygonFromIntersectionOfLines([29, 24, 42, 30, 35, 45, 29], lineArray),
			polygonFromIntersectionOfLines([24, 46, 30, 42, 24], lineArray)
		],
		[
			polygonFromIntersectionOfLines([35, 30, 48, 36, 41, 51, 35], lineArray),
			polygonFromIntersectionOfLines([30, 42, 36, 48, 30], lineArray),
			polygonFromIntersectionOfLines([30, 46, 36, 42, 30], lineArray),
			polygonFromIntersectionOfLines([30, 52, 36, 46, 30], lineArray)
		],
		[
			polygonFromIntersectionOfLines([41, 36, 54, 0, 5, 57, 41], lineArray),
			polygonFromIntersectionOfLines([36, 48, 0, 54, 36], lineArray),
			polygonFromIntersectionOfLines([36, 42, 0, 48, 36], lineArray),
			polygonFromIntersectionOfLines([36, 46, 42, 36], lineArray),
			polygonFromIntersectionOfLines([36, 52, 0, 46, 36], lineArray),
			polygonFromIntersectionOfLines([36, 58, 0, 52, 36], lineArray)
		],
		[
			polygonFromIntersectionOfLines([0, 54, 6, 18, 0], lineArray),
			polygonFromIntersectionOfLines([0, 48, 6, 54, 0], lineArray),
			polygonFromIntersectionOfLines([0, 46, 48, 0], lineArray),
			polygonFromIntersectionOfLines([46, 42, 6, 46], lineArray),
			polygonFromIntersectionOfLines([0, 52, 42, 0], lineArray),
			polygonFromIntersectionOfLines([0, 58, 6, 52, 0], lineArray),
			polygonFromIntersectionOfLines([0, 19, 6, 58, 0], lineArray)
		],
		[
			polygonFromIntersectionOfLines([6, 54, 12, 18, 6], lineArray),
			polygonFromIntersectionOfLines([6, 46, 54, 6], lineArray),
			polygonFromIntersectionOfLines([46, 48, 12, 46], lineArray),
			polygonFromIntersectionOfLines([6, 52, 12, 48, 6], lineArray),
			polygonFromIntersectionOfLines([52, 42, 12, 52], lineArray),
			polygonFromIntersectionOfLines([6, 58, 42, 6], lineArray),
			polygonFromIntersectionOfLines([6, 19, 12, 58, 6], lineArray)
		],
		[
			polygonFromIntersectionOfLines([12, 46, 18, 12], lineArray),
			polygonFromIntersectionOfLines([46, 54, 47, 46], lineArray),
			polygonFromIntersectionOfLines([12, 48, 52, 54, 12], lineArray),
			polygonFromIntersectionOfLines([12, 52, 48, 12], lineArray),
			polygonFromIntersectionOfLines([52, 48, 47, 52], lineArray),
			polygonFromIntersectionOfLines([12, 58, 48, 52, 12], lineArray),
			polygonFromIntersectionOfLines([58, 42, 47, 58], lineArray),
			polygonFromIntersectionOfLines([42, 12, 19, 42], lineArray)
		],
		[
			polygonFromIntersectionOfLines([47, 52, 18, 47], lineArray),
			polygonFromIntersectionOfLines([52, 54, 58, 53, 52], lineArray),
			polygonFromIntersectionOfLines([47, 58, 54, 47], lineArray),
			polygonFromIntersectionOfLines([58, 54, 53, 58], lineArray),
			polygonFromIntersectionOfLines([58, 48, 53, 54, 58], lineArray),
			polygonFromIntersectionOfLines([48, 47, 19, 48], lineArray)
		],
		[
			polygonFromIntersectionOfLines([53, 58, 18, 53], lineArray),
			polygonFromIntersectionOfLines([53, 54, 59, 58, 53], lineArray),
			polygonFromIntersectionOfLines([53, 19, 54, 53], lineArray)
		]
	];
</script>

<DopplerSvg {id} {size}>
	<filter id="HEXLINES-shrink">
		<feMorphology in="SourceAlpha" operator="erode" radius={2} />
		<feColorMatrix
			values="0 0 0 0 1
              0 0 0 0 1
              0 0 0 0 0.75
              0 0 0 1 0"
		/>
		<feGaussianBlur stdDeviation="2" result="border" />
		<feMorphology in="SourceGraphic" operator="erode" radius={3} />
		<feOffset dy="2" />
		<feMerge>
			<feMergeNode in="border" />
			<feMergeNode />
		</feMerge>
	</filter>
	<filter id="HEXLINES-glow">
		<feGaussianBlur stdDeviation="3" />
		<feMerge>
			<feMergeNode />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
	<filter id="HEXLINES-glow2">
		<feMorphology operator="dilate" radius="1" />
		<feGaussianBlur stdDeviation="5" />
		<feColorMatrix
			values="1 0 0 0 1
              0 1 0 0 1
              0 0 1 0 1
              0 0 0 1 0"
		/>
		<feMerge>
			<feMergeNode />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
	<style>
		svg#HEXLINES {
			& .filtered {
				fill: oklch(0.25 33% 300 / 1);
				filter: url(#HEXLINES-shrink);
			}
		}
	</style>
	<radialGradient id="HEXLINES-rg" r="50%">
		<stop offset="0%" stop-color="oklch(1 100% 90)" />
		<stop offset="50%" stop-color="oklch(1 100% 60)" />
		<stop offset="100%" stop-color="oklch(0 100% 300)" />
	</radialGradient>
	<HexPattern
		id="HEXLINES-hexpattern"
		stroke="oklch(0.75 100% 60 / 0.25)"
		size={(radii[2] * phi ** 2) / 4}
		patternTransform="rotate(30)"
	/>
	<Background {size} fill="url(#HEXLINES-rg)" />
	<g filter="url(#HEXLINES-glow)">
		<Background {size} fill="url(#HEXLINES-hexpattern)" />
		<LineWithLegend {lineArray} style={`stroke:oklch(1 100% 90);`} />
	</g>
	{#each polygonGroups as pg, pgi}
		{#each pg as points, i}
			<PolygonToRadial
				{points}
				angles={angles.map((a) => a - 90)}
				classname={`filtered p${i} pg${pgi}`}
			/>
		{/each}
	{/each}
	<g filter="url(#HEXLINES-glow2)">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(1 100% 270);fill:none;`} />
		{/each}
	</g>
</DopplerSvg>
