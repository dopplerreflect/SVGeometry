<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 12, 9),
		updated_at: new Date(2023, 9, 12, 10)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		radialPoint,
		phi,
		circleIntersections,
		polygonFromIntersectionOfLines
	} from '$lib/geometry';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';

	const id = 'TENSTACK-SILVER';
	const size = 2 ** 10;
	const r = (size / 4) * 0.95;
	const angles = anglesArray(10, 0);
	const radii = [r, r * phi, r * phi ** 2];
	const circles: Circle[] = angles
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) })))
		.flat();
	const intersections: Point[] = [3, 6, 9, 12].map(
		(i) => circleIntersections(circles[0], circles[i])[0]
	);
	const radii2 = intersections.map((i) => Math.hypot(i.x, i.y));
	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[radialPoint(a + 18, radii2[0]), radialPoint(angles[(i + 2) % 10] + 18, radii2[0])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a + 18, radii2[0]), radialPoint(angles[(i + 3) % 10] + 18, radii2[0])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a + 18, radii2[0]), radialPoint(angles[(i + 4) % 10] + 18, radii2[0])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a + 18, radii2[0]), radialPoint(a + 18, radii2[3])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii2[1]), radialPoint(angles[(i + 2) % 10], radii2[1])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii2[1]), radialPoint(angles[(i + 3) % 10], radii2[1])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii2[1]), radialPoint(angles[(i + 4) % 10], radii2[1])] as Line
		),
		...angles.map((a, i) => [radialPoint(a, radii2[1]), { x: 0, y: 0 }] as Line),
		...angles.map(
			(a, i) =>
				[radialPoint(a + 18, radii2[2]), radialPoint(angles[(i + 3) % 10] + 18, radii2[2])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a + 18, radii2[2]), radialPoint(angles[(i + 4) % 10] + 18, radii2[2])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii2[3]), radialPoint(angles[(i + 4) % 10], radii2[3])] as Line
		)
	];
	const polygons: string[] = [
		polygonFromIntersectionOfLines([7, 64, 67, 5, 7], lineArray),
		polygonFromIntersectionOfLines([17, 55, 57, 14, 17], lineArray),
		polygonFromIntersectionOfLines([27, 46, 47, 23, 27], lineArray),
		polygonFromIntersectionOfLines([68, 65, 67, 64, 68], lineArray),
		polygonFromIntersectionOfLines([68, 94, 97, 64, 68], lineArray),
		polygonFromIntersectionOfLines([27, 85, 87, 24, 27], lineArray),
		polygonFromIntersectionOfLines([68, 24, 27, 64, 68], lineArray),
		polygonFromIntersectionOfLines([68, 15, 17, 64, 68], lineArray),
		polygonFromIntersectionOfLines([67, 78, 77, 64, 67], lineArray),
		polygonFromIntersectionOfLines([26, 104, 107, 24, 26], lineArray),
		polygonFromIntersectionOfLines([107, 105, 106, 104, 107], lineArray),
		polygonFromIntersectionOfLines([66, 94, 96, 65, 66], lineArray)
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TENSTACK-SILVER {
				& circle,
				path:not(.Background) {
					stroke: oklch(1 50% 300);
					fill: none;
				}
				& line {
					stroke: oklch(1 100% 100 / 1);
				}
				& path.fill {
					stroke: none;
					fill: oklch(0.5 0 0);
				}
				& g.filtered {
					filter: url(#TENSTACK-SILVER-dropshadow);
				}
			}
		</style>
		<filter id="TENSTACK-SILVER-dropshadow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="5" />
			<feGaussianBlur stdDeviation="5" />
			<feOffset dy="8" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="TENSTACK-SILVER-glow">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1" result="dilate" />
			<feFlood flood-color="oklch(0.5 100% 270)" />
			<feComposite in2="dilate" operator="in" />
			<feGaussianBlur stdDeviation="3" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 100% 210)" />
	<LineWithLegend {lineArray} />
	<g filter="url(#TENSTACK-SILVER-glow)">
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} id={`c${i}`} />
		{/each}
	</g>

	<PolygonToRadial
		points={polygons[0]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[1]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[2]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[3]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[4]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[5]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[6]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[7]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[8]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[9]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[10]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
	<PolygonToRadial
		points={polygons[11]}
		{angles}
		style="stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.25)"
	/>
</DopplerSvg>
