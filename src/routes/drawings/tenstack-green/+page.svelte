<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 12, 13),
		updated_at: new Date(2023, 9, 12, 15)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';
	import {
		anglesArray,
		arrayMap,
		circleIntersections,
		phi,
		polygonFromIntersectionOfLines,
		radialPoint
	} from '$lib/geometry';

	const id = 'TENSTACK-GREEN';
	const size = 2 ** 10;
	const r = (size / 4) * 0.95;
	const radii = [r, r * phi, r * phi ** 2];
	const angles = anglesArray(10, 0);
	const circles: Circle[] = angles
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) })))
		.flat();
	circles.push(...radii.map((r) => ({ r, x: 0, y: 0 })));
	const i0 = circleIntersections(circles[0], circles[3])[0];
	const c0 = Math.hypot(i0.x, i0.y);
	const i1 = circleIntersections(circles[1], circles[4])[0];
	const c1 = Math.hypot(i1.x, i1.y);

	const vesicaRadii = [0, 1, 2].map((i) => {
		let ci = circleIntersections(circles[i], circles[i + 3])[0];
		return Math.hypot(ci.x, ci.y);
	});

	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[0] + radii[1]),
					radialPoint(angles[(i + 3) % 10], radii[0] + radii[1])
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 18, vesicaRadii[0]),
					radialPoint(angles[(i + 4) % 10] - 18, vesicaRadii[0])
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 18, vesicaRadii[1]),
					radialPoint(angles[(i + 4) % 10] - 18, vesicaRadii[1])
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 18, vesicaRadii[2]),
					radialPoint(angles[(i + 4) % 10] - 18, vesicaRadii[2])
				] as Line
		)
	];
	const polygons: string[] = [
		polygonFromIntersectionOfLines([4, 7, 5, 6, 4], lineArray),
		polygonFromIntersectionOfLines([25, 26, 35, 36, 25], lineArray),

		polygonFromIntersectionOfLines([14, 18, 15, 17, 14], lineArray),
		polygonFromIntersectionOfLines([24, 28, 25, 27, 24], lineArray),
		polygonFromIntersectionOfLines([34, 38, 35, 37, 34], lineArray),
		polygonFromIntersectionOfLines([34, 37, 25, 26, 34], lineArray),
		polygonFromIntersectionOfLines([24, 27, 34, 37, 24], lineArray),
		polygonFromIntersectionOfLines([14, 17, 24, 27, 14], lineArray)
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TENSTACK-GREEN {
				& circle {
					stroke: oklch(1 100% 330);
					fill: none;
				}
				& line {
					stroke: oklch(0.75 0 0);
				}
				& g.filtered {
					filter: url(#TENSTACK-GREEN-dropshadow);
				}
			}
		</style>
		<filter id="TENSTACK-GREEN-dropshadow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="5" />
			<feGaussianBlur stdDeviation="5" />
			<feOffset dy="8" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="TENSTACK-GREEN-glow">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1" result="dilate" />
			<feFlood flood-color="oklch(1 100% 270)" />
			<feComposite in2="dilate" operator="in" />
			<feGaussianBlur stdDeviation="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 0 0)" />
	{#each arrayMap(polygons.length, (n) => n) as i}
		<PolygonToRadial
			points={polygons[i]}
			{angles}
			style={`fill:oklch(${1 / (polygons.length + 1) + (1 / (polygons.length + 1)) * (i + 1)} ${
				(100 / (polygons.length - 1)) * (i + 1)
			}% 150 / 0.33);stroke:oklch(1 25% 90);`}
			classname="filtered"
		/>
		{#if i === 0}
			<g filter="url(#TENSTACK-GREEN-glow)">
				{#each circles as c}
					<circle r={c.r} cx={c.x} cy={c.y} />
				{/each}
			</g>
		{/if}
	{/each}
	<!-- <LineWithLegend {lineArray} showLegend /> -->
	<!-- <circle r={radii[2]} style={`fill:black`} /> -->
</DopplerSvg>
