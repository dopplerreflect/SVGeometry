<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 22),
		updated_at: new Date(2023, 9, 22)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import GridPattern from '$lib/components/GridPattern.svelte';
	import { Phi, anglesArray, arrayMap, pentagram, phi, radialPoint, starPath } from '$lib/geometry';

	const id = 'GOLDEN-STARFIELD';
	const size = 2 ** 10;
	const startBaseRadius = size / 1.75;
	const radii = arrayMap(10, (n) => startBaseRadius * phi ** n);
	const pentagramPaths = anglesArray(10)
		.map((a) =>
			[...Array(8).keys()].map((i) =>
				pentagram(radii[i + 2], { center: radialPoint(a, radii[i]), rotate: a + 18 })
			)
		)
		.flat();
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#GOLDEN-STARFIELD {
				& g#static {
					fill: none;
					stroke: oklch(1 100% 90);
					stroke-width: 1;
				}
				& g#animated {
					fill: oklch(1 0 0 / 0.25);
				}
			}
		</style>
		<mask id="GOLDEN-STARFIELD-mask">
			<radialGradient id="GSMG">
				<stop offset="0%" stop-color="white" />
				<stop offset="100%" stop-color="black" />
			</radialGradient>
			<Background {size} fill="url(#GSMG)" />
		</mask>
		<GridPattern id="GOLDEN-STARFIELD-gp" size={radii[4]} stroke="oklch(1 100% 300)" />
	</defs>
	<Background {size} fill="url(#GOLDEN-STARFIELD-gp)" />

	<g style="--phi: {Phi};" id="animated">
		{#each pentagramPaths as path, i}
			<path d={path} />
		{/each}
	</g>
	<Background {size} fill="oklch(0 0 0)" mask="url(#GOLDEN-STARFIELD-mask)" />
	<g style="--phi: {Phi};" id="static" fill-rule="evenodd">
		{#each pentagramPaths as path, i}
			<path d={path} />
		{/each}
	</g>
</DopplerSvg>

<style>
	@keyframes grow {
		0% {
			transform: scale(1) rotate(0deg);
		}
		100% {
			transform: scale(var(--phi)) rotate(36deg);
		}
	}

	#animated {
		animation: grow 1s linear infinite;
	}
</style>
