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
	import { anglesArray, arrayMap, phi, radialPointString } from '$lib/geometry';

	const id = 'EYE';
	const size = 2 ** 10;
	const angles = anglesArray(60);
	const r = size * phi * 0.5;
	const radii = arrayMap(3, (n) => r * phi ** n);
	const circles: Circle[] = [
		{ r: radii[0], x: 0, y: r / 2 },
		{ r: radii[0], x: 0, y: -r / 2 },
		{ r: radii[1], x: 0, y: -r / 2 },
		{ r: radii[2], x: 0, y: -r / 2 }
	];
	let inc = (radii[0] - radii[1]) / 13;
	const dimRadii: number[] = [];
	for (let i = inc; i < radii[0] * 2; i += inc) {
		dimRadii.push(i);
	}
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#EYE {
				& circle {
					stroke: oklch(0.99 100% 90);
					stroke-width: 3;
					fill: none;
				}
				& circle.dim {
					stroke: oklch(0.33 100% 330);
					stroke-width: 2;
				}
			}
		</style>
		<radialGradient id="EYE-rg">
			<stop offset="0%" stop-color="oklch(0.1 100% 210)" />
			<stop offset="100%" stop-color="oklch(0.5 100% 210)" />
		</radialGradient>
		<mask id="EYE-mask">
			<radialGradient id="EYE-mask-rg">
				<stop offset="0%" stop-color="oklch(1 0 0)" />
				<stop offset="100%" stop-color="black" />
			</radialGradient>
			<filter id="EYE-mask-blur">
				<feMorphology operator="dilate" radius="5" />
				<feGaussianBlur stdDeviation="21" />
			</filter>
			<Background {size} fill="url(#EYE-mask-rg)" />
			<path
				filter="url(#EYE-mask-blur)"
				d={`M${(-r / 2) * Math.sqrt(3)} 0A${r} ${r} 0 0 0 ${
					(r / 2) * Math.sqrt(3)
				} 0A${r} ${r} 0 0 0 ${(-r / 2) * Math.sqrt(3)} 0Z`}
				style="stroke:white;stroke-width:3;fill:white;"
			/>
		</mask>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	<g mask="url(#EYE-mask">
		<circle {r} cy={-r / 2} style="fill:url(#EYE-rg)" />
		{#each dimRadii as cr}
			<circle class="dim" r={cr} cy={-r / 2} />
		{/each}
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
		{#each angles.slice(17, 44) as a}
			<path
				d={`M0 ${-r / 2} ${radialPointString(a, radii[2], { center: { x: 0, y: -r / 2 } })}`}
				style="stroke:oklch(0.99 100% 90);stroke-width:1;"
			/>
		{/each}

		{#each angles.slice(18, 43) as a}
			<path
				d={`M${radialPointString(a, radii[2], { center: { x: 0, y: -r / 2 } })} ${radialPointString(
					a,
					radii[1],
					{ center: { x: 0, y: -r / 2 } }
				)}`}
				style="stroke:oklch(0.99 100% 90);stroke-width:3;"
			/>
		{/each}
	</g>
</DopplerSvg>
