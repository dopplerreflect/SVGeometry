<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 23),
		updated_at: new Date(2023, 9, 25)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import PolygonToRadial from '$lib/components/PolygonToRadial.svelte';
	import {
		anglesArray,
		intersection,
		pentagram,
		phi,
		pointToString,
		polygonFromIntersectionOfLines,
		radialPoint,
		radialPointString,
		starPath
	} from '$lib/geometry';

	const id = 'STARRY-EYE';
	const size = 2 ** 10;
	const angles = anglesArray(10);
	const r = (size / 2) * phi * 0.95;
	const radii = [r, r * phi, r * phi ** 2, r * phi ** 3];
	const circles: Circle[] = [...radii.map((r) => ({ r, x: 0, y: 0 }))];
	angles.forEach((a, i) => {
		if (i % 2 === 0) {
			circles.push({ r: radii[1], ...radialPoint(a, radii[0]) });
			circles.push({ r: radii[2], ...radialPoint(a, radii[0]) });
			circles.push({ r: radii[3], ...radialPoint(a, radii[0]) });
		}
	});
	const lineArray: Line[] = [
		...angles.map(
			(a, i) => [radialPoint(a, radii[1]), radialPoint(angles[(i + 4) % 10], radii[1])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii[1]), radialPoint(angles[(i + 3) % 10], radii[1])] as Line
		),
		...angles.map(
			(a, i) => [radialPoint(a, radii[1]), radialPoint(angles[(i + 2) % 10], radii[1])] as Line
		)
	];
	angles.forEach((ao, io) => {
		if (io % 2 === 0) {
			angles.forEach((a, i) => {
				lineArray.push([
					radialPoint(a, radii[1], { center: radialPoint(ao, radii[0]) }),
					radialPoint(angles[(i + 4) % 10], radii[1], { center: radialPoint(ao, radii[0]) })
				]);
				lineArray.push([
					radialPoint(a, radii[1], { center: radialPoint(ao, radii[0]) }),
					radialPoint(angles[(i + 3) % 10], radii[1], { center: radialPoint(ao, radii[0]) })
				]);
				lineArray.push([
					radialPoint(a, radii[1], { center: radialPoint(ao, radii[0]) }),
					radialPoint(angles[(i + 2) % 10], radii[1], { center: radialPoint(ao, radii[0]) })
				]);
			});
		}
	});

	const polygonGroups: string[][] = [
		[
			polygonFromIntersectionOfLines([42, 33, 40, 43, 45, 36, 42], lineArray),
			polygonFromIntersectionOfLines([45, 36, 43, 48, 36, 46, 48, 39, 45], lineArray),
			polygonFromIntersectionOfLines([39, 30, 37, 42, 30, 40, 42, 33, 39], lineArray)
		],
		[
			polygonFromIntersectionOfLines([42, 48, 39, 46, 51, 39, 49, 51, 42], lineArray),
			polygonFromIntersectionOfLines([36, 57, 34, 39, 57, 37, 39, 30, 36], lineArray),
			polygonFromIntersectionOfLines([45, 51, 42, 49, 54, 42, 52, 54, 45], lineArray),
			polygonFromIntersectionOfLines([33, 57, 36, 34, 54, 36, 31, 54, 33], lineArray),
			polygonFromIntersectionOfLines([48, 54, 45, 52, 57, 45, 55, 57, 48], lineArray),
			polygonFromIntersectionOfLines([30, 54, 33, 31, 51, 33, 58, 51, 30], lineArray)
		],
		[
			polygonFromIntersectionOfLines([19, 0, 7, 9, 6, 18, 19], lineArray),
			polygonFromIntersectionOfLines([19, 1, 7, 10, 1, 8, 0, 7, 19], lineArray)
		],
		[
			polygonFromIntersectionOfLines([30, 36, 42, 48, 30], lineArray),
			polygonFromIntersectionOfLines([30, 51, 57, 48, 30], lineArray),
			polygonFromIntersectionOfLines([30, 55, 58, 48, 30], lineArray),
			[
				pointToString(intersection(lineArray[48], lineArray[54])),
				radialPointString(-90, radii[2] ** phi, { center: radialPoint(-90, radii[0]) }),
				pointToString(intersection(lineArray[54], lineArray[30])),
				pointToString(intersection(lineArray[36], lineArray[42]))
			].join(' ')
		],
		[
			polygonFromIntersectionOfLines([43, 18, 19, 40, 43], lineArray),
			polygonFromIntersectionOfLines([20, 41, 47, 28, 20], lineArray),
			polygonFromIntersectionOfLines([10, 37, 46, 17, 10], lineArray),
			polygonFromIntersectionOfLines([0, 33, 45, 6, 0], lineArray)
		],
		[
			polygonFromIntersectionOfLines([39, 75, 84, 30, 39], lineArray),
			polygonFromIntersectionOfLines([40, 79, 85, 34, 40], lineArray),
			polygonFromIntersectionOfLines([41, 83, 86, 38, 41], lineArray)
		]
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<filter id="STARRY-EYE-filter">
			<feMorphology in="SourceAlpha" operator="dilate" radius="3" />
			<feGaussianBlur stdDeviation="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>

		<style>
			svg#STARRY-EYE {
				& .filtered {
					filter: url(#STARRY-EYE-filter);
				}
				& polygon {
					stroke-width: 2;
				}
				& circle {
					fill: none;
					stroke: oklch(1 100% 90);
					stroke-width: 1;
				}
				& g#top-circles circle {
					stroke: oklch(1 25% 60);
				}
				& g#circles {
					filter: url(#STARRY-EYE-circle-glow);
				}
				& line {
					stroke: oklch(1 25% 300);
				}
				& .pg0 {
					fill: oklch(1 100% 60 / 0.75);
					stroke: oklch(1 100% 90);
				}
				& .pg1 {
					fill: oklch(0.25 100% 210);
					stroke: oklch(0.75 100% 210);
				}
				& .pg2 {
					fill: oklch(0.5 100% 0 / 0.33);
					stroke: oklch(1 100% 0);
				}
				& .pg3 {
					fill: oklch(1 25% 90 / 0.33);
					stroke: oklch(1 100% 60);
				}
				& .pg4 {
					fill: oklch(0.5 100% 210 / 0.25);
					stroke: oklch(1 100% 210);
				}
				& .pg5 {
					fill: oklch(0.5 100% 30 / 0.33);
					stroke: oklch(1 100% 60);
				}
			}
		</style>
		<filter id="STARRY-EYE-circle-glow">
			<feMorphology operator="dilate" radius="2" />
			<feGaussianBlur stdDeviation="5" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="STARRY-EYE-fuzz">
			<feTurbulence baseFrequency="0.33" />
			<feBlend in2="SourceGraphic" mode="luminosity" result="turb" />
			<feBlend in2="SourceGraphic" mode="multiply" result="fuzz" />
		</filter>
	</defs>
	<Background {size} fill="oklch(0 50% 300)" />
	<LineWithLegend {lineArray} />
	<g id="circles">
		{#each circles as c}
			<circle r={c.r} cx={c.x} cy={c.y} />
		{/each}
	</g>
	<g filter="url(#STARRY-EYE-fuzz)">
		{#each polygonGroups as pg, pgi}
			{#each pg as points, i}
				<PolygonToRadial
					{points}
					angles={angles.filter((a) => (a - 90) % 72 === 0).map((a) => a - 18)}
					classname={`filtered p${i} pg${pgi}`}
				/>
			{/each}
		{/each}
		<g id="top-circles">
			{#each circles as c}
				<circle r={c.r} cx={c.x} cy={c.y} />
			{/each}
		</g>
	</g>
</DopplerSvg>
