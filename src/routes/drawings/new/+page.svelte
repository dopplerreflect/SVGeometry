<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 16, 19),
		updated_at: new Date(2023, 10, 16, 19)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import GridPattern from '$lib/components/GridPattern.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import { Phi, circleIntersections, phi, pointToString } from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const r = (size * 0.95) / 6;
	const centers = [
		{ x: -r, y: 0 },
		{ x: -r / 2, y: 0 },
		{ x: 0, y: 0 },
		{ x: r / 2, y: 0 },
		{ x: r, y: 0 }
	];
	const radii = [r, Math.hypot(r / 2, r), r * Math.sqrt(3), r * 2];
	const circles: Circle[] = radii.map((r) => centers.map((c) => ({ r, ...c }))).flat();
	const lineArray: Line[] = [
		[
			{ x: -size, y: 0 },
			{ x: size, y: 0 }
		],
		circleIntersections(circles[0], circles[2]),
		circleIntersections(circles[2], circles[4]),
		circleIntersections(circles[15], circles[19])
	];
	const paths = [
		[
			'M',
			pointToString(circleIntersections(circles[1], circles[3])[0]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[1], circles[4])[0]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[2], circles[4])[0]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[2], circles[4])[1]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[1], circles[4])[1]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[1], circles[3])[1]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[0], circles[3])[1]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[0], circles[2])[1]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[0], circles[2])[0]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[0], circles[3])[0]),
			'A',
			radii[0],
			radii[0],
			'0 0 1',
			pointToString(circleIntersections(circles[1], circles[3])[0]),

			'M',
			pointToString(circleIntersections(circles[6], circles[8])[0]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[6], circles[9])[0]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[7], circles[9])[0]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[7], circles[9])[1]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[6], circles[9])[1]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[6], circles[8])[1]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[5], circles[8])[1]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[5], circles[7])[1]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[5], circles[7])[0]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[5], circles[8])[0]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[6], circles[8])[0])
		].join(' '),
		[
			'M',
			pointToString(circleIntersections(circles[10], circles[14])[0]),
			'A',
			radii[2],
			radii[2],
			'0 0 1',
			pointToString(circleIntersections(circles[13], circles[14])[0]),
			'A',
			radii[2],
			radii[2],
			'0 0 1',
			pointToString(circleIntersections(circles[13], circles[14])[1]),
			'A',
			radii[2],
			radii[2],
			'0 0 1',
			pointToString(circleIntersections(circles[10], circles[14])[1]),
			'A',
			radii[2],
			radii[2],
			'0 0 1',
			pointToString(circleIntersections(circles[10], circles[11])[1]),
			'A',
			radii[2],
			radii[2],
			'0 0 1',
			pointToString(circleIntersections(circles[10], circles[11])[0]),
			'A',
			radii[2],
			radii[2],
			'0 0 1',
			pointToString(circleIntersections(circles[10], circles[14])[0]),

			'M',
			pointToString(circleIntersections(circles[15], circles[19])[0]),
			'A',
			radii[3],
			radii[3],
			'0 0 1',
			pointToString(circleIntersections(circles[18], circles[19])[0]),
			'A',
			radii[3],
			radii[3],
			'0 0 1',
			pointToString(circleIntersections(circles[18], circles[19])[1]),
			'A',
			radii[3],
			radii[3],
			'0 0 1',
			pointToString(circleIntersections(circles[15], circles[19])[1]),
			'A',
			radii[3],
			radii[3],
			'0 0 1',
			pointToString(circleIntersections(circles[15], circles[16])[1]),
			'A',
			radii[3],
			radii[3],
			'0 0 1',
			pointToString(circleIntersections(circles[15], circles[16])[0]),
			'A',
			radii[3],
			radii[3],
			'0 0 1',
			pointToString(circleIntersections(circles[15], circles[19])[0])
		].join(' '),
		[
			'M',
			pointToString(circleIntersections(circles[1], circles[5])[0]),
			'A',
			radii[1],
			radii[1],
			'0 1 1',
			pointToString(circleIntersections(circles[1], circles[5])[1]),
			'A',
			radii[0],
			radii[0],
			'0 0 0',
			pointToString(circleIntersections(circles[1], circles[5])[0]),
			'M',
			pointToString(circleIntersections(circles[0], circles[6])[0]),
			'A',
			radii[0],
			radii[0],
			'0 0 0',
			pointToString(circleIntersections(circles[0], circles[6])[1]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[0], circles[6])[0])
		].join(' '),
		[
			'M',
			pointToString(circleIntersections(circles[3], circles[9])[0]),
			'A',
			radii[1],
			radii[1],
			'0 1 1',
			pointToString(circleIntersections(circles[3], circles[9])[1]),
			'A',
			radii[0],
			radii[0],
			'0 0 0',
			pointToString(circleIntersections(circles[3], circles[9])[0]),
			'M',
			pointToString(circleIntersections(circles[4], circles[8])[0]),
			'A',
			radii[0],
			radii[0],
			'0 0 0',
			pointToString(circleIntersections(circles[4], circles[8])[1]),
			'A',
			radii[1],
			radii[1],
			'0 0 1',
			pointToString(circleIntersections(circles[4], circles[8])[0])
		].join(' ')
	];
</script>

<DopplerSvg {id} {size}>
	<g transform="rotate(90)">
		<GridPattern size={r} stroke="oklch(0.5 100% 300)" />
		<Background {size} fill="oklch(1 0 0)" />
		<!-- <Background {size} fill="url(#gridPattern)" /> -->
		<!-- {#each circles as c, i}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style={`fill:oklch(${(0.75 / (r * 2)) * r + 0.25} 100% ${Math.abs(c.x) + 210} / 0.15)`}
			/>
		{/each} -->
		{#each circles as c, i}
			<circle r={c.r} cx={c.x} cy={c.y} style={`fill:none;stroke:oklch(0.75 0 0)`} />
			<!-- <text x={c.x} y={-c.r} text-anchor="middle" style="fill:oklch(1 100% 90)">{i}</text> -->
		{/each}
		{#each paths as d}
			<path
				{d}
				style={`stroke:oklch(0 0 0);stroke-width:3;fill:oklch(0.5 100% 300 / 1);fill-rule:evenodd;`}
			/>
		{/each}
		<LineWithLegend {lineArray} style="stroke:oklch(0 0 0)" />
	</g>
</DopplerSvg>
