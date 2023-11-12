<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 12, 8),
		updated_at: new Date(2023, 10, 12, 8)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';
	import {
		anglesArray,
		arrayMap,
		phi,
		polygonFromIntersectionOfLines,
		polygonPath,
		radialPoint
	} from '$lib/geometry';

	const id = 'TILED-SUN';
	const size = 2 ** 10;
	const d = 5;
	const rotate = false;
	const angles = anglesArray(d);
	const r = size * 0.25;
	const radii = arrayMap(3, (n) => r * phi ** n);
	const circles = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...radii.map((r) => angles.map((a) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
	const lineArray: Line[] = [];
	const polygonGroups: string[][] = [];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="TILED-SUN-shrink">
			<feMorphology in="SourceAlpha" operator="erode" radius="1" />
			<feGaussianBlur stdDeviation="2" />
			<feOffset dy="3" result="shadow" />
			<feMorphology in="SourceAlpha" result="erode2" operator="erode" radius="2" />
			<feColorMatrix
				in="erode2"
				result="border"
				values="1 0 0 0 1
                0 1 0 0 1
                0 0 1 0 1
                0 0 0 1 0"
			/>
			<feGaussianBlur stdDeviation="1" />
			<feOffset dy="-2" result="topglow" />
			<feMorphology in="SourceGraphic" operator="erode" radius="3" />
			<feMerge>
				<feMergeNode in="topglow" />
				<feMergeNode in="shadow" />
				<!-- <feMergeNode in="border" /> -->
				<feMergeNode />
			</feMerge>
		</filter>
		<style>
			svg#TILED-SUN {
				& g.filtered {
					filter: url(#TILED-SUN-shrink);
					fill: oklch(1 0 0 / 0.25);
				}
		</style>
	</defs>
	<Background {size} fill="oklch(0.2 0 0)" />
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.33 0 0);fill:none;`} />
		<path
			d={polygonPath(d, c.r, { center: { x: c.x, y: c.y }, rotate: rotate ? 360 / d / 2 : 0 })}
			style={`stroke:oklch(0.75 0 0);fill:none;`}
		/>
		<path
			d={polygonPath(d, c.r, { center: { x: c.x, y: c.y }, rotate: !rotate ? 360 / d / 2 : 0 })}
			style={`stroke:oklch(0.75 0 0);fill:none;`}
		/>
	{/each}
	<g id="lines">
		<LineWithLegend {lineArray} style="stroke:oklch(1 0 0)" />
	</g>
	<g id="polygons">
		{#each polygonGroups as pg, pgi}
			{#each pg as points, i}
				<PolygonToRadial
					{points}
					angles={angles.map((a) => a - 90)}
					classname={`filtered p${i} pg${pgi}`}
				/>
			{/each}
		{/each}
	</g>
</DopplerSvg>
