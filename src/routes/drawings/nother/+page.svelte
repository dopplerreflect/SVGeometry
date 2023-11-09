<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 8),
		updated_at: new Date(2023, 10, 8, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';
	import {
		Phi,
		anglesArray,
		arrayMap,
		phi,
		radialPoint,
		polygonFromIntersectionOfLines
	} from '$lib/geometry';

	const id = 'NOTHER';
	const size = 2 ** 10;
	const ro = size / 6.5;
	const angles = anglesArray(10);
	const radii = arrayMap(3, (n) => ro * phi ** n);
	const circles: Circle[] = [
		...radii.map((r, i) => angles.map((a) => ({ r, ...radialPoint(a, r * Phi ** 3 - r) }))).flat()
	];
	const lineArray: Line[] = [
		...radii
			.map((r) => [
				...angles.map(
					(a, i) =>
						[
							radialPoint(angles[(i + 9) % 10], r, {
								center: radialPoint(angles[(i + 0) % 10], r * Phi ** 3 - r)
							}),
							radialPoint(angles[(i + 3) % 10], r, {
								center: radialPoint(angles[(i + 2) % 10], r * Phi ** 3 - r)
							})
						] as Line
				),
				...angles.map(
					(a, i) =>
						[
							radialPoint(angles[(i + 9) % 10], r, {
								center: radialPoint(angles[(i + 0) % 10], r * Phi ** 3 - r)
							}),
							radialPoint(angles[(i + 5) % 10], r, {
								center: radialPoint(angles[(i + 4) % 10], r * Phi ** 3 - r)
							})
						] as Line
				)
			])
			.flat()
	];
	const polygons: string[] = [
		polygonFromIntersectionOfLines([6, 7, 18, 28, 38, 26, 27, 33, 25, 13, 6], lineArray),
		polygonFromIntersectionOfLines([13, 17, 14, 16, 13], lineArray),
		polygonFromIntersectionOfLines([37, 46, 14, 37, 16, 14, 33, 16, 46, 33, 37], lineArray),
		polygonFromIntersectionOfLines([35, 37, 55, 57, 35], lineArray),
		polygonFromIntersectionOfLines([34, 37, 54, 57, 34], lineArray),
		polygonFromIntersectionOfLines([26, 27, 38, 48, 58, 46, 47, 53, 45, 33, 26], lineArray),
		polygonFromIntersectionOfLines([46, 47, 58, 54, 16, 15, 57, 53, 46], lineArray)
	];
</script>

<DopplerSvg {id} {size}>
	<filter id={`${id}-shadow`}>
		<feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
		<feMorphology in="SourceAlpha" operator="dilate" radius="10" />
		<feGaussianBlur stdDeviation="5" />
		<feOffset dy="5" dx="0" />
		<feMerge>
			<feMergeNode in="blur" />
			<feMergeNode />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
	<filter id={`${id}-glow`}>
		<feMorphology operator="dilate" radius="1" />
		<feGaussianBlur stdDeviation="3" />
		<feMerge>
			<feMergeNode />
			<feMergeNode in="SourceGraphic" />
		</feMerge>
	</filter>
	<filter id={`${id}-bg`}>
		<feTurbulence type="fractalNoise" baseFrequency="0.0125" numOctaves="2" seed="1618033" />
		<feDisplacementMap scale="100" xChannelSelector="R" yChannelSelector="G" />
		<feColorMatrix
			values="0.5 0 0 0 1
              0 0 0 0 0
              0 0 0.125 0 0
              0 0 0 1 0"
		/>
	</filter>
	<style>
		svg#NOTHER {
			& g.pg {
				filter: url(#NOTHER-shadow);
				fill: oklch(0 0 0 / 0.125);
				stroke: oklch(1 100% 150);
			}
			& g.pg0 {
				fill: oklch(0.5 100% 270 / 0.125);
			}
			& g.pg1 {
				fill: oklch(1 100% 45 / 0.5);
			}
			& g.pg2 {
				fill: oklch(1 100% 90 / 0.5);
			}
			& g.pg3 {
				fill: oklch(1 100% 90 / 0.5);
			}
			& g.pg4 {
				fill: oklch(1 100% 90 / 0.5);
			}
			& g.pg5 {
				fill: oklch(0.25 100% 270 / 0.25);
			}
			& g.pg6 {
				fill: oklch(0 100% 270 / 0.25);
			}
		}
	</style>
	<Background {size} fill="oklch(0 25% 270)" />
	<Background {size} filter={`url(#${id}-bg)`} />
	<g filter={`url(#${id}-glow)`}>
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style={`fill:none;stroke:oklch(1 100% 30)`} />
		{/each}
		<LineWithLegend {lineArray} style={`stroke:oklch(1 100% 30);stroke-width:1;`} />
	</g>
	{#each polygons as points, i}
		<PolygonToRadial {points} angles={angles.map((a) => a + 18)} classname={`pg pg${i}`} />
	{/each}
</DopplerSvg>
