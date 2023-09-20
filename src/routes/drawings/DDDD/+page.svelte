<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: ['wip'],
		created_at: new Date(2023, 8, 19),
		updated_at: new Date(2023, 8, 19)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import { Phi, SQRT3, anglesArray, pentagram, phi, polygonPath, radialPoint } from '$lib/geometry';

	const id = 'DDDD';
	const size = 2 ** 10;
	const ro = size / 3.8;
	const radii = [ro, ro * phi, ro * phi ** 2];
</script>

<DopplerSvg {id} {size} logoProps={{ stroke: 'oklch(33% 100% 150)' }}>
	<defs>
		<style>
			svg#DDDD circle,
			svg#DDDD path:not(.Background) {
				stroke: oklch(100% 100% 150);
				fill: none;
			}
			svg#DDDD path:not(.Background) {
				fill: oklch(20% 100% 300);
			}
		</style>
		<HexPattern id="hp1" size={radii[0] / 3} patternTransform="rotate(30)" />
	</defs>
	<Background {size} fill="oklch(15% 100% 150)" />
	<circle r={ro * Phi} />
	<circle r={ro * SQRT3} />
	{#each [30, 150, 270] as a}
		<path
			d={polygonPath(6, radii[1], { rotate: 30, center: radialPoint(a, radii[0]) })}
			style={`fill: url(#hp1)`}
		/>
	{/each}
	{#each [90, 210, 330] as a}
		<path
			d={polygonPath(6, radii[2], { rotate: 30, center: radialPoint(a, radii[0]) })}
			style={'fill: url(#hp1)'}
		/>
	{/each}
	<path d={polygonPath(6, radii[2], { rotate: 0 })} style={`fill: url(#hp1)`} />
</DopplerSvg>
