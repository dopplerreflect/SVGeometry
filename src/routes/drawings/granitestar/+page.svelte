<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 12, 13),
		updated_at: new Date(2023, 9, 12, 15)
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
		pentagram,
		phi,
		polygonFromIntersectionOfLines,
		polygonPath,
		radialPoint
	} from '$lib/geometry';

	const id = 'GRANITESTAR';
	const size = 2 ** 10;
	const r = (size / 2) * phi ** 0.5;
	const radii = [r, r * phi, r * phi ** 2];
	const angles = anglesArray(5, -90);
	const angles10 = anglesArray(20);
	const circles: Circle[] = angles
		.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) })))
		.flat();
	circles.push(...radii.map((r) => ({ r, x: 0, y: 0 })));
	const lineArray: Line[] = angles
		.map((a1) =>
			angles10.map(
				(a2) =>
					[
						radialPoint(a1, radii[0]),
						radialPoint(a2, radii[0], { center: radialPoint(a1, radii[0]), rotate: a1 + 18 })
					] as Line
			)
		)
		.flat();
	const polygons: string[] = [
		polygonFromIntersectionOfLines([39, 35, 13, 9, 39], lineArray),
		polygonFromIntersectionOfLines([38, 36, 12, 10, 38], lineArray)
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#GRANITESTAR {
				& circle,
				polygon {
					stroke: oklch(1 100% 90);
					fill: none;
				}
				& line {
					stroke: oklch(0.5 100% 300);
				}
				& g.filtered {
					filter: url(#GRANITESTAR-dropshadow);
				}
			}
		</style>
		<filter id="GRANITESTAR-dropshadow">
			<feMorphology in="SourceAlpha" operator="dilate" radius="5" />
			<feGaussianBlur stdDeviation="5" />
			<feOffset dy="8" result="offset" />
			<feTurbulence type="fractalNoise" baseFrequency="0.33" numOctaves="1" result="noise" />
			<feComposite in2="SourceGraphic" operator="in" />
			<feColorMatrix type="saturate" values="0" />
			<feMerge>
				<feMergeNode in="offset" />
				<feMergeNode />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.1 100% 210)" />
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<LineWithLegend {lineArray} />
	<g class="filtered">
		<path
			d={pentagram(radii[0], { rotate: 0 })}
			style={`fill:oklch(1 0 0 / 0.5);stroke:oklch(1 0 0);fill-rule:evenodd;`}
		/>
	</g>
	<g class="filtered">
		<path d={polygonPath(10, radii[1])} style={`fill:oklch(1 0 0 / 0.5);stroke:oklch(1 0 0);`} />
	</g>

	{#each arrayMap(polygons.length, (n) => n) as i}
		<PolygonToRadial
			points={polygons[i]}
			{angles}
			style={`fill:oklch(1 0 0 / 0.5);stroke:oklch(1 0 0);`}
			classname="filtered"
			rotate={18}
		/>
	{/each}
	<g class="filtered">
		<path
			d={polygonPath(5, radii[2], { rotate: 36 })}
			style={`fill:oklch(1 0 0 / 0.5);stroke:oklch(1 0 0);`}
		/>
	</g>
	<g class="filtered">
		<path
			d={pentagram(radii[2], { rotate: 0 })}
			style={`fill:oklch(1 100% 90 / 0.5);stroke:oklch(1 0 0);fill-rule:evenodd;`}
		/>
	</g>
</DopplerSvg>
