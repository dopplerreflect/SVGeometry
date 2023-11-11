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
	import {
		Phi,
		anglesArray,
		arrayMap,
		pentagram,
		phi,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const r = size * 0.18;
	const radii = arrayMap(4, (n) => r * phi ** n);
	const angles = anglesArray(10);
	const circles = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...radii.map((r) => angles.map((a, i) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
		// ...angles.map((a) => ({ r: radii[3], ...radialPoint(a, radii[2]) }))
	];
</script>

<DopplerSvg {id} {size}>
	<filter id="TEMPLATE-distort">
		<feTurbulence
			type="fractalNoise"
			baseFrequency="0.0125"
			seed="3"
			numOctaves="4"
			result="noise"
		/>
		<feDisplacementMap
			in="SourceGraphic"
			in2="noise"
			scale="512"
			xChannelSelector="R"
			yChannelSelector="G"
		/>
	</filter>
	<filter id="TEMPLATE-glow">
		<feMorphology operator="dilate" radius="1" />
		<feGaussianBlur stdDeviation="5" />
		<feMerge>
			<feMergeNode />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
	<Background {size} fill="oklch(0.2 0 0)" />
	<g filter="url(#TEMPLATE-distort)">
		{#each angles as a, i}
			<path
				class="rotatable"
				style={`fill:none;stroke:oklch(0.2 ${i % 2 === 0 ? 100 : 66}% 300);stroke-width:20;`}
				d={`M${radialPointString(a, radii[2])} ${radialPointString(a, (size / 2) * Math.sqrt(2))}`}
			/>
		{/each}
	</g>

	<g filter="url(#TEMPLATE-glow)">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style="fill:none;stroke:oklch(1 100% 150)" />
		{/each}
		<path class="rotatable" style={`fill:none;stroke:oklch(1 100% 150);`} d={pentagram(radii[0])} />
		<path
			class="rotatable"
			style={`fill:none;stroke:oklch(1 100% 150);`}
			d={pentagram(radii[0] * Phi)}
		/>
		<path
			class="rotatable"
			style={`fill:none;stroke:oklch(1 100% 150);`}
			d={pentagram(radii[0] * Phi ** 2)}
		/>
		{#each angles as a}
			<path
				class="rotatable"
				style={`fill:none;stroke:oklch(1 100% 150);transform-origin:${radialPointString(
					a,
					radii[0],
					undefined,
					'px'
				)};`}
				d={pentagram(radii[0], { center: radialPoint(a, radii[0]), rotate: 36 })}
			/>
			<path
				class="rotatable"
				style={`fill:none;stroke:oklch(1 100% 150);transform-origin:${radialPointString(
					a,
					radii[0],
					undefined,
					'px'
				)};`}
				d={pentagram(radii[2], { center: radialPoint(a, radii[0]), rotate: 0 })}
			/>
		{/each}
	</g>
</DopplerSvg>

<style>
	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(72deg);
		}
	}

	.rotatable {
		animation: spin 12s linear 0s infinite;
	}
</style>