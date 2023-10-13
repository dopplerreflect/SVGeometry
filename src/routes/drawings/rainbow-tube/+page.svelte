<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(),
		updated_at: new Date()
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { phi, anglesArray, radialPoint, radialPointString } from '$lib/geometry';

	const id = 'RAINBOW-TUBE';
	const size = 2 ** 10;
	const r = (size / 4) * 0.95;
	const radii = [r, r * phi, r * phi ** 2];
	const angles = anglesArray(15, -18);
	const paths: string[] = angles.map(
		(a, i) =>
			`M${radialPointString(a, radii[2], {
				center: radialPoint(270, radii[0])
			})}A${radii[2]} ${radii[2]} 0 0 1 ${radialPointString(
				angles[(i + 1) % angles.length],
				radii[2],
				{
					center: radialPoint(270, radii[0])
				}
			)}L${radialPointString(angles[(i + 1) % angles.length], radii[0], {
				center: radialPoint(90, radii[2])
			})}A${radii[0]} ${radii[0]} 0 0 0 ${radialPointString(a, radii[0], {
				center: radialPoint(90, radii[2])
			})}Z`
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
			} / 0.66);stroke:oklch(0 0 0);stroke-width:5;`}
		/>
	{/each}
</DopplerSvg>
