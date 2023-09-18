<script context="module" lang="ts">
	export const metadata: DrawingMetadata = {
		tags: []
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import HexPattern from '$lib/components/HexPattern.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		Phi,
		SQRT3,
		anglesArray,
		pathFromIntersectionsOfLines,
		phi,
		radialPoint
	} from '$lib/geometry';

	const id = 'GoldenHexiGlass';
	const size = 2 ** 10;
	const ro = size / 4.1;
	const angles = anglesArray(6);
	const radii = [ro, ro * phi, ro * phi ** 2];

	const circles: Circle[] = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		{ r: ro * Phi, x: 0, y: 0 },
		...angles.map((a) => radii.map((r) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
	const h: Line[] = [
		...angles.map((a, i) => [radialPoint(a, radii[0] * 2), { x: 0, y: 0 }] as Line),
		...angles.map(
			(a, i) =>
				[radialPoint(a, radii[0] * 2), radialPoint(angles[(i + 1) % 6], radii[0] * 2)] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[i], radii[0]),
					radialPoint(angles[(i + 2) % 6], radii[2], { center: radialPoint(angles[i], radii[0]) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[i], radii[0]),
					radialPoint(angles[(i + 4) % 6], radii[2], { center: radialPoint(angles[i], radii[0]) })
				] as Line
		),
		...angles
			.map((a0) =>
				angles.map(
					(a1, i) =>
						[
							radialPoint(angles[i], radii[1], { center: radialPoint(a0, radii[0]) }),
							radialPoint(angles[(i + 1) % 6], radii[1], { center: radialPoint(a0, radii[0]) })
						] as Line
				)
			)
			.flat(),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[i] + 30, radii[0] * SQRT3),
					radialPoint(angles[(i + 1) % 6], radii[1], { center: radialPoint(angles[i], radii[0]) })
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[i] + 30, radii[0] * SQRT3),
					radialPoint(angles[i], radii[1], { center: radialPoint(angles[(i + 1) % 6], radii[0]) })
				] as Line
		)
	];
</script>

<DopplerSvg {size} {id} logoProps={{ stroke: 'oklch(0.75 50% 200)' }}>
	<defs>
		<style>
			svg#GoldenHexiGlass circle {
				fill: none;
				stroke: oklch(0.25 0.37 200);
				stroke-width: 1;
			}
			svg#GoldenHexiGlass #tiles path {
				filter: url(#GoldenHexiGlass-shrink);
				stroke: none;
			}
			svg#GoldenHexiGlass #lines {
				stroke: oklch(0.33 0.37 300);
				stroke-width: 7;
			}
			svg#GoldenHexiGlass #lines-top {
				stroke: oklch(0.66 0.37 200);
				stroke-width: 1;
			}
		</style>
		<linearGradient id={`${id}-gradient0`} gradientTransform="rotate(120)">
			<stop offset="0%" stop-color="oklch(1 0.37 90 / 0.8)" />
			<stop offset="33%" stop-color="oklch(1 0.37 60 / 0.8)" />
			<stop offset="66%" stop-color="oklch(1 0.37 30 / 0.8)" />
		</linearGradient>
		<linearGradient id={`${id}-gradient1`} gradientTransform="rotate(120)">
			<stop offset="0%" stop-color="oklch(1 0.37 150 / 0.8)" />
			<stop offset="33%" stop-color="oklch(1 0.37 120 / 0.8)" />
			<stop offset="66%" stop-color="oklch(1 0.37 90 / 0.8)" />
		</linearGradient>
		<linearGradient id={`${id}-gradient2`} gradientTransform="rotate(120)">
			<stop offset="0%" stop-color="oklch(1 0.37 270 / 0.8)" />
			<stop offset="50%" stop-color="oklch(0.75 0.37 270 / 0.8)" />
			<stop offset="100%" stop-color="oklch(0.5 0.37 90 / 0.8)" />
		</linearGradient>
		<linearGradient id={`${id}-gradient3`} gradientTransform="rotate(120)">
			<stop offset="0%" stop-color="oklch(1 0.37 90 / 0.8)" />
			<stop offset="33%" stop-color="oklch(1 0.37 60 / 0.8)" />
			<stop offset="44%" stop-color="oklch(1 0.37 30 / 0.8)" />
		</linearGradient>

		<g id="tiles">
			<path
				fill={`url(#${id}-gradient0)`}
				d={pathFromIntersectionsOfLines(['M', ...[0, 1, 34, 26, 0].map((i) => h[i]), 'Z'])}
			/>
			<path
				fill={`url(#${id}-gradient1)`}
				d={pathFromIntersectionsOfLines(['M', ...[0, 26, 34, 12, 0].map((i) => h[i]), 'Z'])}
			/>
			<path
				fill={`url(#${id}-gradient1)`}
				d={pathFromIntersectionsOfLines(['M', ...[1, 34, 26, 19, 1].map((i) => h[i]), 'Z'])}
			/>
			<path
				fill={`url(#${id}-gradient2)`}
				d={pathFromIntersectionsOfLines(['M', ...[0, 12, 35, 25, 24, 0].map((i) => h[i]), 'Z'])}
			/>
			<path
				fill={`url(#${id}-gradient2)`}
				d={pathFromIntersectionsOfLines(['M', ...[1, 19, 25, 35, 30, 1].map((i) => h[i]), 'Z'])}
			/>
			<path
				fill={`url(#${id}-gradient3)`}
				d={pathFromIntersectionsOfLines(['M', ...[0, 24, 60, 6, 0].map((i) => h[i]), 'Z'])}
			/>
			<path
				fill={`url(#${id}-gradient3)`}
				d={pathFromIntersectionsOfLines(['M', ...[1, 30, 66, 6, 1].map((i) => h[i]), 'Z'])}
			/>
			<path
				fill={`url(#${id}-gradient0)`}
				d={pathFromIntersectionsOfLines(['M', ...[34, 26, 25, 35, 34].map((i) => h[i]), 'Z'])}
			/>
			<path
				fill={`url(#${id}-gradient0)`}
				d={pathFromIntersectionsOfLines(['M', ...[25, 35, 66, 60, 25].map((i) => h[i]), 'Z'])}
			/>
		</g>
		<filter id={`${id}-shrink`}>
			<feMorphology in="SourceGraphic" operator="erode" radius={radii[2] / 12} result="eroded" />
		</filter>
		<filter id={`${id}-dropshadow`}>
			<feMorphology in="SourceAlpha" operator="dilate" radius="5" result="morph" />
			<feGaussianBlur in="morph" stdDeviation="5" result="blur" />
			<feOffset in="blur" dx={3} dy={10} result="offset" />
			<feMerge>
				<feMergeNode in="offset" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<HexPattern
			id={`${id}-hexpattern`}
			size={radii[2] / 12}
			stroke="oklch(0.5 0.37 200)"
			patternTransform="rotate(30)"
		/>
	</defs>
	<Background {size} fill="oklch(0 0.37 300)" />
	<Background {size} fill={`url(#${id}-hexpattern)`} />
	<g>
		{#each angles as a, i}
			<g class={`sixth ${i % 2 === 0 ? 'even' : 'odd'}`} transform={`rotate(${a - 30})`}>
				<use href="#tiles" />
			</g>
		{/each}
	</g>
	{#each circles as c, i}
		<circle r={c.r} cx={c.x} cy={c.y} />
	{/each}
	<g id="lines" filter={`url(#${id}-dropshadow)`}>
		<LineWithLegend name="" lineArray={h} />
	</g>
	<g id="lines-top" filter="">
		<LineWithLegend name="" lineArray={h} />
	</g>
</DopplerSvg>
