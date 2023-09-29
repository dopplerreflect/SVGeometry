<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 28, 21),
		updated_at: new Date(2023, 8, 28, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import { SQRT3, anglesArray, radialPoint, viewBox } from '$lib/geometry';

	const id = 'FRUITBOWL';
	const size = 2 ** 10;
	const r = (size / 26) * 0.95;
	const angles = anglesArray(6);
	const fruitCircles: Circle[] = [
		{ r, x: 0, y: 0 },
		...angles.map((a) => ({ r, ...radialPoint(a, r * 2) })),
		...angles.map((a) => ({ r, ...radialPoint(a, r * 4) }))
	];
	const fruitCircles2: Circle[] = [
		{ r: r * 2, x: 0, y: 0 },
		...angles.map((a) => ({ r: r * 2, ...radialPoint(a, r * 4) })),
		...angles.map((a) => ({ r: r * 2, ...radialPoint(a, r * 8) }))
	];
	const bigCircles: Circle[] = [
		...fruitCircles.map((c) => ({ r: r * 4, x: c.x * 2, y: c.y * 2 })),
		...angles.map((a) => ({ r: r * 4, ...radialPoint(a + 30, r * 4 * Math.sqrt(3)) }))
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#FRUITBOWL {
				& circle {
					stroke: oklch(0.75 100% 180);
					fill: oklch(0.75 100% 180 / 0.1);
					stroke-width: 1;
				}
			}
		</style>
		<filter id="FRUITBOWL-space">
			<feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="3" />
			<feColorMatrix
				type="matrix"
				values="0.15 0 0 0 0
                0 0 0 0 0
                0 0 0.75 0 0
                0 0 0 1 0"
			/>
		</filter>
		<filter id="FRUITBOWL-glow">
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="4" result="glow" />
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<HexPattern size={r / 3} id="FRUITBOWL-hexpattern" stroke="oklch(1 50% 150)" />
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	<Background {size} fill="url(#FRUITBOWL-hexpattern)" />
	<Background {size} filter="url(#FRUITBOWL-space" />
	<g id="fruitbowl" filter="url(#FRUITBOWL-glow)">
		{#each fruitCircles2 as c}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style="stroke:oklch(0.5 100% 300);fill:oklch(0.5 100% 300 / 0.2)"
			/>
		{/each}
		{#each bigCircles as c}
			<circle
				r={c.r}
				cx={c.x}
				cy={c.y}
				style="stroke:oklch(1 100% 150);fill:oklch(1 100% 150 / 0.1)"
			/>
		{/each}
		{#each fruitCircles as c}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each angles as a}
			<g transform={`translate(${radialPoint(a, r * 8).x}, ${radialPoint(a, r * 8).y})`}>
				{#each fruitCircles as c}
					<circle r={c.r} cx={c.x} cy={c.y} />
				{/each}
			</g>
		{/each}
	</g>
</DopplerSvg>
