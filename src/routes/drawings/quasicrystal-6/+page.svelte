<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 5),
		updated_at: new Date(2023, 10, 5)
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

	const id = 'QUASICRYSTAL-6';
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
	const rawIntersections: Point[] = [];
	lineArray.forEach((l, i) => {
		for (let n = i + 1; n < lineArray.length; n++) {
			let int = intersection(lineArray[i], lineArray[n]);
			if (int.x > -size / 2 && int.x < size / 2 && int.y > -size / 2 && int.y < size / 2) {
				rawIntersections.push(int);
			}
		}
	});
	const roundedIntersections = rawIntersections.map((i) => ({
		x: Math.floor(i.x),
		y: Math.floor(i.y)
	}));
	const intersectionsWithMagnitudeMap = new Map();
	roundedIntersections.forEach((intersection) => {
		const i = JSON.stringify(intersection);
		if (!intersectionsWithMagnitudeMap.get(i)) {
			intersectionsWithMagnitudeMap.set(i, 2);
		} else {
			intersectionsWithMagnitudeMap.set(i, intersectionsWithMagnitudeMap.get(i) + 1);
		}
	});
	const circles2: Circle[] = [...intersectionsWithMagnitudeMap].map((e) => {
		const c = JSON.parse(e[0]);
		return { x: c.x, y: c.y, r: e[1] };
	});
</script>

<DopplerSvg {id} {size} logoProps={{ stroke: 'oklch(0.25 100% 300)' }}>
	<defs>
		<mask id="QUASICRYSTAL-6-hexmask">
			<Background {size} fill="black" />
			<path d={polygonPath(6, radii[0] * 2 + 5)} fill="white" />
		</mask>
		<filter id="QUASICRYSTAL-6-bg">
			<feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="5" seed="8" />
			<feDisplacementMap scale="1024" />
			<feColorMatrix
				values="0.125 0 0 0 0
                0 0.0625 0 0 0
                0 0 2 0 0
                0 0 0 0.25 0"
			/>
		</filter>
		<filter id="QUASICRYSTAL-6-glow">
			<feMorphology operator="dilate" radius="1" />
			<feGaussianBlur stdDeviation="3" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<radialGradient id="QUASICRYSTAL-6-rg">
			<stop offset="0%" stop-color="oklch(0.99 100% 300)" />
			<stop offset="100%" stop-color="oklch(0.01 50% 300)" />
		</radialGradient>
	</defs>
	<Background {size} fill="url(#QUASICRYSTAL-6-rg)" />
	<Background {size} filter="url(#QUASICRYSTAL-6-bg)" />

	<LineWithLegend lineArray={lineArray2} style={`stroke:oklch(0.5 100% 300);`} />
	<g filter="url(#QUASICRYSTAL-6-glow)">
		<g id="circles" mask="url(#QUASICRYSTAL-6-hexmask">
			{#each circles2 as c}
				<circle r={c.r} cx={c.x} cy={c.y} style={`fill:oklch(0.99 50% 300);`} />
			{/each}
			{#each circles as c}
				<circle
					r={c.r}
					cx={c.x}
					cy={c.y}
					style={`fill:none;stroke:oklch(0.99 100% 270);stroke-width:1;`}
				/>
			{/each}
		</g>
		<LineWithLegend {lineArray} style={`stroke:oklch(0.99 100% 90);stroke-width:1;`} />
	</g>
</DopplerSvg>
