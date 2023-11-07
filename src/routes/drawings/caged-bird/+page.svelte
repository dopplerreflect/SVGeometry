<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 31),
		updated_at: new Date(2023, 9, 31)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		arrayMap,
		intersection,
		phi,
		polygonPath,
		radialPoint
	} from '$lib/geometry';

	const id = 'CAGED-BIRD';
	const size = 2 ** 10;
	const angles = anglesArray(6);
	const ro = (size / 4) * 0.95;
	const radii = [ro, ro * phi, ro * phi ** 2, ro * phi ** 3];
	const circles: Circle[] = [
		...angles.map((a, i) => radii.slice(0).map((r) => ({ r, ...radialPoint(a, radii[0]) }))).flat(),
		...radii.map((r) => ({ r, x: 0, y: 0 }))
	];
	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 1) % 6], radii[0], {
						center: radialPoint(angles[(i + 1) % 6], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 1) % 6], radii[1], {
						center: radialPoint(angles[(i + 1) % 6], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 1) % 6], radii[2], {
						center: radialPoint(angles[(i + 1) % 6], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[3], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 1) % 6], radii[3], {
						center: radialPoint(angles[(i + 1) % 6], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 3) % 6], radii[3], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 4) % 6], radii[3], {
						center: radialPoint(angles[(i + 1) % 6], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 5) % 6], radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 2) % 6], radii[0], {
						center: radialPoint(angles[(i + 1) % 6], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % 6], radii[1], {
						center: radialPoint(angles[(i + 5) % 6], radii[0])
					}),
					radialPoint(angles[(i + 1) % 6], radii[1], {
						center: radialPoint(angles[(i + 2) % 6], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 0) % 6], radii[2], {
						center: radialPoint(angles[(i + 5) % 6], radii[0])
					}),
					radialPoint(angles[(i + 1) % 6], radii[2], {
						center: radialPoint(angles[(i + 2) % 6], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a, radii[2] * phi), radialPoint(angles[(i + 1) % 6], radii[2] * phi)] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a, radii[0], { center: radialPoint(a, radii[0]) }), { x: 0, y: 0 }] as Line
		)
	];
	const lineArray2 = [...lineArray];
	angles.forEach((a, i) => {
		lineArray.splice(i + 36, 1, [
			intersection(lineArray[(i + 5) % 6], lineArray[i + 36]),
			intersection(lineArray[(i + 1) % 6], lineArray[i + 36])
		]);
	});
	arrayMap(8, (n) => n).forEach((n) => {
		angles.forEach((a, i) => {
			lineArray2.splice(i + (n + 1) * 6, 1, [
				intersection(lineArray[(i + 5) % 6], lineArray[i + (n + 1) * 6]),
				intersection(lineArray[(i + 1) % 6], lineArray[i + (n + 1) * 6])
			]);
		});
	});
</script>

<DopplerSvg {id} {size} logoProps={{ stroke: 'oklch(0.25 100% 300)' }}>
	<defs>
		<mask id="CAGED-BIRD-hexmask">
			<Background {size} fill="black" />
			<path d={polygonPath(6, radii[0] * 2)} fill="white" />
		</mask>
		<filter id="CAGED-BIRD-bg">
			<feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="5" seed="8" />
			<feDisplacementMap scale="1024" />
			<feColorMatrix
				values="0.125 0 0 0 0
                0 0.0625 0 0 0
                0 0 2 0 0
                0 0 0 0.25 0"
			/>
		</filter>
		<filter id="CAGED-BIRD-glow">
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="3" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="CAGED-BIRD-rg">
			<stop offset="0%" stop-color="oklch(1 100% 300)" />
			<stop offset="100%" stop-color="oklch(0 50% 300)" />
		</radialGradient>
		<style>
			SVG#CAGED-BIRD {
				& #circles {
				}
			}
		</style>
	</defs>
	<Background {size} fill="url(#CAGED-BIRD-rg)" />
	<Background {size} filter="url(#CAGED-BIRD-bg)" />

	<LineWithLegend lineArray={lineArray2} style={`stroke:oklch(0.5 100% 300);`} />
	<g filter="url(#CAGED-BIRD-glow)">
		<g id="circles" mask="url(#CAGED-BIRD-hexmask">
			{#each circles as c}
				<circle
					r={c.r}
					cx={c.x}
					cy={c.y}
					style={`fill:none;stroke:oklch(1 100% 270);stroke-width:1;`}
				/>
			{/each}
		</g>
		<LineWithLegend {lineArray} style={`stroke:oklch(1 100% 90);stroke-width:1;`} />
	</g>
</DopplerSvg>
