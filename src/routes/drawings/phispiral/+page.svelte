<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 11, 12),
		updated_at: new Date(2023, 11, 12)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { Phi, anglesArray, arrayMap, pentagram, phi, radialPointString } from '$lib/geometry';

	const id = 'PHISPIRAL';
	const size = 2 ** 11;

	const r = size * 0.381 * Phi ** 3;
	const radii = arrayMap(10, (n) => r * phi ** n);
	const angles = anglesArray(60);
	const numAngles = 89;
	const d = 10 / numAngles;
	const pathAngles = anglesArray(numAngles, 0);
	pathAngles.push(0);
	const anglesReversed = pathAngles.slice().reverse();
	const pathR =
		'M' + pathAngles.map((a, i) => radialPointString(a, r * phi ** (0 + d * i))).join(' ');
	const pathL =
		'M' + anglesReversed.map((a, i) => radialPointString(a, r * phi ** (0 + d * i))).join(' ');
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="PHISPIRAL-glow">
			<feMorphology operator="dilate" radius="2" />
			<feGaussianBlur stdDeviation="8" />
			<feMerge>
				<feMergeNode />
				<feMergeNode />
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
				<feMergeNode in="SourceGraphic" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<g id="PHISPIRAL-petal">
			<path d={pathR} />
			<path d={pathL} />
		</g>
		<radialGradient id="PHISPIRAL-rg" r="70%">
			<stop offset="0%" stop-color="oklch(0.25 100% 60)" />
			<stop offset="100%" stop-color="oklch(0 100% 300)" />
		</radialGradient>
	</defs>
	<Background {size} fill="url(#PHISPIRAL-rg)" />
	<g style="stroke:oklch(0.5 100% 300);stroke-width:0.5;fill:none;">
		<g id="spirals" filter="url(#PHISPIRAL-glow)">
			{#each angles as a}
				<use href="#PHISPIRAL-petal" transform={`rotate(${a})`} />
			{/each}
		</g>
		<g id="lines" style="stroke:oklch(99% 100% 90);" filter="url(#PHISPIRAL-glow)">
			{#each radii as r, i}
				<path d={pentagram(r)} transform={`rotate(${36})`} />
				<path d={pentagram(r)} transform={`rotate(${0})`} />
			{/each}
		</g>
		<g id="circles" filter="url(#PHISPIRAL-glow)">
			{#each radii as r, i}
				<circle {r} style="stroke:oklch(99% 100% 240);fill:none;" />
			{/each}
		</g>
	</g>
</DopplerSvg>
