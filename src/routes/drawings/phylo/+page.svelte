<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 15, 21),
		updated_at: new Date(2023, 10, 15, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { phylotaxicPoints, pointToString, polygonPath } from '$lib/geometry';

	const id = 'PHYLO';
	const size = 2 ** 10;
	const r = size * 0.45;
	const d = 377;
	const points: Point[] = phylotaxicPoints(d, r);
	const paths: string[] = [];
	for (let i = 0; i <= d - 35; i += 1) {
		paths.push(
			`M${pointToString(points[i])} ${pointToString(points[i + 13])} ${pointToString(
				points[i + 34]
			)} ${pointToString(points[i + 21])}Z`
		);
	}
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#PHYLO {
				& .p {
					filter: url(#PHYLO-shrink);
				}
			}
		</style>
		<filter id="PHYLO-shrink">
			<feMorphology operator="erode" radius="2" result="erode" />
			<feMorphology in="SourceAlpha" operator="erode" radius="1" result="erode1" />
			<feGaussianBlur stdDeviation="1" result="blur" />
			<feFlood flood-color="oklch(0 0 0)" />
			<feComposite operator="in" in2="blur" />
			<feOffset dy="2" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="erode" />
			</feMerge>
		</filter>
		<radialGradient id="PHYLO-rg">
			<stop offset="0%" stop-color="oklch(1 50% 90)" />
			<stop offset="100%" stop-color="oklch(0.5 50% 240)" />
		</radialGradient>
	</defs>
	<Background {size} fill="oklch(0 0 0)" />
	<Background size={size * Math.sqrt(2)} fill="url(#PHYLO-rg)" />
	{#each paths as d, i}
		<path
			class="p"
			{d}
			style={`fill:oklch(${i % 2 === 0 ? 0.7 : 0.85} 100% ${90 + (180 / paths.length) * i})`}
		/>
	{/each}
	{#each points as p, i}
		<circle
			class="p"
			r={8}
			cx={p.x}
			cy={p.y}
			style={`fill:oklch(${i % 3 === 1 ? 0.5 : 0.65} 100% ${90 + (180 / points.length) * i})`}
		/>
	{/each}
</DopplerSvg>
