<script context="module" lang="ts">
	export let metadata: DrawingMetadata = {
		tags: [],
		created_at: new Date(2023, 8, 22, 17),
		updated_at: new Date(2023, 8, 22, 21)
	};
</script>

<script lang="ts">
	import Background from '$lib/components/Background.svelte';
	import DopplerSvg from '$lib/components/DopplerSVG.svelte';
	import LineWithLegend from '$lib/components/LineWithLegend.svelte';
	import {
		anglesArray,
		pathFromIntersectionsOfLines,
		phi,
		radialPoint,
		radialPointString
	} from '$lib/geometry';

	const id = 'STARMESH';
	const size = 2 ** 10;
	const ro = (size / 2) * 0.95;
	const angles = anglesArray(10);
	const radii = [ro, ro * phi, ro * phi ** 2];
	const lineArray: Line[] = [
		...angles.map(
			(a, i) =>
				[radialPoint(angles[i], radii[0]), radialPoint(angles[(i + 2) % 10], radii[0])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(angles[i], radii[1]), radialPoint(angles[(i + 2) % 10], radii[1])] as Line
		),
		...angles.map(
			(a, i) =>
				[radialPoint(angles[i], radii[0]), radialPoint(angles[(i + 4) % 10], radii[0])] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % 10], radii[2], { center: radialPoint(a, radii[1]) }),
					radialPoint(angles[(i + 2) % 10], radii[2], { center: radialPoint(a, radii[1]) })
				] as Line
		),
		...angles.map(
			(a, i) =>
				[
					radialPoint(angles[(i + 8) % 10], radii[2], { center: radialPoint(a, radii[1]) }),
					radialPoint(angles[(i + 4) % 10], radii[2], {
						center: radialPoint(angles[(i + 2) % 10], radii[1])
					})
				] as Line
		)
	];
	const paths: string[] = [
		pathFromIntersectionsOfLines(['M', ...[10, 48, 19, 40, 18, 10].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[48, 20, 0, 9, 41, 48].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[9, 27, 0, 30, 41, 9].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[30, 0, 21, 31, 30].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[31, 27, 40, 48, 31].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[27, 41, 40, 20, 27].map((i) => lineArray[i]), 'Z']),
		pathFromIntersectionsOfLines(['M', ...[28, 27, 49, 20, 28].map((i) => lineArray[i]), 'Z'])
	];
</script>

<DopplerSvg {id} {size}>
	<defs>
		<style>
			svg#STARMESH {
				& circle,
				path:not(.Background),
				line {
					stroke: white;
					fill: none;
				}
				& #guide line {
					/* display: none; */
					stroke: oklch(0.5 100% 300);
					stroke-width: 1;
				}
				& #guide circle,
				#guide path {
					stroke: oklch(0.25 100% 300);
				}
				& #paths path,
				& #paths-unfilled path {
					/* display: none; */
					stroke: oklch(1 100% 180);
					stroke-width: 5;
					stroke-linejoin: round;
					fill: oklch(0 100% 300 / 0.5);
				}
				& #path-unfilled path {
					fill: none;
				}
			}
		</style>
		<filter id="starmesh-glow">
			<feMorphology in="SourceGraphic" operator="dilate" radius="4" result="dilate" />
			<feFlood flood-color="oklch(0.5 100% 300)" result="floodcolor" />
			<feComposite in="floodcolor" in2="dilate" operator="in" result="colordilate" />
			<feGaussianBlur in="colordilate" stdDeviation="4" result="glow" />
			<feMerge>
				<feMergeNode in="glow" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>
	<Background {size} fill="oklch(0.1 50% 300)" />
	<g id="paths-unfilled" filter="url(#starmesh-glow)">
		{#each angles as a}
			<g transform={`rotate(${a - 18})`}>
				{#each paths as d}
					<path {d} style="fill:none;" />
				{/each}
			</g>
		{/each}
	</g>

	<g id="guide">
		<LineWithLegend name="" {lineArray} />
		{#each angles as a}
			<circle r={radii[2]} cx={radialPoint(a, radii[1]).x} cy={radialPoint(a, radii[1]).y} />
			<path d={`M0 0 ${radialPointString(a, radii[0])}`} />
		{/each}
		<circle r={radii[0]} />
		<circle r={radii[1]} />
		<circle r={radii[2]} />
	</g>

	<g id="paths">
		{#each angles as a}
			<g transform={`rotate(${a - 18})`}>
				{#each paths as d}
					<path {d} />
				{/each}
			</g>
		{/each}
	</g>
</DopplerSvg>
