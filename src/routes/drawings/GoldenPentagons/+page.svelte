<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: ['phi', 'pentagon', 'pentagram'],
		created_at: new Date(2023, 8, 17),
		updated_at: new Date(2023, 8, 17)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, phi, polygonPath, radialPoint } from '$lib/geometry';

	const id = 'GoldenPentagons';
	const size = 2 ** 10;
	const ro = size / 4.1;
	const radii = [ro, ro * phi, ro * phi ** 2, ro * phi ** 3, ro * phi ** 4];
	const angles = anglesArray(10);
	const paths: string[] = [
		...angles.map((a, i) =>
			radii.map((r) => polygonPath(5, r, { center: radialPoint(a, radii[0]), rotate: 36 * i }))
		)
	].flat();
</script>

<DopplerSvg {id} {size} logoProps={{ stroke: 'oklch(0.4 0.09 60)' }}>
	<defs>
		<filter id="GoldenPentagonsFilter">
			<feMorphology in="SourceAlpha" operator="dilate" radius="1" result="dilate" />
			<feGaussianBlur in="dilate" stdDeviation="2" result="blur" />
			<feOffset in="blur" dx="0" dy="2" result="offset" />
			<feMerge>
				<feMergeNode in="offset" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.3 0.09 60)" />
	{#each paths as d, i}
		<path {d} fill={`oklch(1 0.37 ${30 + (i % 5) * 20} / ${0.1 + (i % 5) * 0.1})`} />
	{/each}
	<g filter="url(#GoldenPentagonsFilter)">
		{#each paths as d, i}
			<path {d} fill={`none`} stroke-width="1" stroke="oklch(1 0.37 60)" />
		{/each}
	</g>
</DopplerSvg>
