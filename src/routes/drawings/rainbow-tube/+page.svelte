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
	import { phi, anglesArray, radialPoint, radialPointString } from '$lib/geometry';

	const id = 'RAINBOW-TUBE';
	const size = 2 ** 10;
	const r = (size / 4) * 0.95;
	const radii = [r, r * phi, r * phi ** 2, r * phi ** 3];
	const angles = anglesArray(36, 125);
	const paths: string[] = angles.map((a) =>
		[
			'M',
			radialPointString(a, radii[2], { center: radialPoint(300, radii[3]) }),
			radialPointString(a, radii[3], { center: radialPoint(300, radii[3]) }),
			radialPointString(a, radii[1], { center: radialPoint(120, radii[3]) }),
			radialPointString(a, radii[0], { center: radialPoint(120, radii[3]) }),
			'Z'
		].join(' ')
	);
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
					stroke: oklch(1 0 0);
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each paths as d, i}
		<path
			{d}
			style={`fill:oklch(1 100% ${
				0 + (360 / angles.length) * i
			} / 0.33);stroke:oklch(1 0 0 / 1);stroke-width:2;`}
		/>
	{/each}
</DopplerSvg>
