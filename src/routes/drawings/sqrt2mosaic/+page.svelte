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

	const id = 'SQRT2MOSAIC';
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
		<filter id="SQRT2MOSAIC-shrink">
			<feMorphology in="SourceAlpha" operator="erode" radius="1" />
			<feGaussianBlur stdDeviation="2" />
			<feOffset dy="3" result="shadow" />
			<feMorphology in="SourceAlpha" result="erode2" operator="erode" radius="2" />
			<feColorMatrix
				in="erode2"
				result="border"
				values="0 0 0 0 0.3
                0 0 0 0 0.2
                0 0 0 0 0.1
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
		<filter id="SQRT2MOSAIC-flames">
			<feTurbulence type="fractalNoise" baseFrequency="0.0125" numOctaves="4" />
			<feDisplacementMap in2="turbulence" scale="128" xChannelSelector="B" yChannelSelector="R" />
			<feColorMatrix
				values="0 0 0 0 1
                0 0 0 0 0.125
                0 0 0 0 0
                0 0 0 1 0"
			/>
		</filter>
		<filter id="SQRT2MOSAIC-tile">
			<feMorphology in="SourceAlpha" operator="dilate" radius="4" result="dilate" />
			<feFlood flood-color="oklch(0.25 50% 60)" result="glowcolor" />
			<feComposite in="glowcolor" in2="dilate" operator="in" />
			<feGaussianBlur stdDeviation="36" />
			<feOffset dy="9" result="glow" />
			<feTurbulence type="fractalNoise" baseFrequency="0.33" result="noise" />
			<feComposite in="SourceGraphic" in2="noise" operator="in" />
			<feColorMatrix
				values="0 0 0 0 0.2
                0 0 0 0 0.05
                0 0 0 0 0.01
                0 0 0 0.5 0"
				result="wash"
			/>
			<feDisplacementMap
				in="SourceGraphic"
				in2="noise"
				scale="3"
				xChannelSelector="R"
				yChannelSelector="G"
			/>
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
				<feMergeNode in="wash" />
			</feMerge>
		</filter>

		<style>
			svg#SQRT2MOSAIC {
				& g.filtered {
					filter: url(#SQRT2MOSAIC-shrink);
				}
        & #polygons {
          filter: url(#SQRT2MOSAIC-tile);
        }
		</style>
		<linearGradient id="SQRT2MOSAIC-lg" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="oklch(1 50% 60)" />
			<stop offset="100%" stop-color="oklch(0 50% 60)" />
		</linearGradient>
	</defs>
	<Background {size} fill="url(#SQRT2MOSAIC-lg)" />
	<Background {size} fill="oklch(0.33 10% 30)" filter="url(#SQRT2MOSAIC-flames)" />
	<g id="polygons">
		{#each polygonGroups as pg, pgi}
			{#each pg as points, i}
				<PolygonToRadial
					{points}
					angles={angles.map((a) => a - 90)}
					classname={`filtered p${i} pg${pgi}`}
					style={`fill:oklch(${0.1 + (1 / polygonGroups.length) * pgi} 50% 60)`}
				/>
			{/each}
		{/each}
	</g>
</DopplerSvg>
