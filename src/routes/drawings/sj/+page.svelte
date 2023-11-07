<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 7),
		updated_at: new Date(2023, 10, 7)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { anglesArray, intersection, phi, radialPoint, starPath } from '$lib/geometry';

	const id = 'SJ';
	const size = 2 ** 11 + 1;
	const r = size / 4;
	const radii = [r, r * phi, r * phi ** 2, r * phi ** 3];
	const angles = anglesArray(10);
	const ocircles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...angles.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) }))).flat(),
		...angles.map((a) => ({ r: radii[2], ...radialPoint(a, radii[0] + radii[3]) }))
	];
	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[2], { center: radialPoint(a, radii[0] + radii[3]) }),
					radialPoint(angles[(i + 4) % 10], radii[2], {
						center: radialPoint(angles[(i + 4) % 10], radii[0] + radii[3])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 9) % 10], radii[2], {
						center: radialPoint(a, radii[0] + radii[3])
					}),
					radialPoint(angles[(i + 3) % 10], radii[2], {
						center: radialPoint(angles[(i + 2) % 10], radii[0] + radii[3])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 10], radii[2], {
						center: radialPoint(a, radii[0] + radii[3])
					}),
					radialPoint(angles[(i + 5) % 10], radii[2], {
						center: radialPoint(angles[(i + 6) % 10], radii[0] + radii[3])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % 10], radii[2], {
						center: radialPoint(a, radii[0] + radii[3])
					}),
					radialPoint(angles[(i + 2) % 10], radii[2], {
						center: radialPoint(a, radii[0] + radii[3])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % 10], radii[2], {
						center: radialPoint(a, radii[0] + radii[3])
					}),
					radialPoint(angles[(i + 4) % 10], radii[2], {
						center: radialPoint(angles[(i + 2) % 10], radii[0] + radii[3])
					})
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 4) % 10], radii[2], {
						center: radialPoint(angles[(i + 4) % 10], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 9) % 10], radii[2], {
						center: radialPoint(a, radii[0])
					}),
					radialPoint(angles[(i + 3) % 10], radii[2], {
						center: radialPoint(angles[(i + 2) % 10], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 10], radii[2], {
						center: radialPoint(a, radii[0])
					}),
					radialPoint(angles[(i + 5) % 10], radii[2], {
						center: radialPoint(angles[(i + 6) % 10], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % 10], radii[2], {
						center: radialPoint(a, radii[0])
					}),
					radialPoint(angles[(i + 4) % 10], radii[2], {
						center: radialPoint(angles[(i + 2) % 10], radii[0])
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
			intersectionsWithMagnitudeMap.set(i, 7);
		} else {
			intersectionsWithMagnitudeMap.set(i, intersectionsWithMagnitudeMap.get(i) + 1);
		}
	});
	const circles: Circle[] = [...intersectionsWithMagnitudeMap]
		.map((e) => {
			const c = JSON.parse(e[0]);
			return { x: c.x, y: c.y, r: e[1] };
		})
		.filter((c) => c.r !== 8);
	const circleRadii = new Set([...circles.map((c) => c.r).sort((a, b) => a - b)]);
	const colors = new Map([...circleRadii].map((r, i) => [r, (360 / circleRadii.size) * i + 300]));
	console.log(colors);
</script>

<DopplerSvg {id} {size} zoom={0}>
	<defs>
		<style>
			svg#SJ {
				& circle {
					stroke: oklch(1 100% 90 / 1);
					fill: none;
				}
				& line {
					stroke: oklch(1 100% 330 / 1);
				}
				& line.i {
					stroke: oklch(1 100% 210 / 1);
				}
			}
		</style>
		<filter id="SJ-glow">
			<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="o" />
			<feMorphology in="SourceGraphic" operator="dilate" radius="2" />
			<feGaussianBlur stdDeviation="13" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="o" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="SJ-rg" r={0.5 * Math.sqrt(2)}>
			<stop offset="0%" stop-color="oklch(0.5 100% 330 / 1)" />
			<stop offset="100%" stop-color="oklch(0 100% 330 / 1)" />
		</radialGradient>
	</defs>
	<Background {size} fill="oklch(0.2 100% 210)" />
	<Background {size} fill="url(#SJ-rg)" />

	<g filter="url(#SJ-glow)">
		{#each ocircles as c}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each lineArray as l, i}
			<line x1={l[0].x} y1={l[0].y} x2={l[1].x} y2={l[1].y} class={i > 49 ? 'i' : 'o'} />
		{/each}
		{#each circles.reverse() as c}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style={`fill:oklch(1 50% ${colors.get(c.r)});stroke:oklch(0.5 100% ${colors.get(c.r)});`}
			/>
		{/each}
	</g>
</DopplerSvg>
