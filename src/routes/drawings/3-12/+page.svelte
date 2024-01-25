<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2024, 0, 24),
		updated_at: new Date(2024, 0, 24)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import { arrayMap, phi, pointToString, polygon } from '$lib/geometry';

	function radiusForChordLength(angle: number, chord: number) {
		return chord / 2 / Math.sin(angle);
	}
	const id = '3-12';
	const size = 2 ** 10;
	const sideLength = size * phi ** 3;

	const polygonSideNumbers = arrayMap(10, (n) => n + 3).toReversed();
	const bottom = radiusForChordLength(Math.PI / 12, sideLength);
	const polygons = polygonSideNumbers.map((n) => {
		let radius = radiusForChordLength(Math.PI / n, sideLength);
		let y = bottom - Math.sqrt(radius ** 2 - (sideLength / 2) ** 2);
		return polygon(n, radius, {
			rotate: n % 2 === 0 ? 360 / n / 2 : 0,
			center: { x: 0, y }
		})
			.map((p) => pointToString(p))
			.join(' ');
	});
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="3-12-glow">
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	<g filter="">
		{#each polygons as points, i}
			<polygon {points} style={`fill:oklch(${0.09 + (1 / polygons.length) * i} 50% 60);`} />
		{/each}
	</g>
	<g filter="url(#3-12-glow)">
		{#each polygons as points, i}
			<polygon {points} style={`fill:none;stroke:oklch(0.5 100% 300);`} />
		{/each}
	</g>
</DopplerSvg>
