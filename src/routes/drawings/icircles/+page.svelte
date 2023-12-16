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

	const id = 'ICIRCLES';
	const size = 2 ** 10;
	const r = size * 0.24;
	const angles = anglesArray(60);
	const circles: Circle[] = angles.map((a) => ({ r, ...radialPoint(a, r) }));
	const ci = multiCircleIntersections(circles);
	console.log(ci.length);
</script>

<DopplerSvg {id} {size} logoProps={{ stroke: 'oklch(0.25 100% 240)' }}>
	<defs>
		<filter id="ICIRCLES-glow">
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="13 3" />
			<feMerge>
				<feMergeNode in="SourceGraphic" />
				<feMergeNode />
			</feMerge>
		</filter>
		<filter id="ICIRCLES-glow2">
			<feMorphology operator="dilate" radius="3" />
			<feGaussianBlur stdDeviation="0 13" />
			<feMerge>
				<feMergeNode in="SourceGraphic" />
				<feMergeNode />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0 0 0)" />
	<g filter="url(#ICIRCLES-glow2)">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.25 100% 270);fill:none;`} />
		{/each}
	</g>
	<g filter="url(#ICIRCLES-glow)">
		{#each ci as p, i}
			<circle
				r={3}
				cx={p.x}
				cy={p.y}
				style={`stroke:oklch(0.5 100% ${((360 ** 2 / ci.length) * i) % 360});fill:oklch(0.99 50% ${
					((360 ** 2 / ci.length) * i) % 360
				})`}
			/>
		{/each}
	</g>
</DopplerSvg>
