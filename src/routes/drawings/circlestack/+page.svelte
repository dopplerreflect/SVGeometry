<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 3),
		updated_at: new Date(2023, 10, 3)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { Phi, anglesArray, phi, radialPoint } from '$lib/geometry';

	const id = 'CIRCLESTACK';
	const size = 2 ** 10;
	const angles = anglesArray(10);
	const ro = size / 4.1;
	const radii = [
		ro,
		ro * phi,
		ro * phi ** 2,
		ro * phi ** 3,
		ro * phi ** 4,
		ro * phi ** 5,
		ro * phi ** 6
	];

	const circles: Circle[] = [
		...angles
			.filter((a, i) => i % 2 === 0)
			.map((a, i) => ({ r: radii[1], ...radialPoint(a + 18, radii[0] + radii[2]) })),
		...angles
			.filter((a, i) => i % 2 === 1)
			.map((a, i) => ({ r: radii[1], ...radialPoint(a + 18, radii[0] + radii[2]) })),

		...angles
			.filter((a, i) => i % 2 === 0)
			.map((a, i) => ({ r: radii[1], ...radialPoint(a, radii[0] + radii[2]) })),
		...angles
			.filter((a, i) => i % 2 === 1)
			.map((a, i) => ({ r: radii[1], ...radialPoint(a, radii[0] + radii[2]) })),
		...angles.map((a, i) => ({ r: radii[2], ...radialPoint(a, radii[0] + radii[2]) })),

		...angles.map((a, i) => ({ r: radii[2], ...radialPoint(a + 18, radii[0] + radii[2]) })),
		...angles.map((a, i) => ({ r: radii[3], ...radialPoint(a + 18, radii[0] + radii[2]) })),
		...angles.map((a, i) => ({ r: radii[4], ...radialPoint(a + 18, radii[0] + radii[2]) })),
		...angles.map((a, i) => ({ r: radii[3], ...radialPoint(a, radii[0] + radii[2]) })),
		...angles.map((a, i) => ({ r: radii[4], ...radialPoint(a, radii[0] + radii[2]) })),
		{ r: radii[2] + radii[0], x: 0, y: 0 },

		...angles
			.filter((a, i) => i % 2 === 1)
			.map((a, i) => ({ r: radii[5], ...radialPoint(a, radii[2] * phi ** 0.5) })),

		...angles
			.filter((a, i) => i % 2 === 1)
			.map((a, i) => ({ r: radii[6], ...radialPoint(a, radii[2] * phi ** 0.5) })),

		...angles
			.filter((a, i) => i % 2 === 0)
			.map((a, i) => ({ r: radii[5], ...radialPoint(a, radii[2] * phi ** 0.5) })),

		...angles
			.filter((a, i) => i % 2 === 0)
			.map((a, i) => ({ r: radii[6], ...radialPoint(a, radii[2] * phi ** 0.5) })),

		// { r: radii[2], x: 0, y: 0 },
		{ r: radii[3], x: 0, y: 0 },
		{ r: radii[4], x: 0, y: 0 },
		...angles.map((a, i) => ({ r: radii[3], ...radialPoint(a, radii[0]) })),
		...angles
			.filter((a, i) => i % 2 === 1)
			.map((a, i) => ({ r: radii[3], ...radialPoint(a, radii[1]) })),
		...angles
			.filter((a, i) => i % 2 === 0)
			.map((a, i) => ({ r: radii[3], ...radialPoint(a, radii[1]) })),
		...angles.map((a, i) => ({ r: radii[4], ...radialPoint(a, radii[0]) })),
		...angles.map((a, i) => ({ r: radii[4], ...radialPoint(a, radii[1]) }))
	];
	const colorMap = new Map();
	colorMap.set(radii[1], 'oklch(1 100% 270 / 0.15)');
	colorMap.set(radii[2], 'oklch(0.75 100% 150 / 0.5)');
	colorMap.set(radii[3], 'oklch(1 100% 60 / 1)');
	colorMap.set(radii[4], 'oklch(1 100% 45 / 1)');
	colorMap.set(radii[5], 'oklch(0.5 100% 270 / 1)');
	colorMap.set(radii[6], 'oklch(1 100% 90 / 1)');
	colorMap.set(radii[2] + radii[0], 'oklch(0.5 100% 30 / 0.5)');
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="CIRCLESTACK-bg" x="-50%" y="-50%" width="150%" height="150%">
			<feTurbulence
				type="turbulence"
				baseFrequency="0.015"
				numOctaves="1"
				seed="8"
				result="turbulence"
				stitchTiles="stitch"
			/>
			<feDisplacementMap in2="turbulence" scale="1024" />
			<feColorMatrix
				values="0.33 0 0 0 0
                0 0.25 0 0 0
                0 0 1 0 0
                0 0 0 1 0.5"
			/>
		</filter>
		<filter id="CIRCLESTACK-shadow" x="-50%" y="-50%" width="200%" height="200%">
			<feMorphology in="SourceAlpha" operator="dilate" radius="3" />
			<feGaussianBlur stdDeviation="5" />
			<feOffset dy="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="CIRCLESTACK-grainy">
			<feTurbulence type="turbulence" baseFrequency="1" numOctaves="2" result="turbulence" />
			<feDisplacementMap in="SourceGraphic" in2="turbulence" scale="3" />
		</filter>
	</defs>
	<Background {size} fill="oklch(0 100% 300)" />
	<Background {size} fill="oklch(0 100% 300)" filter="url(#CIRCLESTACK-bg)" />
	<g filter="url(#CIRCLESTACK-grainy)">
		{#each circles as c}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style={`stroke:oklch(1 33% 30);fill:${colorMap.get(c.r)};stroke-width:${ro * phi ** 8}`}
				filter="url(#CIRCLESTACK-shadow)"
			/>
		{/each}
	</g>
</DopplerSvg>
