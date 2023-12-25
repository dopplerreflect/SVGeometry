<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 11, 24, 19),
		updated_at: new Date(2023, 11, 24, 19)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		arrayMap,
		intersection,
		pentagram,
		phi,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'XMAS';
	const size = 2 ** 10;
	const angles = anglesArray(10);
	const r = size * 0.2401;
	const radii = arrayMap(3, (n) => r * phi ** n);
	const circles: Circle[] = [
		...angles.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
	const stars: string[] = angles
		.map((a, i) => [
			...radii.map((r) => pentagram(r, { center: radialPoint(a, radii[0]), rotate: a + 90 }))
		])
		.flat();
	const lineArray = [
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 4) % 10], radii[0], {
						center: radialPoint(angles[(i + 4) % 10], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 4) % 10], radii[1], {
						center: radialPoint(angles[(i + 4) % 10], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 2) % 10], radii[1], {
						center: radialPoint(angles[(i + 2) % 10], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % 10], radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 8) % 10], radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % 10], radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 8) % 10], radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % 10], radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 4) % 10], radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % 10], radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 6) % 10], radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 2) % 10], radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 6) % 10], radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % 10], radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 4) % 10], radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		)
	];

	const rawIntersections: Point[] = [];
	lineArray.forEach((l, i) => {
		for (let n = i; n < lineArray.length; n++) {
			let int = intersection(l, lineArray[n]);
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
			intersectionsWithMagnitudeMap.set(i, 1);
		} else {
			intersectionsWithMagnitudeMap.set(i, intersectionsWithMagnitudeMap.get(i) + 1);
		}
	});
	const dots: Circle[] = [...intersectionsWithMagnitudeMap]
		.map((e) => {
			const c = JSON.parse(e[0]);
			return { x: c.x, y: c.y, r: e[1] } as Circle;
		})
		.sort((a, b) => b.r - a.r);
	const circleRadii = new Set([...dots.map((c) => c.r).sort((a, b) => a - b)]);
	const colors = new Map([...circleRadii].map((r, i) => [r, (120 / circleRadii.size) * i + 30]));
</script>

<DopplerSvg {id} {size}>
	<defs>
		<radialGradient id="XMAS-rg">
			<stop offset="0%" stop-color="oklch(0.66 50% 150)" />
			<stop offset="100%" stop-color="oklch(0.25 50% 150)" />
		</radialGradient>
		<filter id="XMAS-circleglow">
			<feGaussianBlur stdDeviation="3" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="url(#XMAS-rg)" />
	<g filter="url(#XMAS-circleglow)">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.66 100% 150);fill:none;`} />
		{/each}
	</g>
	{#each stars as d}
		<path {d} style={`fill:oklch(0.75 100% 30 / 0.25)`} />
	{/each}
	<g filter="url(#XMAS-circleglow)">
		<LineWithLegend {lineArray} style="stroke:oklch(0.99 50% 90)" />
	</g>
	<g filter="url(#XMAS-circleglow)">
		{#each dots as c, i}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style={`stroke:oklch(0.99 0% ${colors.get(c.r)});fill:oklch(0.5 100% ${colors.get(
					c.r
				)} / 0.5);`}
			/>
		{/each}
	</g>
</DopplerSvg>
