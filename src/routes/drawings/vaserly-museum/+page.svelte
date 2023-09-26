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
	import { arrayMap, polygonPath } from '$lib/geometry';

	const id = 'VASERLY';
	const size = 2 ** 10;
	const divSize = size / 9;
	const divs = arrayMap(10, (n) => -size / 2 + n * divSize);
	const lineArray: Line[] = [
		...divs.map(
			(x) =>
				[
					{ x, y: -size / 2 },
					{ x, y: size / 2 }
				] as Line
		),
		...divs.map(
			(y) =>
				[
					{ x: -size / 2, y },
					{ x: size / 2, y }
				] as Line
		)
	];
	const outerSquarePoints: Point[] = [
		...divs.slice(0, 9).map((d) => ({ x: -size / 2 + divSize / 2, y: divSize / 2 + d })),
		...divs.slice(0, 9).map((d) => ({ x: size / 2 - divSize / 2, y: divSize / 2 + d })),
		...divs.slice(1, 8).map((d) => ({ y: -size / 2 + divSize / 2, x: divSize / 2 + d })),
		...divs.slice(0, 9).map((d) => ({ y: size / 2 - divSize / 2, x: divSize / 2 + d }))
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#VASERLY {
				& circle,
				line,
				path:not(.Background) {
					stroke: black;
					fill: none;
				}
			}
		</style>
	</defs>
	<Background {size} fill="none" />
	<LineWithLegend name="" {lineArray} />
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
</DopplerSvg>
