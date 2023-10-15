<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 13),
		updated_at: new Date(2023, 9, 13)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { phi, anglesArray, radialPoint, radialPointString } from '$lib/geometry';

	const id = 'RAINBOW-TUBE';
	const size = 2 ** 10;
	const r = (size / 4) * 0.95;
	const radii = [r, r * phi, r * phi ** 2, r * phi ** 3];
	const angles = anglesArray(24, 125);
	const angles2 = anglesArray(48, 125);
	const circles: Circle[] = [
		{ r: radii[0], ...radialPoint(angles[0], radii[0]) },
		{ r: radii[1], ...radialPoint(angles[0], radii[0]) },
		{ r: radii[2], ...radialPoint(angles[0], radii[2]) },
		{ r: radii[3], ...radialPoint(angles[0], radii[2]) },
		{ r: radii[0], ...radialPoint(angles[angles.length / 2], radii[0]) },
		{ r: radii[1], ...radialPoint(angles[angles.length / 2], radii[0]) },
		{ r: radii[2], ...radialPoint(angles[angles.length / 2], radii[2]) },
		{ r: radii[3], ...radialPoint(angles[angles.length / 2], radii[2]) }
	];
	const paths: string[] = angles.map((a) =>
		[
			'M',
			radialPointString(a, radii[0], { center: { x: circles[0].x, y: circles[0].y } }),
			radialPointString(a, radii[1], { center: { x: circles[1].x, y: circles[1].y } }),
			radialPointString(a, radii[3], { center: { x: circles[3].x, y: circles[3].y } }),
			radialPointString(a, radii[2], { center: { x: circles[2].x, y: circles[2].y } }),
			'Z'
		].join(' ')
	);
	const paths2: string[] = angles.map((a) =>
		[
			'M',
			radialPointString(a, radii[0], { center: { x: circles[4].x, y: circles[4].y } }),
			radialPointString(a, radii[1], { center: { x: circles[5].x, y: circles[5].y } }),
			radialPointString(a, radii[3], { center: { x: circles[7].x, y: circles[7].y } }),
			radialPointString(a, radii[2], { center: { x: circles[6].x, y: circles[6].y } }),
			'Z'
		].join(' ')
	);
	const lineArray: Line[] = angles2.map((a) => [
		radialPoint(a, radii[0] * 2),
		radialPoint(a, radii[3])
	]);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#RAINBOW-TUBE {
				& path:not(.Background),
				circle {
					stroke: oklch(1 0 0);
					fill: none;
				}
				& line {
					stroke: oklch(0.5 100% 240);
					stroke-width: 3;
				}
			}
		</style>
		<filter id="RAINBOW-TUBE-glow">
			<feGaussianBlur stdDeviation="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	<g filter="url(#RAINBOW-TUBE-glow)">
		{#each lineArray as l, i}
			<line
				x1={l[0].x}
				y1={l[0].y}
				x2={l[1].x}
				y2={l[1].y}
				style={`stroke:oklch(0.75 100% ${0 + (720 / lineArray.length) * i} )`}
			/>
		{/each}
	</g>
	{#each paths as d, i}
		<path
			{d}
			style={`fill:oklch(1 100% ${
				0 + (360 / angles.length) * i
			} / 0.25);stroke:oklch(1 0 0 / 1);stroke-width:2;`}
		/>
	{/each}
	{#each paths2 as d, i}
		<path
			{d}
			style={`fill:oklch(1 100% ${
				180 + (360 / angles.length) * i
			} / 0.25);stroke:oklch(1 0 0 / 1);stroke-width:2;`}
		/>
	{/each}
</DopplerSvg>
