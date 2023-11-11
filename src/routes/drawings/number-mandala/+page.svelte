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
	import { anglesArray, arrayMap, phi, polygonPath, radialPoint } from '$lib/geometry';

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
					{ x: 0, y: 0 }
				] as Line
		)
	];
</script>

<DopplerSvg {id} {size}>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each circles as c}
		<circle style="fill:none;stroke:oklch(0.5 0 0);" r={c.r} cx={c.x} cy={c.y} />
		<!-- <path
			style="fill:none;stroke:oklch(0.75 0 0)"
			d={polygonPath(d, c.r, { center: { x: c.x, y: c.y } })}
		/> -->
	{/each}
	<LineWithLegend showLegend {lineArray} style="stroke:oklch(0.75 0 0)" />
</DopplerSvg>
