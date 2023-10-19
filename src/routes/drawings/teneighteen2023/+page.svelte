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
	import { anglesArray, phi, radialPoint } from '$lib/geometry';

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
					radialPoint(angles[(i + 1) % 5], radii[1], { center: radialPoint(a, r1) }),
					radialPoint(angles[(i + 4) % 5], radii[1], {
						center: radialPoint(a, r1)
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
					radialPoint(angles[(i + 3) % 5], radii[1], {
						center: radialPoint(angles[(i + 2) % 5], r1)
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
		)
	];
</script>

<DopplerSvg {id} {size}>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(1 100% 210);fill:none;`} />
	{/each}
	<!-- {#each angles as a}
		<g transform={`rotate(${a + 18})`}>
			<path d={pentagram(radii[1], { center: { x: 0, y: -radii[0] - radii[1] } })} />
			<path d={pentagram(radii[0], { center: { x: 0, y: -radii[0] }, rotate: 0 })} />
		</g>
	{/each} -->
	<LineWithLegend {lineArray} style={`stroke: oklch(1 100% 150)`} />
</DopplerSvg>
