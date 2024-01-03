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

	let divs = 72;
	onMount(() => {
		const loop = () => {
			divs += 0.01;
			setTimeout(() => {
				// frame = window.requestAnimationFrame(loop);
			}, 0);
		};
		let frame = window.requestAnimationFrame(loop);
		return () => window.cancelAnimationFrame(frame);
	});

	const id = 'SINE-BLOCK';
	const size = 2 ** 10;
	const r = size / 2;
	const angles = anglesArray(51, 0);
	const axes: number[] = angles.map((a) => Math.sin(a * (Math.PI / 180)) * r).sort((a, b) => a - b);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="SINE-BLOCK-glow">
			<feMorphology in="SourceGraphic" operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="21 8" />
			<feMerge>
				<feMergeNode />
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 0 0)" />
	<g filter="url(#SINE-BLOCK-glow)">
		<g transform={`rotate(45) scale(${(1 / Math.sqrt(2)) * 2})`}>
			{#each axes as x, xi}
				{#each axes as y, yi}
					<path
						d={polygonPath(6, 6, { center: { x, y }, rotate: -45 })}
						style={`stroke:oklch(0.99 100% ${
							0 + (divs / axes.length ** 2) * (yi * xi) ** 2
						});fill:oklch(0.99 100% ${120 + (divs / axes.length ** 2) * (yi * xi) ** 2})`}
					/>
				{/each}
			{/each}
		</g>
	</g>
	<!-- <text x={-size / 2} y={size / 2} style="font-size:4em;fill:white">{divs}</text> -->
</DopplerSvg>
