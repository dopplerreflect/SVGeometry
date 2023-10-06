<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 2, 20),
		updated_at: new Date(2023, 9, 3, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		circleIntersections,
		pathFromIntersectionsOfLines,
		phi,
		pythag,
		radialPoint
	} from '$lib/geometry';

	const id = 'FIVE-FOLD-DODECA';
	const size = 2 ** 10;
	const angles10 = anglesArray(10, 0);
	const angles = anglesArray(5, 180);
	const r = (size / 2) * 0.95;
	const radii = [r, r * phi, r * phi ** 2];
	const circles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...angles10
			.map((a) =>
				radii
					.slice(1, 3)
					.map((r) => ({ r, ...radialPoint(a, radii[2], { center: radialPoint(a, radii[1]) }) }))
			)
			.flat()
	];
	const ci = circleIntersections(circles[4], circles[6]);
	const r2 = pythag(ci[1].x, ci[1].y);
	const lineArray: Line[] = [
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(angles[(i + 2) % 5], r)] as Line),
		...angles.map((a, i) => [radialPoint(a + 36, r), { x: 0, y: 0 }] as Line),
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(a + 36, radii[1])] as Line),
		...angles.map((a, i) => [radialPoint(a, r), radialPoint(a - 36, radii[1])] as Line),
		...angles.map((a, i) => [radialPoint(a + 36, r), radialPoint(a + 54, r2)] as Line),
		...angles.map((a, i) => [radialPoint(a + 36, r), radialPoint(a + 18, r2)] as Line)
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines([
			'M',
			...[16, 5, 0, 6, 11, 26, 6, 17, 0, 6, 5, 0, 10, 5, 20, 16].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[17, 6, 1, 7, 12, 27, 7, 18, 1, 7, 6, 1, 11, 6, 21, 17].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[0, 2, 4, 1, 3, 0].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[15, 9, 4, 5, 10, 25, 5, 16, 4, 5, 9, 4, 14, 9, 24, 15].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[18, 7, 2, 8, 13, 28, 8, 19, 2, 8, 7, 2, 12, 7, 22, 18].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[19, 8, 3, 9, 14, 29, 9, 15, 3, 9, 8, 3, 13, 8, 23, 19].map((i) => lineArray[i]),
			'Z'
		])
	];
</script>

<DopplerSvg {id} {size}>
	<Background {size} fill="oklch(0.25 50% 300)" />
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} id={`c${i}`} style="stroke:oklch(1 0 0);fill:none;" />
	{/each}
	{#each paths as d, i}
		<path
			{d}
			style={`stroke-linejoin:bevel;stroke:oklch(0 0 0);stroke-width:10;fill-rule:evenodd;fill:oklch(${
				1 - 0.1 * i
			} 100% 100 / 0.75)`}
		/>
	{/each}
</DopplerSvg>
