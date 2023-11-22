<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 21, 9),
		updated_at: new Date(2023, 10, 21, 9)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		arrayMap,
		pathFromIntersectionsOfLines,
		phi,
		polygonPath,
		radialPoint
	} from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const r = size * 0.24;
	const radii = arrayMap(3, (n) => n).map((n) => r * phi ** n);
	const angles = anglesArray(6);
	const circles: Circle[] = radii
		.map((r) => angles.map((a) => ({ r, ...radialPoint(a, radii[0]) })))
		.flat();
	const lineArray: Line[] = [
		...angles.map(
			(a, i) => [radialPoint(a, r * 2), radialPoint(angles[(i + 1) % 6], r * 2)] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 6], radii[0], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 2) % 6], radii[0], {
						center: radialPoint(a, r)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 5) % 6], radii[0], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 4) % 6], radii[0], {
						center: radialPoint(a, r)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[1], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 1) % 6], radii[1], { center: radialPoint(a, r) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[1], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 5) % 6], radii[1], { center: radialPoint(a, r) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 6], radii[1], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 4) % 6], radii[2], {
						center: radialPoint(angles[(i + 1) % 6], r)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 5) % 6], radii[1], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 2) % 6], radii[2], {
						center: radialPoint(angles[(i + 5) % 6], r)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[2], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 1) % 6], radii[2], { center: radialPoint(a, r) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[2], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 5) % 6], radii[2], { center: radialPoint(a, r) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 1) % 6], radii[2], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 4) % 6], radii[1], {
						center: radialPoint(angles[(i + 1) % 6], r)
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 5) % 6], radii[2], { center: radialPoint(a, r) }),
					radialPoint(angles[(i + 2) % 6], radii[1], {
						center: radialPoint(angles[(i + 5) % 6], r)
					})
				] as Line
		),
		...angles.map((a) => [radialPoint(a, r), { x: 0, y: 0 }] as Line)
	];

	const lightnessPath = pathFromIntersectionsOfLines([
		'M',
		lineArray[0],
		lineArray[13],
		lineArray[11],
		lineArray[5],
		lineArray[0],
		'M',
		lineArray[10],
		lineArray[71],
		lineArray[70],
		lineArray[17],
		lineArray[10],
		'M',
		lineArray[67],
		lineArray[14],
		lineArray[7],
		lineArray[68],
		lineArray[67],
		'M',
		lineArray[16],
		lineArray[8],
		lineArray[2],
		lineArray[3],
		lineArray[16],
		'Z'
	]);

	const huePath = pathFromIntersectionsOfLines([
		'M',
		lineArray[24],
		lineArray[18],
		lineArray[30],
		lineArray[38],
		lineArray[26],
		lineArray[20],
		lineArray[32],
		lineArray[40],
		lineArray[28],
		lineArray[22],
		lineArray[34],
		lineArray[36],
		lineArray[24],
		'M',
		lineArray[48],
		lineArray[42],
		lineArray[54],
		lineArray[62],
		lineArray[50],
		lineArray[44],
		lineArray[56],
		lineArray[64],
		lineArray[52],
		lineArray[46],
		lineArray[58],
		lineArray[60],
		lineArray[48],
		'Z'
	]);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<path id="lightnessPath" d={lightnessPath} />
		<g id="lightnessMask">
			<use href="#lightnessPath" style="fill:oklch(1 0 0 / 0.8)" />
			<use href="#lightnessPath" style="fill:oklch(1 0 0 / 0.5)" transform="rotate(60)" />
			<use href="#lightnessPath" style="fill:oklch(1 0 0 / 0.2)" transform="rotate(120)" />
		</g>
		<path id="huePath" d={huePath} />
		<g id="hueMask">
			<use href="#huePath" style="fill:oklch(1 100% 150 / 0.75);fill-rule:evenodd" />
			<use
				href="#huePath"
				style="fill:oklch(1 100% 90 / 0.75);fill-rule:evenodd"
				transform="rotate(60)"
			/>
		</g>
	</defs>
	<Background {size} fill="oklch(0.25 100% 330)" />
	<g transform="rotate(30)">
		<path d={polygonPath(6, r * 2)} style="fill:oklch(0.5 100% 270)" />
		{#each circles as c, i}
			<!-- <circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(1 100% 300);fill:none;`} /> -->
		{/each}
		<use href="#hueMask" />
		<use href="#lightnessMask" />
		<LineWithLegend {lineArray} style={`stroke:oklch(0 100% 300);stroke-width:2;`} />
	</g>
</DopplerSvg>
