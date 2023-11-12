<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 11, 8),
		updated_at: new Date(2023, 10, 11, 8)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';
	import {
		anglesArray,
		arrayMap,
		phi,
		polygonFromIntersectionOfLines,
		polygonPath,
		radialPoint
	} from '$lib/geometry';

	const id = 'TILED-SUN';
	const size = 2 ** 10;
	const d = 10;
	const angles = anglesArray(d);
	const angles2 = anglesArray(d * 2);
	const r = size * 0.25;
	const radii = arrayMap(3, (n) => r * phi ** n);
	const circles = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...radii.map((r) => angles.map((a) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 1) % d], radii[0], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % d], radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 2) % d], radii[1], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % d], radii[1], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 1) % d], radii[0], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 9) % d], radii[1], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 0) % d], radii[1], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					})
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 9) % d], radii[0], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					}),
					radialPoint(angles[(i + 0) % d], radii[0], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % d], radii[2], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 1) % d], radii[2], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % d], radii[2], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 2) % d], radii[2], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % d], radii[0], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					}),
					radialPoint(angles[(i + 0) % d], radii[2], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % d], radii[1], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 3) % d], radii[1], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % d], radii[2], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 9) % d], radii[1], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % d], radii[1], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					}),
					radialPoint(angles[(i + 9) % d], radii[1], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 9) % d], radii[0], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					}),
					radialPoint(angles[(i + 6) % d], radii[0], {
						center: radialPoint(angles[(i + 3) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % d], radii[1], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 9) % d], radii[1], {
						center: radialPoint(angles[(i + 2) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 7) % d], radii[2], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 8) % d], radii[2], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 3) % d], radii[2], {
						center: radialPoint(angles[(i + 0) % d], radii[0])
					}),
					radialPoint(angles[(i + 4) % d], radii[2], {
						center: radialPoint(angles[(i + 0) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 4) % d], radii[2], {
						center: radialPoint(angles[(i + 0) % d], radii[0])
					}),
					radialPoint(angles[(i + 9) % d], radii[2], {
						center: radialPoint(angles[(i + 3) % d], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % d], radii[1], {
						center: radialPoint(angles[(i + 1) % d], radii[0])
					}),
					radialPoint(angles[(i + 5) % d], radii[1], {
						center: radialPoint(angles[(i + 0) % d], radii[0])
					})
				] as Line
		)
	];
	const polygonGroups: string[][] = [
		[polygonFromIntersectionOfLines([9, 0, 29, 19, 9], lineArray)],
		[
			polygonFromIntersectionOfLines([0, 10, 20, 30, 89, 19, 29, 0], lineArray),
			polygonFromIntersectionOfLines([19, 89, 30, 79, 19], lineArray),
			polygonFromIntersectionOfLines([20, 30, 89, 40, 20], lineArray),
			polygonFromIntersectionOfLines([30, 89, 40, 79, 30], lineArray)
		],
		[
			polygonFromIntersectionOfLines([40, 70, 60, 50, 40], lineArray),
			polygonFromIntersectionOfLines([50, 60, 100, 90, 50], lineArray),
			polygonFromIntersectionOfLines([40, 90, 120, 110, 40], lineArray),
			polygonFromIntersectionOfLines([100, 70, 117, 121, 100], lineArray),
			polygonFromIntersectionOfLines([110, 120, 161, 110], lineArray),
			polygonFromIntersectionOfLines([161, 121, 117, 161], lineArray)
		],
		[
			polygonFromIntersectionOfLines([116, 110, 120, 116], lineArray),
			polygonFromIntersectionOfLines([130, 120, 140, 130], lineArray),
			polygonFromIntersectionOfLines([116, 130, 158, 116], lineArray),
			polygonFromIntersectionOfLines([140, 110, 150, 140], lineArray),
			polygonFromIntersectionOfLines([158, 150, 159, 158], lineArray),
			polygonFromIntersectionOfLines([119, 159, 117, 119], lineArray)
		],
		[
			polygonFromIntersectionOfLines([116, 160, 118, 116], lineArray),
			polygonFromIntersectionOfLines([160, 119, 117, 160], lineArray)
		],
		[polygonFromIntersectionOfLines([118, 117, 119, 118], lineArray)]
	];
	const raylines = angles2.map(
		(a) => [radialPoint(a + 9, 0), radialPoint(a + 9, size * 0.5)] as Line
	);
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
                0 1 0 0 1
                0 0 1 0 0.5
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
					fill: oklch(1 0 0 / 0.25);
					--hue0: 210;
					--hue1: calc(var(--hue0) + 60);
					--hue2: calc(var(--hue0) + 30);
					--hue3: calc(var(--hue0) - 120);
					--hue4: calc(var(--hue0) - 150);
				}
				& g.pg0 {
					fill: oklch(0.5 100% var(--hue0));
				}
				& g.pg1 {
					fill: oklch(0.95 100% var(--hue1));
				}
				& g.pg1.p1,
				g.pg1.p2 {
					fill: oklch(0.8 100% var(--hue1));
				}
				& g.pg1.p3 {
					fill: oklch(0.5 100% var(--hue1));
				}
				& g.pg2 {
					fill: oklch(0.5 100% var(--hue2));
				}
				& g.pg2.p1 {
					fill: oklch(0.75 100% var(--hue2));
				}
				& g.pg2.p2,
				g.pg2.p3 {
					fill: oklch(0.385 100% var(--hue2));
				}
				& g.pg2.p4,
				g.pg2.p5 {
					fill: oklch(0.25 100% var(--hue2));
				}
				& g.pg3 {
					fill: oklch(0.9 50% var(--hue3));
				}
				& g.pg3.p0 {
					fill: oklch(1 50% var(--hue3));
				}
				& g.pg3.p1,
				g.pg3.p5 {
					fill: oklch(0.9 50% var(--hue3));
				}
				& g.pg3.p2,
				g.pg3.p3 {
					fill: oklch(0.8 50% var(--hue3));
				}
				& g.pg3.p4 {
					fill: oklch(0.7 50% var(--hue3));
				}
				& g.pg4 {
					fill: oklch(1 100% var(--hue4));
				}
				& g.pg5 {
					fill: oklch(1 75% var(--hue4));
				}
				& #everything {
					/* display: none; */
				}
			}
		</style>
		<radialGradient id="TILED-SUN-rg">
			<stop offset="0%" stop-color="oklch(1 100% 60)" />
			<stop offset="75%" stop-color="oklch(1 100% 90)" />
			<stop offset="100%" stop-color="oklch(0.05 100% 30)" />
		</radialGradient>
		<filter id="TILED-SUN-distort" x="-25%" y="-25%" width="200%" height="200%">
			<feTurbulence
				seed="13"
				type="fractalNoise"
				baseFrequency="0.03"
				numOctaves="8"
				result="turbulence"
			/>
			<feDisplacementMap
				in="SourceGraphic"
				in2="turbulence"
				scale="256"
				xChannelSelector="R"
				yChannelSelector="&"
				result="fire"
			/>
			<feColorMatrix
				values="1 0 0 0 0
                0 0 0 0 0
                0 0 0 0 0
                0 0 0 1 0"
			/>
			<feGaussianBlur stdDeviation="2" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="fire" />
			</feMerge>
		</filter>
		<filter id="TILED-SUN-tile">
			<feTurbulence type="fractalNoise" baseFrequency="0.075" result="noise" />
			<feComposite in="SourceGraphic" in2="noise" operator="in" />
			<feColorMatrix
				values="1 0 0 0.75 0
                0 1 0 0.5 0
                0 0 1 0.5 0
                0 0 0 0.1 0"
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
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
				<feMergeNode in="wash" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="url(#TILED-SUN-rg)" />
	<g filter="url(#TILED-SUN-distort)">
		<LineWithLegend lineArray={raylines} style="stroke:oklch(1 50% 60 / 0.5);stroke-width:10;" />
	</g>
	<g id="everything" transform="rotate(18)">
		<g id="lines">
			<LineWithLegend {lineArray} style="stroke:oklch(1 0 0)" />
		</g>
		<g id="polygons" filter="url(#TILED-SUN-tile)">
			{#each polygonGroups as pg, pgi}
				{#each pg as points, i}
					<PolygonToRadial
						{points}
						angles={angles.map((a) => a - 90)}
						classname={`filtered p${i} pg${pgi}`}
					/>
				{/each}
			{/each}
		</g>
	</g>
</DopplerSvg>
