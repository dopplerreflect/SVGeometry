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

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const d = 10;
	const angles = anglesArray(d);
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
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="TEMPLATE-shrink">
			<feMorphology operator="erode" radius="3" />
		</filter>
		<style>
			svg#TEMPLATE {
				& g.filtered {
					filter: url(#TEMPLATE-shrink);
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
					fill: oklch(1 50% var(--hue3));
				}
				& g.pg3.p0 {
					fill: oklch(0.9 50% var(--hue3));
				}
				& g.pg3.p2,
				g.pg3.p3 {
					fill: oklch(0.9 75% var(--hue3));
				}
				& g.pg3.p4 {
					fill: oklch(0.65 50% var(--hue3));
				}
				& g.pg4 {
					fill: oklch(1 100% var(--hue4));
				}
				& g.pg5 {
					fill: oklch(0.5 100% var(--hue4));
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.5 0 0)" />
	<g id="everything" transform="rotate(0)">
		{#each circles as c}
			<!-- <circle style="fill:none;stroke:oklch(0.5 0 0);" r={c.r} cx={c.x} cy={c.y} /> -->
			<!-- <path
			style="fill:none;stroke:oklch(0.75 0 0)"
			d={polygonPath(d, c.r, { center: { x: c.x, y: c.y } })}
		/> -->
		{/each}
		<g id="polygons">
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

		<g id="lines">
			<LineWithLegend {lineArray} style="stroke:oklch(1 0 0)" />
		</g>
	</g>
</DopplerSvg>

<style>
</style>
