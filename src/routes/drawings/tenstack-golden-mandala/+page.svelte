<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 11, 18),
		updated_at: new Date(2023, 9, 11, 23)
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
		pathFromIntersectionsOfLines
	} from '$lib/geometry';
	import PathToRadial from './PathToRadial.svelte';

	const id = 'TENSTACK-GOLDEN-MANDALA';
	const size = 2 ** 10;
	const r = (size / 4) * 0.95;
	const angles = anglesArray(10);
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
	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[9, 70, 58, 79, 7, 9].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[9, 20, 58, 50, 26, 9].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[60, 59, 58, 66, 60].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[59, 96, 99, 58, 59].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[59, 90, 29, 27, 96, 59].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[29, 107, 100, 27, 29].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[100, 107, 109, 106, 100].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#TENSTACK-GOLDEN-MANDALA {
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
					filter: url(#TENSTACK-GOLDEN-MANDALA-dropshadow);
				}
			}
		</style>
		<filter id="TENSTACK-GOLDEN-MANDALA-dropshadow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="5" />
			<feGaussianBlur stdDeviation="5" />
			<feOffset dy="8" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="TENSTACK-GOLDEN-MANDALA-glow">
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

	<PathToRadial
		path={paths[0]}
		{angles}
		rotate={-18}
		style="stroke:oklch(1 0 0);fill:oklch(0.1 100% 300)"
	/>
	<LineWithLegend {lineArray} />
	<PathToRadial
		path={paths[1]}
		{angles}
		rotate={-18}
		style="stroke:oklch(1 0 0);fill:oklch(0.68 50% 300 )"
	/>
	<PathToRadial
		path={paths[2]}
		{angles}
		rotate={-18}
		style="stroke:oklch(1 0 0);fill:oklch(0.36 100% 330 / 0.5)"
	/>

	<PathToRadial
		path={paths[3]}
		{angles}
		rotate={-18}
		style="stroke:oklch(1 0 0);fill:oklch(0.52 100% 300)"
	/>
	<PathToRadial
		path={paths[4]}
		{angles}
		rotate={-18}
		style="stroke:oklch(1 0 0);fill:oklch(0.68 50% 300)"
	/>
	<PathToRadial
		path={paths[5]}
		{angles}
		rotate={-18}
		style="stroke:oklch(1 0 0);fill:oklch(0.84 25% 270)"
	/>
	<PathToRadial
		path={paths[6]}
		{angles}
		rotate={-18}
		style="stroke:oklch(1 0 0);fill:oklch(1 25% 240)"
	/>
	<g filter="url(#TENSTACK-GOLDEN-MANDALA-glow)">
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} id={`c${i}`} />
		{/each}
	</g>
</DopplerSvg>
