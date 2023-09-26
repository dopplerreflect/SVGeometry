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
			{ x: -divSize, y: -divSize * 2.5 },
			{ x: divSize, y: -divSize * 2.5 }
		],
		[
			{ x: divSize, y: -divSize * 2.5 },
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
			{ x: divSize * 2.5, y: -divSize }
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
	const innerTopLines = innerRightLines.map((l) => [
		{ x: -l[0].y, y: -l[0].x },
		{ x: -l[1].y, y: -l[1].x }
	]);
	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[0, 8, 5, 10, 0].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[5, 9, 12, 11, 5].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size} zoom={0} yPan={0}>
	<defs>
		<style>
			svg#VASERLY {
				& circle,
				line,
				path:not(.Background) {
					stroke: white;
					fill: none;
				}
				& path.black {
					fill: oklch(0 0 0 / 0.3);
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
		style="fill: oklch(92% 89% 94 /1);"
	/>
	<path d={polygonPath(4, divSize * 1.5, { rotate: 45 })} style="fill: oklch(32% 27% 243 /1);" />
	<path
		d={polygonPath(4, (divSize * 1.5) / Math.sqrt(2), { rotate: 45 })}
		style="fill: oklch(18% 18% 235 /1);"
	/>
	{#each anglesArray(4) as a}
		<g transform={`rotate(${a})`}>
			<LineWithLegend name="" {lineArray} />
			{#each paths as d}
				<path class="black" {d} />
			{/each}
			<!-- <LineWithLegend name="dl-" lineArray={diagonalLines} /> -->
			<LineWithLegend name="il-" lineArray={innerLines} />
			<LineWithLegend name="rl-" lineArray={innerRightLines} />
			<LineWithLegend name="tl-" lineArray={innerTopLines} />
		</g>
	{/each}
</DopplerSvg>
