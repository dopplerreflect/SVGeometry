<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 4, 18),
		updated_at: new Date(2023, 9, 4, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, pathFromIntersectionsOfLines, phi, radialPoint } from '$lib/geometry';

	const id = 'TWO-FOLD-DODECA';
	const size = 2 ** 10;
	const angles = anglesArray(6);
	const r = (size / 2) * 0.85 * phi;
	const radii = [r, r * phi, r * phi ** 2];
	const circles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...angles.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[0] + radii[1]),
					radialPoint(angles[(i + 2) % 6], radii[0] + radii[1])
				] as Line
		),
		...[0, 2, 4].map(
			(i) =>
				[
					radialPoint(angles[i], radii[0] + radii[1]),
					radialPoint(angles[(i + 3) % 6], radii[0])
				] as Line
		),
		...[1, 3, 5].map(
			(i) =>
				[
					radialPoint(angles[i], radii[0] + radii[1]),
					radialPoint(angles[(i + 2) % 6], radii[0])
				] as Line
		),
		...[1, 3, 5].map(
			(i) =>
				[
					radialPoint(angles[i], radii[0] + radii[1]),
					radialPoint(angles[(i + 4) % 6], radii[0])
				] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(angles[i], radii[0]), radialPoint(angles[(i + 1) % 6], radii[0])] as Line
		)
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines([
			'M',
			...[4, 11, 12, 0, 5, 12, 15, 11, 12, 20, 11, 5, 4].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[6, 0, 15, 16, 0, 7, 12, 9, 6].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[4, 20, 19, 4, 8, 11, 14, 6, 4].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[0, 9, 13, 2, 1, 13, 17, 9, 13, 16, 9, 1, 0].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[2, 17, 18, 2, 8, 13, 10, 7, 2].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[2, 10, 14, 4, 3, 14, 19, 10, 14, 18, 10, 3, 2].map((i) => lineArray[i]),
			'Z'
		])
	];
</script>

<DopplerSvg {id} {size}>
	<Background {size} fill="oklch(0.25 50% 300)" />
	<g transform="rotate(-18)">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style="stroke:oklch(1 0 0);fill:none;" />
		{/each}
		{#each paths as d, i}
			<path
				{d}
				style={`stroke-linejoin:bevel;stroke:oklch(0 0 0);stroke-width:10;fill-rule:evenodd;fill:oklch(${
					1 - 0.1 * i
				} 100% 100 / 0.75)`}
			/>
		{/each}
	</g>
</DopplerSvg>
