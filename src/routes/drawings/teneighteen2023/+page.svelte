<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 18, 21),
		updated_at: new Date(2023, 9, 18, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';
	import {
		anglesArray,
		pentagram,
		phi,
		polygonFromIntersectionOfLines,
		radialPoint
	} from '$lib/geometry';

	const id = 'TENEIGHTEEN2023';
	const size = 2 ** 10;
	const angles = anglesArray(5);
	const r0 = (size / 4) * 0.85;
	const radii = [r0, r0 * phi, r0 * phi ** 2];
	const r1 = radii[0] + radii[1];
	const r2 = radii[0] * 2;
	const r3 = radii[0] + radii[1] * 2;
	const circles: Circle[] = [
		{ r: radii[0], x: 0, y: 0 },
		...angles.map((a) => ({ r: radii[0], ...radialPoint(a, radii[0]) })),
		...angles.map((a) => ({ r: radii[2], ...radialPoint(a, radii[0]) })),
		...angles.map((a, i) => ({ r: radii[1], ...radialPoint(a, radii[0] + radii[1]) })),
		{ r: r1, x: 0, y: 0 },
		{ r: r2, x: 0, y: 0 },
		{ r: r3, x: 0, y: 0 }
	];
	const lineArray: Line[] = [
		...angles.map((a, i) => [radialPoint(a, r3), radialPoint(angles[(i + 2) % 5], r3)] as Line),
		...angles.map((a, i) => [radialPoint(a, r2), radialPoint(angles[(i + 2) % 5], r2)] as Line),
		...angles.map(
			(a, i) => [radialPoint(a - 36, r1), radialPoint(angles[(i + 2) % 5] - 36, r1)] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a - 36, r1), radialPoint(angles[(i + 1) % 5] - 36, r1)] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 4) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 2) % 5], radii[1], {
						center: radialPoint(angles[(i + 1) % 5], r1)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 4) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 5) % 5], radii[1], {
						center: radialPoint(angles[(i + 1) % 5], r1)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 0) % 5], radii[1], {
						center: radialPoint(angles[(i + 4) % 5], r1)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 4) % 5], radii[1], {
						center: radialPoint(a, r1)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 4) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 1) % 5], radii[1], {
						center: radialPoint(angles[(i + 2) % 5], r1)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 3) % 5], radii[1], {
						center: radialPoint(angles[(i + 2) % 5], r1)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % 5] + 180, radii[2], { center: radialPoint(a, r0) }),
					radialPoint(angles[(i + 0) % 5] + 180, radii[2], {
						center: radialPoint(angles[(i + 2) % 5], r0)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % 5] + 180, radii[2], { center: radialPoint(a, r0) }),
					radialPoint(angles[(i + 4) % 5] + 180, radii[2], {
						center: radialPoint(angles[(i + 1) % 5], r0)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % 5] + 180, radii[2], { center: radialPoint(a, r0) }),
					radialPoint(angles[(i + 2) % 5] + 180, radii[2], {
						center: radialPoint(angles[(i + 4) % 5], r0)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 1) % 5], radii[1], {
						center: radialPoint(angles[(i + 2) % 5], r1)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 4) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 3) % 5], radii[2], {
						center: radialPoint(angles[(i + 0) % 5], r0)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 2) % 5], radii[2], {
						center: radialPoint(angles[(i + 0) % 5], r0)
					})
				] as Line
		)
	];
	const polygons: string[] = [
		polygonFromIntersectionOfLines([15, 40, 69, 68, 15], lineArray),
		polygonFromIntersectionOfLines([15, 48, 69, 65, 15], lineArray),
		polygonFromIntersectionOfLines([15, 16, 69, 65, 15], lineArray),
		polygonFromIntersectionOfLines([0, 45, 5, 75, 0], lineArray),
		polygonFromIntersectionOfLines([0, 40, 5, 72, 0], lineArray),
		polygonFromIntersectionOfLines([61, 41, 20, 48, 61], lineArray),
		polygonFromIntersectionOfLines([55, 14, 10, 59, 55], lineArray),
		polygonFromIntersectionOfLines([0, 48, 40, 3, 0], lineArray),
		polygonFromIntersectionOfLines([5, 24, 20, 8, 5], lineArray),
		polygonFromIntersectionOfLines([40, 53, 50, 48, 40], lineArray),
		polygonFromIntersectionOfLines([], lineArray),
		polygonFromIntersectionOfLines([], lineArray),
		polygonFromIntersectionOfLines([], lineArray)
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TENEIGHTEEN2023 {
				& .filtered {
					filter: url(#TENEIGHTEEN2023-filter);
				}
			}
		</style>
		<filter id="TENEIGHTEEN2023-filter">
			<feMorphology in="SourceAlpha" operator="dilate" radius="5" />
			<feGaussianBlur stdDeviation="5" />
			<feOffset dy="0" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.75 75% 90);fill:none;`} />
	{/each}
	<LineWithLegend lineArray={lineArray.slice()} style={`stroke: oklch(0.5 100% 150)`} />
	<g transform="rotate(18)">
		{#each polygons as points, i}
			<PolygonToRadial
				{points}
				{angles}
				style={`fill:oklch(1 100% 90 / 0.25);stroke:oklch(1 100% 90)`}
				classname="filtered"
			/>
		{/each}
	</g>
	<!-- <LineWithLegend showLegend lineArray={lineArray.slice()} style={`stroke: oklch(0.75 0% 150)`} /> -->
</DopplerSvg>
