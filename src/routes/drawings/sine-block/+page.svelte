<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 17, 17),
		updated_at: new Date(2023, 9, 17, 17)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, polygonPath } from '$lib/geometry';
	import { onMount } from 'svelte';

	let divs = 0;
	onMount(() => {
		const loop = () => {
			divs += 0.01;
			setTimeout(() => {
				frame = window.requestAnimationFrame(loop);
			}, 0);
		};
		let frame = window.requestAnimationFrame(loop);
		// return () => window.cancelAnimationFrame(frame);
	});

	const id = 'SINE-BLOCK';
	const size = 2 ** 10;
	const r = size / 2;
	const angles = anglesArray(51, 0);
	const axes: number[] = angles.map((a) => Math.sin(a * (Math.PI / 180)) * r).sort((a, b) => a - b);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#SINE-BLOCK {
				& circle,
				line,
				path:not(.Background) {
					stroke: white;
					fill: none;
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(0 0 0)" />
	<g transform={`rotate(-135) scale(${(1 / Math.sqrt(2)) * 2})`}>
		{#each axes as x, xi}
			{#each axes as y, yi}
				<path
					d={polygonPath(4, 6, { center: { x, y }, rotate: 45 })}
					style={`stroke:oklch(1 100% ${
						120 + (divs / axes.length ** 2) * (yi * xi) ** 2
					});fill:oklch(1 100% ${60 + (divs / axes.length ** 2) * (yi * xi) ** 2})`}
				/>
			{/each}
		{/each}
	</g>
</DopplerSvg>
