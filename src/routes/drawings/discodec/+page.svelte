<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(),
		updated_at: new Date()
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { anglesArray, circleIntersections, intersection, phi, radialPoint } from '$lib/geometry';

	const id = 'DISCODEC';
	const size = 2 ** 10;
	const r = size * 0.23;
	const radii = [r, r * phi, r * phi ** 2];
	const angles = anglesArray(10, 9);
	const circles: Circle[] = [
		...angles.map((a, i) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) }))).flat(),
		...radii.map((r) => ({ r, x: 0, y: 0 }))
	];
	const i0 = circleIntersections(circles[0], circles[3])[0];
	const r0 = Math.hypot(i0.x, i0.y);
	const i1 = circleIntersections(circles[1], circles[4])[0];
	const r1 = Math.hypot(i1.x, i1.y);

	const lineArray: Line[] = [
		...angles.map((a, i) => [radialPoint(a - 18, r0), { x: 0, y: 0 }] as Line),
		...angles.map(
			(a, i) => [radialPoint(a - 18, r0), radialPoint(angles[(i + 1) % 10] - 18, r0)] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a - 18, r0), radialPoint(angles[(i + 2) % 10] - 18, r0)] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a - 18, r0), radialPoint(angles[(i + 3) % 10] - 18, r0)] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a - 18, r0), radialPoint(angles[(i + 4) % 10] - 18, r0)] as Line
		),

		...angles.map((a, i) => [radialPoint(a, radii[0] + radii[1]), { x: 0, y: 0 }] as Line),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[0] + radii[1]),
					radialPoint(angles[(i + 2) % 10], radii[0] + radii[1])
				] as Line
		),
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
					radialPoint(a, radii[0] + radii[1]),
					radialPoint(angles[(i + 4) % 10], radii[0] + radii[1])
				] as Line
		),

		...angles.map(
			(a, i) => [radialPoint(a, radii[0]), radialPoint(angles[(i + 4) % 10], radii[0])] as Line
		),

		...angles.map(
			(a, i) => [radialPoint(a, radii[1]), radialPoint(angles[(i + 3) % 10], radii[1])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii[1]), radialPoint(angles[(i + 4) % 10], radii[1])] as Line
		)
	];

	const rawIntersections: Point[] = [];
	lineArray.forEach((l, i) => {
		for (let n = i + 1; n < lineArray.length; n++) {
			let int = intersection(lineArray[i], lineArray[n]);
			if (int.x > -size / 2 && int.x < size / 2 && int.y > -size / 2 && int.y < size / 2) {
				rawIntersections.push(int);
			}
		}
	});
	const roundedIntersections = rawIntersections.map((i) => ({
		x: Math.floor(i.x),
		y: Math.floor(i.y)
	}));
	const intersectionsWithMagnitudeMap = new Map();
	roundedIntersections.forEach((intersection) => {
		const i = JSON.stringify(intersection);
		if (!intersectionsWithMagnitudeMap.get(i)) {
			intersectionsWithMagnitudeMap.set(i, 2);
		} else {
			intersectionsWithMagnitudeMap.set(i, intersectionsWithMagnitudeMap.get(i) + 0.25);
		}
	});
	const iCircles: Circle[] = [...intersectionsWithMagnitudeMap]
		.map((e) => {
			const c = JSON.parse(e[0]);
			return { x: c.x, y: c.y, r: e[1] };
		})
		.filter((c) => c.r < 45);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="DISCODEC-dotglow">
			<feColorMatrix
				in="SourceGraphic"
				values="1 0 0 0 0.5
                0 1 0 0 0.5
                0 0 1 0 0.5
                0 0 0 1 0"
				result="cm"
			/>
			<feMorphology in="SourceGraphic" operator="dilate" radius="3" />
			<feGaussianBlur stdDeviation="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="cm" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 75% 240)" />
	<LineWithLegend {lineArray} style="stroke:oklch(0.5 100% 150)" />
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} style="stroke:oklch(0.5 50% 210);fill:none;" />
	{/each}
	<g filter="url(#DISCODEC-dotglow)">
		{#each iCircles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style={`fill:oklch(1 100% ${60 + c.r ** 10} / 1)`} />
		{/each}
	</g>
</DopplerSvg>
