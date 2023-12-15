<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 10, 12, 8),
		updated_at: new Date(2023, 10, 15, 18)
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
		intersection,
		phi,
		polygonFromIntersectionOfLines,
		polygonPath,
		radialPoint
	} from '$lib/geometry';

	const id = 'THIRTY-SIX-PENTAGONS';
	const size = 2 ** 10 + 5.1234;
	const d = 5;
	const rotate = false;
	const angles = anglesArray(d);
	const r = size * 0.24;
	const radii = arrayMap(3, (n) => r * phi ** n);
	const circles = [
		...radii.map((r) => ({ r, x: 0, y: 0 })),
		...radii.map((r) => angles.map((a) => ({ r, ...radialPoint(a, radii[0]) }))).flat()
	];
	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 1) % 5], radii[0], {
						center: radialPoint(angles[(i + 1) % 5], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 36, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 36, radii[0], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 36, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 36, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 72, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 72, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 144, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 144, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 216, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 216, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 288, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 288, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 360, radii[1], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 36, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 36, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 108, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a - 36, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 36, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 108, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 72, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 144, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 216, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 288, radii[2], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 360, radii[2], {
						center: radialPoint(a, radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 72, radii[2], { center: radialPoint(a, radii[0]) }),
					{ x: 0, y: 0 }
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 288, radii[2], { center: radialPoint(a, radii[0]) }),
					{ x: 0, y: 0 }
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a - 36, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 0, radii[2], {
						center: radialPoint(angles[(i + 4) % 5], radii[0])
					})
				] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 36, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 0, radii[2], {
						center: radialPoint(angles[(i + 1) % 5], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 36, radii[1], { center: radialPoint(a, radii[0]) }),
					radialPoint(a + 108, radii[1], {
						center: radialPoint(angles[(i + 2) % 5], radii[0])
					})
				] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii[0]), radialPoint(angles[(i + 1) % 5], radii[0])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a + 36, radii[0]), radialPoint(angles[(i + 2) % 5] + 36, radii[0])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii[1]), radialPoint(angles[(i + 2) % 5], radii[1])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(a + 36, radii[2]), radialPoint(angles[(i + 1) % 5] + 36, radii[2])] as Line
		),

		...angles.map(
			(a, i) =>
				[
					radialPoint(a + 72, radii[0], { center: radialPoint(a, radii[0]) }),
					radialPoint(angles[(i + 2) % 5], radii[0], {
						center: radialPoint(angles[(i + 3) % 5], radii[0])
					})
				] as Line
		)
	];
	const polygonGroups: string[][] = [
		[polygonFromIntersectionOfLines([119, 4, 0, 118, 85, 5, 80, 119], lineArray)],
		[
			polygonFromIntersectionOfLines([115, 81, 85, 118, 115], lineArray),
			polygonFromIntersectionOfLines(
				[119, 80, 4, 5, 0, 85, 118, 81, 20, 15, 10, 15, 90, 10, 15, 35, 10, 93, 35, 30, 89, 119],
				lineArray
			)
		],
		[
			polygonFromIntersectionOfLines(
				[80, 119, 30, 35, 15, 20, 118, 85, 81, 90, 10, 93, 89, 80],
				lineArray
			)
		],
		[
			polygonFromIntersectionOfLines(
				[
					117, 80, 89, 119, 30, 89, 65, 45, 40, 65, 55, 40, 50, 55, 81, 20, 90, 15, 10, 35, 93, 94,
					117
				],
				lineArray
			)
		],
		[
			polygonFromIntersectionOfLines([24, 94, 30, 93, 102, 99, 104, 93, 24], lineArray),
			polygonFromIntersectionOfLines([119, 93, 89, 75, 45, 119], lineArray),
			polygonFromIntersectionOfLines([118, 90, 81, 70, 50, 118], lineArray),
			polygonFromIntersectionOfLines([75, 65, 55, 70, 50, 40, 45, 75], lineArray),
			polygonFromIntersectionOfLines([103, 105, 104, 108, 103], lineArray)
		],
		[
			polygonFromIntersectionOfLines([75, 45, 65, 40, 55, 50, 70, 95, 99, 75], lineArray),
			polygonFromIntersectionOfLines([119, 45, 75, 119], lineArray),
			polygonFromIntersectionOfLines([118, 50, 70, 118], lineArray),
			polygonFromIntersectionOfLines([95, 31, 20, 95], lineArray),
			polygonFromIntersectionOfLines([118, 20, 103, 90, 115, 31, 100, 94, 118], lineArray)
		],
		[
			polygonFromIntersectionOfLines([118, 29, 25, 118], lineArray),
			polygonFromIntersectionOfLines([114, 104, 108, 25, 105, 103, 114], lineArray),
			polygonFromIntersectionOfLines([25, 108, 118, 60, 119, 105, 25], lineArray),
			polygonFromIntersectionOfLines([75, 60, 119, 118, 60, 70, 119, 118, 75], lineArray),
			polygonFromIntersectionOfLines(
				[108, 104, 30, 94, 20, 103, 105, 70, 25, 20, 95, 99, 30, 25, 75, 108],
				lineArray
			)
		],
		[
			polygonFromIntersectionOfLines([104, 99, 119, 60, 118, 95, 103, 70, 94, 75, 104], lineArray),
			polygonFromIntersectionOfLines([118, 105, 25, 119, 108, 25, 118], lineArray),
			polygonFromIntersectionOfLines([75, 60, 119, 75], lineArray),
			polygonFromIntersectionOfLines([118, 70, 60, 118], lineArray),
			polygonFromIntersectionOfLines([104, 25, 108, 104], lineArray),
			polygonFromIntersectionOfLines([103, 25, 105, 103], lineArray),
			polygonFromIntersectionOfLines([118, 75, 114, 113, 74, 118], lineArray),
			polygonFromIntersectionOfLines([114, 70, 109, 75, 114], lineArray)
		],
		[
			polygonFromIntersectionOfLines([114, 113, 103, 114], lineArray),
			polygonFromIntersectionOfLines([75, 109, 74, 108, 75], lineArray)
		],
		[polygonFromIntersectionOfLines([103, 108, 109, 103], lineArray)]
	];

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
		x: Math.round(i.x),
		y: Math.round(i.y)
	}));
	const intersectionsWithMagnitudeMap = new Map();
	roundedIntersections.forEach((intersection) => {
		const i = JSON.stringify(intersection);
		if (!intersectionsWithMagnitudeMap.get(i)) {
			intersectionsWithMagnitudeMap.set(i, 1);
		} else {
			intersectionsWithMagnitudeMap.set(i, intersectionsWithMagnitudeMap.get(i) + phi / 2);
		}
	});
	const intersectionCircles: Circle[] = [...intersectionsWithMagnitudeMap].map((e) => {
		const c = JSON.parse(e[0]);
		return { x: c.x, y: c.y, r: e[1] };
	});
	const circleRadii = new Set([...intersectionCircles.map((c) => c.r).sort((a, b) => a - b)]);
	const colors = new Map([...circleRadii].map((r, i) => [r, (360 / circleRadii.size) * i + 90]));
	//   style={`fill:oklch(${0.1 + (1 / (polygonGroups.length + 1)) * pgi} 75% 60)`}
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="THIRTY-SIX-PENTAGONS-shrink">
			<feMorphology in="SourceAlpha" operator="erode" radius="1" />
			<feGaussianBlur stdDeviation="1" />
			<feOffset dy="1" result="shadow" />
			<feMorphology in="SourceAlpha" result="erode2" operator="erode" radius="1" />
			<feColorMatrix
				in="erode2"
				result="border"
				values="1 0 0 0 0
                0 1 0 0 0.25
                0 0 1 0 1
                0 0 0 1 0"
			/>
			<feGaussianBlur stdDeviation="1" />
			<feOffset dy="-1" result="topglow" />
			<feMorphology in="SourceGraphic" operator="erode" radius="3" />
			<feMerge>
				<feMergeNode in="topglow" />
				<feMergeNode in="shadow" />
				<!-- <feMergeNode in="border" /> -->
				<feMergeNode />
			</feMerge>
		</filter>
		<filter id="THIRTY-SIX-PENTAGONS-blur">
			<feGaussianBlur stdDeviation="2.61" />
			<feMerge>
				<feMergeNode />
				<!-- <feMergeNode in="SourceGraphic" /> -->
			</feMerge>
		</filter>
		<style>
			svg#THIRTY-SIX-PENTAGONS {
				& g.filtered {
					filter: url(#THIRTY-SIX-PENTAGONS-shrink);
					fill: oklch(0 0 0 / 0.25);
				}
        & g#polygons, text {
          /* display: none; */
        }
		</style>
		<radialGradient id="THIRTY-SIX-PENTAGONS-bgr">
			<stop offset="0%" stop-color="oklch(0.5 100% 210)" />
			<stop offset="100%" stop-color="oklch(0.5 100% 210 / 0)" />
		</radialGradient>
	</defs>
	<Background {size} fill="oklch(0.15 10% 240)" />
	<Background size={size * Math.sqrt(2)} fill="url(#THIRTY-SIX-PENTAGONS-bgr" />
	<g id="lines">
		<LineWithLegend {lineArray} style="stroke:oklch(0.5 100% 240);" />
	</g>
	<g filter="url(#THIRTY-SIX-PENTAGONS-blur)">
		{#each intersectionCircles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style={`fill:oklch(0.99 50% 90);`} />
		{/each}
	</g>

	<g id="polygons">
		{#each polygonGroups as pg, pgi}
			{#each pg as points, i}
				<PolygonToRadial
					{points}
					angles={angles.map((a) => a - 90)}
					classname={`filtered p${i} pg${pgi}`}
					style={`fill:oklch(${0.1 + (1 / (polygonGroups.length + 1)) * pgi} 100% ${
						210 + (30 / polygonGroups.length) * pgi
					} )`}
					rotate={36}
				/>
			{/each}
		{/each}
	</g>
	<g filter="url(#THIRTY-SIX-PENTAGONS-blur)">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.99 0 0);fill:none;`} />
		{/each}
	</g>
	{#each circles as c}
		<circle r={c.r} cx={c.x} cy={c.y} style={`stroke:oklch(0.75 100% 210);fill:none;`} />
	{/each}
	<!-- <g id="original-polygons" style={`stroke:oklch(1 0 0);fill:oklch(1 0 0 / 0.1)`}>
		{#each circles as c, i}
			<path
				d={polygonPath(d, c.r, { center: { x: c.x, y: c.y }, rotate: rotate ? 360 / d / 2 : 0 })}
			/>
			<path
				d={polygonPath(d, c.r, { center: { x: c.x, y: c.y }, rotate: !rotate ? 360 / d / 2 : 0 })}
			/>
		{/each}
	</g> -->
</DopplerSvg>
