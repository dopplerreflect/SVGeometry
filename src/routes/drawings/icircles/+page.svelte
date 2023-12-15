<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 11, 15, 14),
		updated_at: new Date(2023, 11, 15, 14)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { anglesArray, multiCircleIntersections, radialPoint } from '$lib/geometry';

	const id = 'TEMPLATE';
	const size = 2 ** 10;
	const r = size * 0.24;
	const angles = anglesArray(60);
	const circles: Circle[] = angles.map((a) => ({ r, ...radialPoint(a, r) }));
	const ci = multiCircleIntersections(circles);
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="TEMPLATE-glow">
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="8 3" />
			<feMerge>
				<feMergeNode in="SourceGraphic" />
				<feMergeNode />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 0 0)" />
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.5 100% 300);fill:none;`} />
	{/each}
	<g filter="url(#TEMPLATE-glow)">
		{#each ci as p, i}
			<circle
				r={3}
				cx={p.x}
				cy={p.y}
				style={`stroke:oklch(0 0 0);fill:oklch(0.99 100% ${(1440 / circles.length) * i})`}
			/>
		{/each}
	</g>
</DopplerSvg>
