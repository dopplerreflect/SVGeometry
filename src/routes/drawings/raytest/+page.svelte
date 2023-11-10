<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 9, 15),
		updated_at: new Date(2023, 9, 15)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import {
		anglesArray,
		arrayMap,
		phi,
		polygonFromIntersectionOfLines,
		radialPoint
	} from '$lib/geometry';

	const id = 'RAYTEST';
	const size = 2 ** 10;
	const angles = anglesArray(20);
	const r = (size / 2) * 0.95;
	const lineArray: Line[] = [
		...angles.map((a) => [radialPoint(a, r), { x: 0, y: -r * phi ** 2 }] as Line),
		...angles.map((a) => [radialPoint(a, r), { x: 0, y: r * phi ** 2 }] as Line),
		[
			{ x: 0, y: -r * phi ** 2 },
			{ x: 0, y: r * phi ** 2 }
		]
	];
	const polygonGroups: string[][] = [
		[
			polygonFromIntersectionOfLines([11, 31, 33, 11], lineArray),
			polygonFromIntersectionOfLines([9, 29, 27, 9], lineArray)
		],
		[
			polygonFromIntersectionOfLines([12, 32, 11, 34, 12], lineArray),
			polygonFromIntersectionOfLines([11, 32, 34, 11], lineArray),
			polygonFromIntersectionOfLines([9, 28, 26, 9], lineArray),
			polygonFromIntersectionOfLines([8, 28, 9, 26, 8], lineArray)
		],
		[
			polygonFromIntersectionOfLines([13, 33, 12, 35, 13], lineArray),
			polygonFromIntersectionOfLines([12, 33, 11, 35, 12], lineArray),
			polygonFromIntersectionOfLines([11, 33, 35, 11], lineArray),
			polygonFromIntersectionOfLines([9, 27, 25, 9], lineArray),
			polygonFromIntersectionOfLines([8, 27, 9, 25, 8], lineArray),
			polygonFromIntersectionOfLines([7, 27, 8, 25, 7], lineArray)
		],
		[
			polygonFromIntersectionOfLines([14, 34, 13, 36, 14], lineArray),
			polygonFromIntersectionOfLines([13, 34, 12, 36, 13], lineArray),
			polygonFromIntersectionOfLines([12, 34, 11, 36, 12], lineArray),
			polygonFromIntersectionOfLines([11, 34, 36, 11], lineArray),
			polygonFromIntersectionOfLines([9, 26, 24, 9], lineArray),
			polygonFromIntersectionOfLines([8, 26, 9, 24, 8], lineArray),
			polygonFromIntersectionOfLines([7, 26, 8, 24, 7], lineArray),
			polygonFromIntersectionOfLines([6, 26, 7, 24, 6], lineArray)
		],
		[
			...arrayMap(4, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([15 - i, 35, 14 - i, 15 - i], lineArray)
			),
			polygonFromIntersectionOfLines([11, 35, 37, 11], lineArray),
			polygonFromIntersectionOfLines([9, 25, 23, 9], lineArray),
			...arrayMap(4, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([8 - i, 25, 9 - i, 8 - i], lineArray)
			)
		],
		[
			...arrayMap(5, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([16 - i, 36, 15 - i, 16 - i], lineArray)
			),
			polygonFromIntersectionOfLines([11, 36, 38, 11], lineArray),
			polygonFromIntersectionOfLines([9, 24, 22, 9], lineArray),
			...arrayMap(5, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([8 - i, 24, 9 - i, 8 - i], lineArray)
			)
		],
		[
			...arrayMap(6, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([17 - i, 37, 16 - i, 17 - i], lineArray)
			),
			polygonFromIntersectionOfLines([11, 37, 39, 11], lineArray),
			polygonFromIntersectionOfLines([9, 23, 21, 9], lineArray),
			...arrayMap(6, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([8 - i, 23, 9 - i, 8 - i], lineArray)
			)
		],
		[
			...arrayMap(8, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([18 - i, 38, 17 - i, 18 - i], lineArray)
			),
			...arrayMap(8, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([9 - i, 22, 10 - i, 18 - i], lineArray)
			)
		],
		[
			...arrayMap(9, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([19 - i, 39, 18 - i, 19 - i], lineArray)
			),
			...arrayMap(9, (n) => n).map((i) =>
				polygonFromIntersectionOfLines([9 - i, 21, 10 - i, 19 - i], lineArray)
			)
		]
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<linearGradient id="RAYTEST-lg" gradientTransform="rotate(90)">
			<stop offset="0%" stop-color="oklch(0.66 33% 60)" />
			<stop offset="100%" stop-color="oklch(0.33 33% 60)" />
		</linearGradient>
		<filter id="RAYTEST-filter" width={size / 2} height={size / 2}>
			<feFlood flood-color="oklch(0.25 50% 90)" />
			<feComposite in2="SourceGraphic" operator="in" />
			<feGaussianBlur stdDeviation="5" />
			<feOffset dy="10" />
			<feMerge>
				<feMergeNode />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
		<filter id="RAYTEST-shrink">
			<feMorphology in="SourceAlpha" operator="erode" radius="3" result="smallErode" />
			<feFlood flood-color="oklch(1 33% 60)" result="color" />
			<feComposite operator="in" in2="smallErode" result="border" />
			<feMorphology in="SourceGraphic" operator="erode" radius="4" result="bigErode" />
			<feMerge>
				<feMergeNode in="border" />
				<feMergeNode in="bigErode" />
			</feMerge>
		</filter>
		<filter id="RAYTEST-noise">
			<feTurbulence type="fractalNoise" baseFrequency="0.66" />
			<feColorMatrix type="saturate" values="0" />
		</filter>
	</defs>
	<Background {size} fill="url(#RAYTEST-lg)" />
	<Background {size} filter="url(#RAYTEST-noise)" />
	<circle
		{r}
		filter="url(#RAYTEST-filter)"
		style="fill:oklch(50% 66% 90 / 0.25);stroke:oklch(0.25 33% 60);stroke-width:2;"
	/>
	{#each polygonGroups as group, gi}
		<g
			style={`fill:oklch(${1 - (1 / (polygonGroups.length + 2)) * gi} 33% 60 / 1);`}
			filter="url(#RAYTEST-filter)"
		>
			{#each group as points, i}
				<polygon {points} filter="url(#RAYTEST-shrink" />
			{/each}
		</g>
	{/each}
</DopplerSvg>
