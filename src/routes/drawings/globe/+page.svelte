<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2024, 0, 11),
		updated_at: new Date(2024, 0, 11)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray } from '$lib/geometry';

	const id = 'GLOBE';
	const size = 2 ** 10;
	const angleCount = 55;
	const r = size * 0.455;
	const angles = anglesArray(angleCount);
	const hemiPoints: Point[] = angles.slice(1, Math.ceil(angleCount / 2)).map((a, i) => ({
		x: r * Math.cos(a * (Math.PI / 180)),
		y: r * Math.sin(a * (Math.PI / 180))
	}));
	const ellipses: Point[][] = hemiPoints.map((hp, hi) =>
		angles.map((a, ai) => ({
			x: hp.x * Math.cos(a * (Math.PI / 180)),
			y: hp.y + (hp.x * Math.sin(a * (Math.PI / 180))) / 12
		}))
	);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="GLOBE-blur">
			<feMorphology operator="dilate" radius="1" result="dilate" />
			<feGaussianBlur stdDeviation="0 16" result="v" />
			<feGaussianBlur in="dilate" stdDeviation="16 0" result="h" />
			<feMerge>
				<feMergeNode in="v" />
				<feMergeNode in="h" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.0 0 0)" />
	<g filter="url(#GLOBE-blur)" transform="rotate(23.5)">
		{#each ellipses as ellipsePoints, ei}
			{#each ellipsePoints as p, i}
				<circle
					r={2 + Math.abs(angleCount / 2 - i) * 0.0625}
					cx={p.x}
					cy={p.y}
					style={`fill:oklch(0.99 100% ${
						270 + ei * (360 / (angleCount / 2)) + i * (360 / angleCount)
					})`}
				/>
			{/each}
		{/each}
	</g>
</DopplerSvg>
