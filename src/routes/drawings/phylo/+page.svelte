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
				& .c {
					filter: url(#PHYLO-shadow);
				}
			}
		</style>
		<filter id="PHYLO-shrink">
			<feMorphology operator="erode" radius="2" result="erode" />
			<feMorphology in="SourceAlpha" operator="erode" radius="1" result="erode1" />
			<feFlood flood-color="oklch(1 0 0 / 0.25)" />
			<feComposite operator="in" in2="erode1" result="border" />
			<feGaussianBlur in="erode1" stdDeviation="3" result="blur" />
			<feFlood flood-color="oklch(0 0 0)" />
			<feComposite operator="in" in2="blur" />
			<feOffset dy="4" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="border" />
				<feMergeNode in="erode" />
			</feMerge>
		</filter>
		<filter id="PHYLO-shadow" x="-50%" y="-50%" width="200%" height="200%">
			<feFlood flood-color="oklch(0 0 0)" />
			<feComposite operator="in" in2="SourceAlpha" />
			<feGaussianBlur stdDeviation="5" />
			<feOffset dy="2" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="PHYLO-rg">
			<stop offset="0%" stop-color="oklch(1 100% 150)" />
			<stop offset="100%" stop-color="oklch(0.25 100% 150)" />
		</radialGradient>
	</defs>
	<Background size={size * Math.sqrt(2)} fill="url(#PHYLO-rg)" />
	<g id="figure">
		{#each paths as d, i}
			<path
				class="p"
				{d}
				style={`fill:oklch(${i % 2 === 0 ? 0.5 : 0.75} 100% ${30 + (270 / paths.length) * i})`}
			/>
		{/each}
		{#each points as p, i}
			<circle
				class="c"
				r={3 + (5 / points.length) * i}
				cx={p.x}
				cy={p.y}
				style={`stroke:oklch(0 0 0 / 0.5);fill:oklch(${i % 3 === 1 ? 0.5 : 1} 75% ${
					120 + (270 / points.length) * i
				} / 1)`}
			/>
		{/each}
	</g>
</DopplerSvg>
