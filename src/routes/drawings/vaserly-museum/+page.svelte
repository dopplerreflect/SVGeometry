<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: ['hidden'],
		created_at: new Date(2023, 8, 25, 21),
		updated_at: new Date(2023, 8, 25, 21)
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
		pathFromIntersectionsOfLines,
		polygonPath,
		radialPoint
	} from '$lib/geometry';
	import { _1c } from 'svelte-highlight/languages';

	const id = 'VASERLY';
	const size = 2 ** 10;
	const divSize = size / 9;
	const divs = arrayMap(10, (n) => -size / 2 + n * divSize);
	const outerSquarePoints: Point[] = [
		...divs.slice(0, 9).map((d) => ({ x: -size / 2 + divSize / 2, y: divSize / 2 + d })),
		...divs.slice(0, 9).map((d) => ({ x: size / 2 - divSize / 2, y: divSize / 2 + d })),
		...divs.slice(1, 8).map((d) => ({ y: -size / 2 + divSize / 2, x: divSize / 2 + d })),
		...divs.slice(0, 9).map((d) => ({ y: size / 2 - divSize / 2, x: divSize / 2 + d }))
	];
	const cornerPoints: Point[] = [
		radialPoint(135, divSize / Math.sqrt(2), { center: outerSquarePoints[21] }),
		radialPoint(135, divSize / 2, { center: outerSquarePoints[21] }),
		radialPoint(135, divSize / 2 / Math.sqrt(2), { center: outerSquarePoints[21] }),

		radialPoint(45, divSize / 2 / Math.sqrt(2), { center: outerSquarePoints[21] }),
		radialPoint(45, divSize / 2, { center: outerSquarePoints[21] }),
		radialPoint(45, divSize / Math.sqrt(2), { center: outerSquarePoints[21] }),

		radialPoint(225, divSize * 1.5 * Math.sqrt(2)),
		radialPoint(225, divSize * 1.5),
		radialPoint(225, (divSize * 1.5) / Math.sqrt(2)),

		radialPoint(315, (divSize * 1.5) / Math.sqrt(2)),
		radialPoint(315, divSize * 1.5),
		radialPoint(315, divSize * 1.5 * Math.sqrt(2))
	];
	const centerRays: Line[] = cornerPoints.slice(0, 6).map((p, i) => [
		{ x: p.x, y: -size / 2 + divSize },
		{ x: cornerPoints[i + 6].x, y: -divSize * 1.5 }
	]);
	const perspectiveLines: Line[] = [
		[
			{ x: -divSize * 1.5, y: 0 },
			{ x: divSize * 1.5, y: -divSize * 3 }
		],
		[
			{ x: -divSize * 1.5, y: 0 },
			{ x: divSize * 1.5, y: -size / 2 }
		]
	];
	const perspectiveIntersection: Point = intersection(perspectiveLines[1], centerRays[5]);
	const lineArray: Line[] = [
		...centerRays,
		[
			{ x: -perspectiveIntersection.x, y: perspectiveIntersection.y },
			{ x: perspectiveIntersection.x, y: perspectiveIntersection.y }
		],
		[
			{ x: perspectiveIntersection.x, y: perspectiveIntersection.y },
			{ x: size / 2 - divSize, y: -divSize * 2.5 }
		],
		[
			{ x: -divSize * 0.9, y: -divSize * 2.7 },
			{ x: divSize * 0.9, y: -divSize * 2.7 }
		],
		[
			{ x: divSize * 0.9, y: -divSize * 2.7 },
			{ x: size / 2 - divSize, y: -divSize * 1.5 }
		],
		[
			{ x: -divSize * 1.5, y: -divSize * 1.5 },
			{ x: divSize * 1.5, y: -divSize * 1.5 }
		],
		[
			{ x: divSize * 1.5, y: -divSize * 1.5 },
			{ x: size / 2 - divSize, y: -divSize / 2 }
		],
		[
			{ x: divSize * 1.5, y: -size / 2 + divSize },
			{ x: divSize * 2.7, y: -divSize * 0.9 }
		],
		[
			{ x: divSize * 2.5, y: -size / 2 + divSize },
			{ x: -perspectiveIntersection.y, y: -perspectiveIntersection.x }
		],
		[
			{ x: -divSize / 2, y: -size / 2 + divSize },
			{ x: size / 2 - divSize, y: -size / 2 + divSize }
		],
		[
			{ x: size / 2 - divSize, y: -size / 2 + divSize },
			{ x: size / 2 - divSize, y: -divSize / 2 }
		]
	];
	const diagonalLines: Line[] = [
		[intersection(lineArray[0], lineArray[8]), intersection(lineArray[5], lineArray[10])],
		[intersection(lineArray[0], lineArray[10]), intersection(lineArray[8], lineArray[5])],
		[intersection(lineArray[8], lineArray[5]), intersection(lineArray[0], lineArray[6])],
		[intersection(lineArray[0], lineArray[8]), intersection(lineArray[5], lineArray[6])],
		[intersection(lineArray[5], lineArray[6]), intersection(lineArray[0], lineArray[14])],
		[intersection(lineArray[0], lineArray[6]), intersection(lineArray[5], lineArray[14])]
	];
	const innerLines: Line[] = [
		[intersection(diagonalLines[1], lineArray[1]), intersection(diagonalLines[0], lineArray[4])],
		[intersection(diagonalLines[1], lineArray[2]), intersection(diagonalLines[0], lineArray[3])],
		[intersection(diagonalLines[0], lineArray[2]), intersection(diagonalLines[1], lineArray[3])],
		[intersection(diagonalLines[0], lineArray[1]), intersection(diagonalLines[1], lineArray[4])],

		[intersection(diagonalLines[3], lineArray[1]), intersection(diagonalLines[2], lineArray[4])],
		[intersection(diagonalLines[3], lineArray[2]), intersection(diagonalLines[2], lineArray[3])],
		[intersection(diagonalLines[2], lineArray[2]), intersection(diagonalLines[3], lineArray[3])],
		[intersection(diagonalLines[2], lineArray[1]), intersection(diagonalLines[3], lineArray[4])],

		[intersection(diagonalLines[5], lineArray[1]), intersection(diagonalLines[4], lineArray[4])],
		[intersection(diagonalLines[5], lineArray[2]), intersection(diagonalLines[4], lineArray[3])],
		[intersection(diagonalLines[4], lineArray[2]), intersection(diagonalLines[5], lineArray[3])],
		[intersection(diagonalLines[4], lineArray[1]), intersection(diagonalLines[5], lineArray[4])]
	];
	const innerRightLines: Line[] = [
		[
			{ x: divSize * 1.4, y: innerLines[0][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[4].x - divSize }
		],
		[
			{ x: divSize * 1.33, y: innerLines[1][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[3].x - divSize }
		],
		[
			{ x: divSize * 1.1, y: innerLines[2][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[2].x - divSize }
		],
		[
			{ x: divSize * 1.06, y: innerLines[3][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[1].x - divSize }
		],

		[
			{ x: divSize * 0.92, y: innerLines[4][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[4].x - divSize * 2 }
		],
		[
			{ x: divSize * 0.88, y: innerLines[5][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[3].x - divSize * 2 }
		],
		[
			{ x: divSize * 0.7, y: innerLines[6][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[2].x - divSize * 2 }
		],
		[
			{ x: divSize * 0.68, y: innerLines[7][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[1].x - divSize * 2 }
		],

		[
			{ x: divSize * 0.62, y: innerLines[8][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[4].x - divSize * 3 }
		],
		[
			{ x: divSize * 0.6, y: innerLines[9][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[3].x - divSize * 3 }
		],
		[
			{ x: divSize * 0.54, y: innerLines[10][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[2].x - divSize * 3 }
		],
		[
			{ x: divSize * 0.52, y: innerLines[11][1].y },
			{ x: size / 2 - divSize, y: cornerPoints[1].x - divSize * 3 }
		]
	];
	const innerTopLines: Line[] = innerRightLines.map(
		(l) =>
			[
				{ x: -l[0].y, y: -l[0].x },
				{ x: -l[1].y, y: -l[1].x }
			] as Line
	);
	lineArray.push(...innerLines);
	lineArray.push(...innerRightLines);
	lineArray.push(...innerTopLines);
	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[0, 8, 5, 10, 0].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[5, 9, 12, 11, 5].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[1, 19, 4, 16, 1].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[40, 31, 43, 28, 40].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[2, 18, 3, 17, 2].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[41, 30, 42, 29, 41].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[0, 6, 5, 8, 0].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[5, 7, 12, 9, 5].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[12, 7, 13, 9, 12].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[12, 9, 13, 11, 12].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[1, 23, 4, 20, 1].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[40, 35, 43, 32, 40].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[44, 35, 47, 32, 44].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[44, 31, 47, 28, 44].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[2, 22, 3, 21, 2].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[41, 34, 42, 33, 41].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[45, 34, 46, 33, 45].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[45, 30, 46, 29, 45].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[0, 14, 5, 6, 0].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[5, 14, 12, 7, 5].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[12, 14, 13, 7, 12].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[13, 14, 15, 7, 13].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[13, 7, 15, 9, 13].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[13, 9, 15, 11, 13].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[1, 27, 4, 24, 1].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[40, 39, 43, 36, 40].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[44, 39, 47, 36, 44].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[48, 39, 51, 36, 48].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[48, 35, 51, 32, 48].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[48, 31, 51, 28, 48].map((i) => lineArray[i]), 'Z']),

		pathFromIntersectionsOfLines(['M', ...[2, 26, 3, 25, 2].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[41, 38, 42, 37, 41].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[45, 38, 46, 37, 45].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[49, 38, 50, 37, 49].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[49, 34, 50, 33, 49].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[49, 30, 50, 29, 49].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size} zoom={0} yPan={0} xPan={0}>
	<defs>
		<style>
			:root {
				--vaserlyPathOpacity: 1;
			}
			svg#VASERLY {
				& circle,
				line,
				path:not(.Background) {
					stroke: black;
					fill: none;
				}
				& path.A0 {
					fill: oklch(86% 86% 90 / var(--vaserlyPathOpacity));
				}
				& path.A1 {
					fill: oklch(16% 16% 217 / var(--vaserlyPathOpacity));
				}
				& path.A2 {
					fill: oklch(31% 25% 236 / var(--vaserlyPathOpacity));
				}
				& path.B0 {
					fill: oklch(80% 76% 95 / var(--vaserlyPathOpacity));
				}
				& path.B1 {
					fill: oklch(30% 22% 245 / var(--vaserlyPathOpacity));
				}
				& path.B2 {
					fill: oklch(46% 33% 235 / var(--vaserlyPathOpacity));
				}
				& path.C0 {
					fill: oklch(70% 60% 90 / var(--vaserlyPathOpacity));
				}
				& path.C1 {
					fill: oklch(47% 32% 226 / var(--vaserlyPathOpacity));
				}
				& path.C2 {
					fill: oklch(60% 36% 234 / var(--vaserlyPathOpacity));
				}

				& text {
					font-size: 0.5em;
				}
			}
		</style>
	</defs>
	<Background {size} fill="oklch(61% 37% 75 / 0.25)" />
	{#each outerSquarePoints as p}
		<path
			d={polygonPath(4, divSize / Math.sqrt(2), { center: p, rotate: 45 })}
			style="fill: oklch(61% 37% 75);"
		/>
		<path
			d={polygonPath(4, divSize / 2, { center: p, rotate: 45 })}
			style="fill: oklch(47% 34% 238);"
		/>
		<path
			d={polygonPath(4, divSize / 2 / Math.sqrt(2), { center: p, rotate: 45 })}
			style="fill: oklch(60% 40% 233);"
		/>
	{/each}
	<path
		d={polygonPath(4, (divSize * 3) / Math.sqrt(2), { rotate: 45 })}
		style="fill: oklch(90% 85% 95 /1);"
	/>
	<path d={polygonPath(4, divSize * 1.5, { rotate: 45 })} style="fill: oklch(31% 28% 249 /1);" />
	<path
		d={polygonPath(4, (divSize * 1.5) / Math.sqrt(2), { rotate: 45 })}
		style="fill: oklch(18% 18% 235 /1);"
	/>
	{#each anglesArray(4) as a}
		<g transform={`rotate(${a})`}>
			<!-- <LineWithLegend name="" {lineArray} showLegend /> -->
			{#each paths.slice(0, 2) as d}
				<path class="A0" {d} />
			{/each}
			{#each paths.slice(2, 4) as d}
				<path class="A1" {d} />
			{/each}
			{#each paths.slice(4, 6) as d}
				<path class="A2" {d} />
			{/each}
			{#each paths.slice(6, 10) as d}
				<path class="B0" {d} />
			{/each}
			{#each paths.slice(10, 14) as d}
				<path class="B1" {d} />
			{/each}
			{#each paths.slice(14, 18) as d}
				<path class="B2" {d} />
			{/each}
			{#each paths.slice(18, 24) as d}
				<path class="C0" {d} />
			{/each}
			{#each paths.slice(24, 30) as d}
				<path class="C1" {d} />
			{/each}
			{#each paths.slice(30, 36) as d}
				<path class="C2" {d} />
			{/each}
		</g>
	{/each}
</DopplerSvg>
