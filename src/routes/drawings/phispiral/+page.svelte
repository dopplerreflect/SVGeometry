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
	const size = 2 ** 10;

	const r = size * 0.45;
	const radii = arrayMap(7, (n) => r * phi ** n);
	const angles = anglesArray(30);
	const numAngles = 89;
	const d = 6 / numAngles;
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
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="3" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<g id="PHISPIRAL-petal">
			<path d={pathR} />
			<path d={pathL} />
		</g>
		<mask id="PHISPIRAL-mask">
			<Background {size} fill="black" />
			<circle {r} fill="white" />
		</mask>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	<g filter="url(#PHISPIRAL-glow)" style="stroke:oklch(0.5 100% 330);fill:none;">
		{#each angles as a}
			<use href="#PHISPIRAL-petal" transform={`rotate(${a})`} />
		{/each}
		{#each radii as r, i}
			<circle {r} style="stroke:oklch(1 100% 150);fill:none;" />
			<path d={pentagram(r)} style="stroke:oklch(1 100% 90);" transform={`rotate(${i * 36})`} />
		{/each}
		<path
			d={pentagram(r * Phi)}
			style="stroke:oklch(1 100% 90);"
			transform={`rotate(${36})`}
			mask="url(#PHISPIRAL-mask)"
		/>
		<path
			d={pentagram(r * Phi ** 2)}
			style="stroke:oklch(1 100% 90);"
			transform={`rotate(${0})`}
			mask="url(#PHISPIRAL-mask)"
		/>
	</g>
</DopplerSvg>
