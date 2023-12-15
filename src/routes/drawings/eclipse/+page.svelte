<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 16),
		updated_at: new Date(2023, 9, 16)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, radialPoint, radialPointString } from '$lib/geometry';

	const id = 'ECLIPSE';
	const size = 2 ** 10;
	const or = size * 0.75;
	const r = or / Math.sqrt(40);
	const angles = anglesArray(20, 0);
	const d = [
		'M',
		radialPointString(90, r, { center: radialPoint(180, or) }),
		radialPointString(90, r, { center: radialPoint(0, or) }),
		radialPointString(270, r, { center: radialPoint(0, or) }),
		radialPointString(270, r, { center: radialPoint(180, or) }),
		'Z'
	].join(' ');
</script>

<DopplerSvg {id} {size}>
	<defs>
		<linearGradient id="ECLIPSE-lg">
			<stop offset="0%" stop-color="oklch(0.01 25% 60 / 0.05)" />
			<stop offset="40%" stop-color="oklch(0.99 25% 60 / 0.15)" />
			<stop offset="100%" stop-color="oklch(0.01 25% 60 / 0.05)" />
		</linearGradient>
		<filter id="ECLIPSE-distort">
			<feTurbulence type="turbulence" baseFrequency="0.05" numOctaves="2" result="turbulence" />
			<feDisplacementMap in2="turbulence" in="SourceGraphic" scale="5" />
		</filter>
	</defs>
	<Background {size} fill="oklch(0.01 0 0)" />
	{#each angles.slice(0, angles.length / 2) as a, i}
		<path {d} transform={`rotate(${a})`} style={`fill:url(#ECLIPSE-lg);stroke:none`} />
	{/each}
	<circle
		r={r - 2.5}
		style={`fill:oklch(0.01 0 0 / 1);stroke:oklch(0.99 15% 60 / 2);stroke-width:5;`}
		filter="url(#ECLIPSE-distort)"
	/>
</DopplerSvg>
