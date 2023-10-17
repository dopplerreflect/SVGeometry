<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 17),
		updated_at: new Date(2023, 9, 17)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray } from '$lib/geometry';

	const id = 'SIN-GRID';
	const size = 2 ** 10;
	const r = (size / 2) * 0.95;
	const angles = anglesArray(96);
	const axes: number[] = angles
		.slice(1, angles.length / 2)
		.map((a) => Math.sin(a * (Math.PI / 180)) * r);
	const gap = 8;
	const paths: { d: string; style: string }[] = axes
		.map((x, xi) =>
			axes.map((y, yi) => ({
				d: `M${x} ${y}L${axes[xi + 1] - gap} ${axes[yi]}L${axes[xi + 1] - gap} ${
					axes[yi + 1] - gap
				}L${x} ${axes[yi + 1] - gap}Z`,
				style: `fill:oklch(${
					1 - (1 / (r * Math.sqrt(2)) / 2) * Math.hypot(size / 2 + x, size / 2 + y)
				} 100%  ${300 + (90 / (r * Math.sqrt(2)) / 2) * Math.hypot(size / 2 + x, size / 2 + y)})`
			}))
		)
		.flat()
		.filter((s) => !s.d.match(/undefined|NaN/));
</script>

<DopplerSvg {id} {size}>
	<Background {size} fill="oklch(0 0 0)" />
	{#each paths as path, i}
		<path d={path.d} style={path.style} />
	{/each}
</DopplerSvg>
