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
	const d = 5;
	const rotate = false;
	const angles = anglesArray(d);
	const r = size * 0.24;
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
					radialPoint(angles[(i + 1) % 5], radii[0], {
						center: radialPoint(angles[(i + 1) % 5], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 36, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 36, radii[0], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 36, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 36, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 72, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 72, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 144, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 144, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 216, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 216, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 288, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 288, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 360, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 36, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 36, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 108, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a - 36, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 36, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 108, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 72, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 144, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 216, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 288, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 360, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 72, radii[2], { center: radialPoint(a, radii[0]) }),
					{ x: 0, y: 0 }
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 288, radii[2], { center: radialPoint(a, radii[0]) }),
					{ x: 0, y: 0 }
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 36, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 0, radii[2], {
						center: radialPoint(angles[(i + 4) % 5], radii[0])
					})
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 36, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 0, radii[2], {
						center: radialPoint(angles[(i + 1) % 5], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 36, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 108, radii[1], {
						center: radialPoint(angles[(i + 2) % 5], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii[0]), radialPoint(angles[(i + 1) % 5], radii[0])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a + 36, radii[0]), radialPoint(angles[(i + 2) % 5] + 36, radii[0])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii[1]), radialPoint(angles[(i + 2) % 5], radii[1])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a + 36, radii[2]), radialPoint(angles[(i + 1) % 5] + 36, radii[2])] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 72, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 2) % 5], radii[0], {
						center: radialPoint(angles[(i + 3) % 5], radii[0])
					})
				] as Line
		)
	];
	const polygonGroups: string[][] = [];
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
                0 0 1 0 1
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
				}
		</style>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.33 0 0);fill:none;`} />
	{/each}
	<g id="original-polygons" style={`stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.2)`}>
		{#each circles as c, i}
			<path
				d={polygonPath(d, c.r, { center: { x: c.x, y: c.y }, rotate: rotate ? 360 / d / 2 : 0 })}
			/>
			<path
				d={polygonPath(d, c.r, { center: { x: c.x, y: c.y }, rotate: !rotate ? 360 / d / 2 : 0 })}
			/>
		{/each}
	</g>
	<g id="lines">
		<!-- <LineWithLegend {lineArray} style="stroke:oklch(0.5 100% 300);" /> -->
	</g>
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
</DopplerSvg>
