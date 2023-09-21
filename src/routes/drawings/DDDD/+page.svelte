<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: ['wip'],
		created_at: new Date(2023, 8, 20),
		updated_at: new Date(2023, 8, 20)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import {
		Phi,
		SQRT3,
		anglesArray,
		pathFromIntersectionsOfLines,
		phi,
		pythag2,
		radialPoint
	} from '$lib/geometry';

	const id = 'DDDD';
	const size = 2 ** 10;
	const ro = size / 3;
	const radii = [ro, ro * phi, ro * phi ** 2];
	const angles = anglesArray(6, 0);
	const lineArray: Line[] = [
		...angles
			.slice(0, 4)
			.map((ca, ci) =>
				angles.map(
					(_, i) =>
						[
							radialPoint(angles[i], radii[2], {
								center: radialPoint(ca, pythag2(radii[2], radii[2] / 2), { rotate: 30 })
							}),
							radialPoint(angles[(i + 1) % 6], radii[2], {
								center: radialPoint(ca, pythag2(radii[2], radii[2] / 2), { rotate: 30 })
							})
						] as Line
				)
			)
			.flat(),

		...angles
			.slice(0, 3)
			.map((ca, ci) =>
				angles.map(
					(_, i) =>
						[
							radialPoint(angles[i], radii[1], {
								center: radialPoint(ca, pythag2(radii[0], radii[0] / 2), { rotate: 30 })
							}),
							radialPoint(angles[(i + 1) % 6], radii[1], {
								center: radialPoint(ca, pythag2(radii[0], radii[0] / 2), { rotate: 30 })
							})
						] as Line
				)
			)
			.flat()
	];

	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[2, 3, 17, 12, 2].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[12, 34, 41, 19, 2, 12].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[34, 27, 26, 1, 2, 34].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[34, 41, 36, 13, 12, 34].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[34, 41, 36, 13, 8, 33, 34].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines(['M', ...[13, 36, 8, 13].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[13, 33, 8, 13].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines([
			'M',
			...[2, 1, 26, 6, 7, 8, 36, 13, 12, 2].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[8, 36, 37, 32, 33, 13, 8].map((i) => lineArray[i]),
			'Z'
		]),
		pathFromIntersectionsOfLines([
			'M',
			...[26, 25, 30, 31, 32, 37, 36, 8, 7, 6, 26].map((i) => lineArray[i]),
			'Z'
		])
	];
</script>

<DopplerSvg {id} {size} zoom={0} yPan={0} logoProps={{ stroke: 'oklch(1 100% 90 / 0.25)' }}>
	<defs>
		<linearGradient
			id="lg0"
			gradientUnits="userSpaceOnUse"
			x1={0}
			y1={25}
			x2={0}
			y2={pythag2(radii[2], radii[2] / 2)}
		>
			<stop offset="0%" stop-color="oklch(1 100% 90)" />
			<stop offset="100%" stop-color="oklch(0.25 100% 90)" />
		</linearGradient>
		<linearGradient
			id="lg1"
			gradientUnits="userSpaceOnUse"
			x1={radialPoint(120, radii[2] / 2 + 20).x}
			y1={radialPoint(120, radii[2] / 2 + 20).y}
			x2={radialPoint(120, radii[2] + 0).x}
			y2={radialPoint(120, radii[2] + 0).y}
		>
			<stop offset="0%" stop-color="oklch(0.5 100% 270)" />
			<stop offset="100%" stop-color="oklch(0 50% 270)" />
		</linearGradient>
		<linearGradient
			id="lg3"
			gradientUnits="userSpaceOnUse"
			x1={radialPoint(90, radii[2] * 0.9).x}
			y1={radialPoint(90, radii[2] * 0.9).y}
			x2={radialPoint(90, radii[2] * 1.2).x}
			y2={radialPoint(90, radii[2] * 1.2).y}
		>
			<stop offset="0%" stop-color="oklch(1 100% 240)" />
			<stop offset="100%" stop-color="oklch(0.3 100% 240)" />
		</linearGradient>
		<linearGradient
			id="lg4"
			gradientUnits="userSpaceOnUse"
			x1={radialPoint(90, radii[2]).x}
			y1={radialPoint(90, radii[2]).y}
			x2={radialPoint(90, radii[2] * 2).x}
			y2={radialPoint(90, radii[2] * 2).y}
		>
			<stop offset="0%" stop-color="oklch(0.75 100% 150)" />
			<stop offset="100%" stop-color="oklch(0.25 100% 150)" />
		</linearGradient>
		<linearGradient
			id="lg5"
			gradientUnits="userSpaceOnUse"
			x1={radialPoint(120, radii[2] * 1.2).x}
			y1={radialPoint(120, radii[2] * 1.2).y}
			x2={radialPoint(120, radii[2] * 2).x}
			y2={radialPoint(120, radii[2] * 2).y}
		>
			<stop offset="0%" stop-color="oklch(1 100% 240)" />
			<stop offset="100%" stop-color="oklch(0 50% 240)" />
		</linearGradient>
		<linearGradient
			id="lg6"
			gradientUnits="userSpaceOnUse"
			x1={radialPoint(120, radii[2] * 2).x}
			y1={radialPoint(120, radii[2] * 2).y}
			x2={radialPoint(120, radii[1] * 2.5).x}
			y2={radialPoint(120, radii[1] * 2.5).y}
		>
			<stop offset="0%" stop-color="oklch(1 100% 270)" />
			<stop offset="100%" stop-color="oklch(0 50% 270)" />
		</linearGradient>
		<linearGradient
			id="lg7"
			gradientUnits="userSpaceOnUse"
			x1={radialPoint(90, radii[2] * 2).x}
			y1={radialPoint(90, radii[2] * 2).y}
			x2={radialPoint(90, radii[1] * 2.5).x}
			y2={radialPoint(90, radii[1] * 2.5).y}
		>
			<stop offset="0%" stop-color="oklch(1 100% 240 / 0.15)" />
			<stop offset="100%" stop-color="oklch(0 100% 180 / 0.05)" />
		</linearGradient>

		<style>
			svg#DDDD path:not(.Background) {
				stroke: oklch(100% 100% 90);
			}
			svg#DDDD path.p0 {
				fill: url(#lg0);
			}
			svg#DDDD path.p1 {
				fill: url(#lg1);
			}
			svg#DDDD path.p2,
			svg#DDDD path.p3 {
				fill: url(#lg3);
			}
			svg#DDDD path.p4 {
				fill: oklch(0.6 100% 150 / 1);
				fill: url(#lg5);
			}
			svg#DDDD path.p5,
			svg#DDDD path.p6 {
				fill: oklch(1 100% 170 / 1);
			}
			svg#DDDD path.p7 {
				fill: url(#lg4);
			}
			svg#DDDD path.p8 {
				fill: url(#lg6);
			}
			svg#DDDD path.p9 {
				fill: url(#lg7);
			}
		</style>
		<filter id="DDDD-shrink">
			<feMorphology in="SourceGraphic" operator="erode" radius="6" result="erode" />
			<feFlood flood-color="oklch(95% 25% 240)" result="color" />
			<feComposite in="color" in2="erode" operator="in" result="composite" />
			<feMorphology in="composite" operator="dilate" radius="2" result="dilate" />
			<feMerge>
				<feMergeNode in="dilate" />
				<feMergeNode in="erode" />
			</feMerge>
		</filter>
		<filter id="DDDD-dropshadow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="1" result="morph" />
			<feGaussianBlur in="morph" stdDeviation="3" result="blur" />
			<feOffset in="blur" dy="12" result="offset" />
			<feFlood flood-color="oklch(33% 100% 60)" result="color" />
			<feComposite in="color" in2="morph" operator="in" result="composite" />
			<feMerge>
				<feMergeNode in="offset" />
				<feMergeNode in="composite" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<HexPattern id="hp" size={5} stroke="oklch(15% 50% 90)" />
	</defs>
	<Background {size} fill="oklch(25% 10% 300)" />
	<Background {size} fill="url(#hp)" />
	<g fill-opacity={1}>
		{#each angles.slice(0, 6) as a}
			{#each paths as d, i}
				<path filter="url(#DDDD-shrink)" {d} transform={`rotate(${a})`} class={`p${i}`} />
			{/each}
		{/each}
	</g>
	<g filter="url(#DDDD-dropshadow)" transform="translate(0, -2)">
		{#each angles as a}
			{#each paths as d, i}
				<path
					{d}
					style="stroke-width:1;stroke: oklch(100% 100% 90);fill:none"
					transform={`rotate(${a})`}
				/>
			{/each}
		{/each}
	</g>
</DopplerSvg>
